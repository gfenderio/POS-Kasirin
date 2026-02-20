'use client'

import { useEffect, useCallback } from 'react'
import { db, PendingTransaction } from '@/lib/db-offline'
import { syncTransactionsAction } from '@/app/(main)/transactions/actions'

export function useCheckoutSync(options?: { onSyncSuccess?: () => void }) {

    /**
     * Internal function to perform the sync
     */
    const performSync = useCallback(async () => {
        const pending = await db.pendingTransactions.toArray()
        if (pending.length === 0) return

        console.log(`Auto-sync: Found ${pending.length} pending transactions.`)

        const result = await syncTransactionsAction(pending)

        if (result.success) {
            const idsToDelete = pending.map(tx => tx.id).filter((id): id is number => id !== undefined)
            await db.pendingTransactions.bulkDelete(idsToDelete)
            console.log('Auto-sync: Successfully synced and cleared local storage.')

            // Trigger callback to refresh UI
            if (options?.onSyncSuccess) {
                options.onSyncSuccess()
            }
        } else {
            console.error('Auto-sync: Sync failed.', result.error)
        }
    }, [options])

    /**
     * Background Sync Effect
     * Listens for the 'online' event to trigger revalidation of pending transactions
     */
    useEffect(() => {
        const handleOnline = () => {
            console.log('Network back online. Triggering sync...')
            performSync()
        }

        window.addEventListener('online', handleOnline)

        // Initial check on mount
        if (navigator.onLine) {
            performSync()
        }

        return () => window.removeEventListener('online', handleOnline)
    }, [performSync])

    /**
     * Process Checkout
     * Handles logic for either immediate sync or offline storage
     */
    const processCheckout = async (payload: Omit<PendingTransaction, 'offlineId' | 'status' | 'id'>) => {
        const isOnline = navigator.onLine
        const offlineId = crypto.randomUUID()

        // Always save to Dexie first for reliability
        const record = {
            ...payload,
            offlineId,
            status: 'PENDING' as any
        } as PendingTransaction

        await db.pendingTransactions.add(record)

        if (isOnline) {
            const syncResult = await syncTransactionsAction([record])
            if (syncResult.success) {
                // If direct sync succeeds, we can delete it immediately
                // This avoids double-sync if performSync triggers simultaneously
                const latest = await db.pendingTransactions.where('offlineId').equals(offlineId).first()
                if (latest?.id) await db.pendingTransactions.delete(latest.id)

                if (options?.onSyncSuccess) options.onSyncSuccess()
                return { success: true, offline: false, offlineId }
            } else {
                return { success: false, error: syncResult.error, offline: false, offlineId }
            }
        }

        return { success: true, offline: true, offlineId }
    }

    return { processCheckout, performSync }
}
