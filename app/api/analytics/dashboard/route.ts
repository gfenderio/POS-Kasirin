import { NextResponse } from 'next/server';
import { getDailyPnL, getTopSellingProducts } from '@/lib/modules/analytics/reportEngine';
import { generateRestockRecommendations } from '@/lib/modules/analytics/aiStockEngine';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Top Selling Products
        const topProductsPromise = getTopSellingProducts(30);

        // 2. Fetch PnL
        const pnlPromise = getDailyPnL(7);

        // 3. Prepare AI Data
        // To feed brain.js, we need historical arrays of sales per product for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const aiDataPromise = prisma.transactionItem.findMany({
            where: {
                transaction: {
                    createdAt: { gte: thirtyDaysAgo }
                }
            },
            select: {
                productId: true,
                qty: true,
                transaction: {
                    select: { createdAt: true }
                },
                product: {
                    select: { name: true }
                }
            }
        }).then((items: any[]) => {
            const productMap = new Map<string, { productId: string, name: string, history: number[] }>();

            items.forEach(item => {
                const txDate = new Date(item.transaction.createdAt);
                const daysAgo = Math.floor((new Date().getTime() - txDate.getTime()) / (1000 * 3600 * 24));
                const index = 29 - daysAgo;

                if (index >= 0 && index < 30) {
                    let p = productMap.get(item.productId);
                    if (!p) {
                        p = { productId: item.productId, name: item.product.name, history: new Array(30).fill(0) };
                        productMap.set(item.productId, p);
                    }
                    p.history[index] += item.qty;
                }
            });

            return Array.from(productMap.values());
        });

        const [topProducts, pnl, salesHistories] = await Promise.all([
            topProductsPromise,
            pnlPromise,
            aiDataPromise
        ]);

        // Run ML Prediction (runs synchronously using JS CPU, fine for small dataset/demo)
        // Usually should be placed in background job if dataset is huge.
        const recommendations = await generateRestockRecommendations(salesHistories);

        return NextResponse.json({
            success: true,
            data: {
                topProducts,
                pnl,
                recommendations: recommendations.slice(0, 5) // Return Top 5 alerts
            }
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to generate analytics' }, { status: 500 });
    }
}
