import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { posCache } from '@/lib/cache'

export async function GET() {
    try {
        const CACHE_KEY = 'all_products';
        let products = posCache.get(CACHE_KEY);

        if (!products) {
            products = await prisma.tbl_barang.findMany();
            // Store raw objects to cache
            posCache.set(CACHE_KEY, products);
        }

        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}
