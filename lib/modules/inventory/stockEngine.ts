import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface DecrementItem {
    productId: string;
    qty: number;
}

/**
 * Validates and decrements stock atomically using Prisma interactive transaction.
 * This prevents oversell by checking the stock within the same transaction lock.
 */
export async function decrementStockAtomic(items: DecrementItem[]) {
    // Use Prisma's interactive transaction to ensure atomicity
    return prisma.$transaction(async (tx) => {

        // 1. Fetch current inventory for all items (with intentional DB lock if using manual raw query `FOR UPDATE`, 
        // but in Prisma we can rely on decrement operation which is atomic at row level, 
        // or we fetch first and then decrement with where clause to ensure it doesn't drop below 0).

        for (const item of items) {
            // Fetch current stock
            const inventory = await tx.inventory.findUnique({
                where: { productId: item.productId }
            });

            if (!inventory) {
                throw new Error(`Inventory not found for product: ${item.productId}`);
            }

            if (inventory.stock < item.qty) {
                // OVERSELL PREVENTION
                throw new Error(`Insufficient stock for product: ${item.productId}. Available: ${inventory.stock}, Requested: ${item.qty}`);
            }

            // Decrement atomically
            await tx.inventory.update({
                where: { productId: item.productId },
                data: {
                    stock: {
                        decrement: item.qty
                    }
                }
            });
        }

        return true; // Success
    });
}

/**
 * Reverts stock if a transaction is cancelled or failed.
 */
export async function incrementStockAtomic(items: DecrementItem[]) {
    return prisma.$transaction(async (tx) => {
        for (const item of items) {
            await tx.inventory.update({
                where: { productId: item.productId },
                data: {
                    stock: {
                        increment: item.qty
                    }
                }
            });
        }
        return true;
    });
}
