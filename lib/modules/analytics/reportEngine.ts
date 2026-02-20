import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Aggregates top selling products based on transaction history over a specific period.
 * Connects to `transactionItem` model via B-Tree Index to prevent full table scans.
 * @param days The lookback window in days (default: 30)
 * @returns Array of products sorted by `totalSold` descending.
 */
export async function getTopSellingProducts(days: number = 30) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    const topItems = await prisma.transactionItem.groupBy({
        by: ['productId'],
        where: {
            transaction: {
                createdAt: {
                    gte: pastDate
                }
            }
        },
        _sum: {
            qty: true,
            subtotal: true
        },
        orderBy: {
            _sum: {
                qty: 'desc'
            }
        },
        take: 10
    });

    // Enrich with product names (groupBy doesn't include relations)
    const productIds = topItems.map(item => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, categoryId: true }
    });

    return topItems.map((item: any) => {
        const p = products.find((prod: any) => prod.id === item.productId);
        return {
            productId: item.productId,
            name: p?.name || 'Unknown',
            categoryId: p?.categoryId || 'Uncategorized',
            totalSold: item._sum.qty || 0,
            revenue: item._sum.subtotal || 0,
        };
    });
}

/**
 * Calculates Gross Sales, Total COGS, and Net Profit per day for the dashboard PnL Area Chart.
 * Performs day-by-day calculations sequentially. Memory is O(N) where N is items per day.
 * @param days The lookback window in days (default: 7)
 * @returns A strictly formatted array matching Recharts requirements
 */
export async function getDailyPnL(days: number = 7) {
    const result: { date: string, grossSales: number, totalCogs: number, netProfit: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - i);
        targetDate.setHours(0, 0, 0, 0);

        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        const items = await prisma.transactionItem.findMany({
            where: {
                transaction: {
                    createdAt: {
                        gte: targetDate,
                        lt: nextDate
                    }
                }
            },
            select: {
                qty: true,
                unitPrice: true,
                unitCogs: true,
                discount: true
            }
        });

        let grossSales = 0;
        let totalCogs = 0;
        let netProfit = 0;

        for (const item of items) {
            const itemRevenue = (item.qty * item.unitPrice) - item.discount;
            const itemCogs = item.qty * item.unitCogs;

            grossSales += itemRevenue;
            totalCogs += itemCogs;
            netProfit += (itemRevenue - itemCogs);
        }

        result.push({
            date: targetDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            grossSales,
            totalCogs,
            netProfit
        });
    }

    return result;
}
