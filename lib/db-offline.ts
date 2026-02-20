import Dexie, { type Table } from 'dexie';

export interface OfflineTransactionItem {
    productId: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
}

export interface PendingTransaction {
    id?: number; // Internal Dexie auto-incrementing ID
    offlineId: string; // UUID/String for syncing
    totalAmount: number;
    discountTotal: number;
    finalAmount: number;
    amountPaid: number;
    paymentMethod: string;
    createdAt: string;
    items: OfflineTransactionItem[];
}

/**
 * PosOfflineDB: Dexie instance for storing transactions during network downtime.
 * Loosely mirrors Prisma models for easy backend synchronization.
 */
export class PosOfflineDB extends Dexie {
    pendingTransactions!: Table<PendingTransaction, number>;

    constructor() {
        super('PosOfflineDB');
        this.version(1).stores({
            pendingTransactions: '++id, offlineId'
        });
    }
}

export const db = new PosOfflineDB();
