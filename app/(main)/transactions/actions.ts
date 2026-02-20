'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { posCache } from '@/lib/cache'

export async function syncTransactionsAction(transactions: any[]) {
    console.log(`Syncing ${transactions.length} transactions...`)

    try {
        for (const tx of transactions) {
            // Fix: Shorten no_jual to fit VarChar(20) database limit
            const shortId = tx.offlineId?.split('-').pop() || Math.random().toString(36).substring(2, 12);
            const no_jual = `OFF-${shortId}`.substring(0, 20);
            const date = new Date(tx.createdAt);

            await prisma.$transaction(async (db) => {
                // 1. OVEERSELL PROTECTION: Validate stock
                for (const item of tx.items) {
                    const product = await db.tbl_barang.findUnique({
                        where: { idbar: item.productId }
                    });

                    if (!product || product.stock < item.qty) {
                        throw new Error(`Stok tidak mencukupi untuk ${item.nama_barang || item.productId}. Tersisa: ${product?.stock || 0}, Diminta: ${item.qty}`);
                    }
                }

                // 2. Create Header
                await db.tbl_jual_head.create({
                    data: {
                        no_jual,
                        tgl_jual: date,
                        total: tx.finalAmount,
                        jml_bayar: tx.amountPaid,
                        kembalian: tx.amountPaid - tx.finalAmount,
                        id_user: 1
                    }
                })

                // 3. Create Details and Update Stock
                for (const item of tx.items) {
                    await db.tbl_jual_detail.create({
                        data: {
                            no_jual,
                            barcode: item.idbar || item.productId,
                            nama_barang: item.nama_barang || 'Item POS',
                            harga_beli: item.harga_beli || 0,
                            harga_jual: item.unitPrice,
                            qty: item.qty,
                            subtotal: item.subtotal
                        }
                    })

                    // Decrement stock
                    await db.tbl_barang.update({
                        where: { idbar: item.productId },
                        data: { stock: { decrement: item.qty } }
                    })
                }
            })
        }

        // Clear POS Cache so next fetch gets fresh stock
        posCache.clear()
        console.log('POS Cache cleared after sync.')

        revalidatePath('/')
        revalidatePath('/pos')
        revalidatePath('/dashboard')
        revalidatePath('/transactions')
        revalidatePath('/inventory')
        revalidatePath('/reports')

        return { success: true }
    } catch (error: any) {
        console.error('Sync error:', error.message)
        return { success: false, error: error.message || 'Gagal sinkronisasi data' }
    }
}

