import Dexie, { type Table } from 'dexie';

export interface PendingTransaction {
    id?: number; // Auto-incrementing Dexie ID
    offlineId: string;
    totalAmount: number;
    amountPaid: number;
    change: number;
    items: any[];
    timestamp: number;
}

export class OfflineDatabase extends Dexie {
    pendingTransactions!: Table<PendingTransaction, number>;

    constructor() {
        super('POSOfflineDatabase');
        this.version(1).stores({
            pendingTransactions: '++id, offlineId'
        });
    }
}

export const offlineDB = new OfflineDatabase();
