import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const customers = await prisma.tbl_customer.findMany()
        return NextResponse.json(customers)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
    }
}
