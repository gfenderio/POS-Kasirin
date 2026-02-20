import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    let dbStatus = 'Connected'
    let productCount = 0
    let customerCount = 0
    let transactionCount = 0
    let totalRevenue = { _sum: { total: 0 } }
    let recentTransactions: any[] = []

    try {
        productCount = await prisma.tbl_barang.count()
        customerCount = await prisma.tbl_customer.count()
        transactionCount = await prisma.tbl_jual_head.count()

        const revAgg = await prisma.tbl_jual_head.aggregate({
            _sum: { total: true }
        })
        if (revAgg) totalRevenue = { _sum: { total: revAgg._sum.total || 0 } };

        recentTransactions = await prisma.tbl_jual_head.findMany({
            take: 5,
            orderBy: { tgl_jual: 'desc' },
            select: { no_jual: true, tgl_jual: true, total: true, id_user: true }
        })
    } catch (e) {
        dbStatus = 'Disconnected'
        console.error("Database connection failed", e)
    }

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

    return (
        <PageLayout>
            <PageHeader
                title="Beranda"
                description="Selamat datang kembali di POS Kasirin"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* KPI 1: Total Products */}
                <Link href="/inventory" className="rounded-xl bg-white dark:bg-[#16211C] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Products</p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{productCount}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                        </div>
                    </div>
                </Link>

                {/* KPI 2: Total Customers */}
                <Link href="/customers" className="rounded-xl bg-white dark:bg-[#16211C] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Customers</p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{customerCount}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-[24px]">group</span>
                        </div>
                    </div>
                </Link>

                {/* KPI 3: Total Transactions */}
                <Link href="/transactions" className="rounded-xl bg-white dark:bg-[#16211C] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Transactions</p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{transactionCount}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                        </div>
                    </div>
                </Link>

                {/* KPI 4: Total Revenue */}
                <Link href="/reports" className="rounded-xl bg-white dark:bg-[#16211C] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50 truncate" title={formatRupiah(totalRevenue._sum.total || 0)}>
                                {formatRupiah(totalRevenue._sum.total || 0)}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                            <span className="material-symbols-outlined text-[24px]">payments</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white dark:bg-[#16211C] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Aktivitas Terkini</h3>
                        <Link href="/reports" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>

                    {recentTransactions.length > 0 ? (
                        <div className="flex flex-col gap-3 flex-1">
                            {recentTransactions.map((tx) => (
                                <div key={tx.no_jual} className="flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 dark:text-white">#{tx.no_jual}</p>
                                            <p className="text-xs text-slate-500">{new Date(tx.tgl_jual).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{formatRupiah(tx.total)}</p>
                                        <p className="text-xs text-slate-500">Kasir: {tx.id_user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">trending_up</span>
                            <p>Belum ada transaksi</p>
                        </div>
                    )}
                </div>
                <div className="rounded-xl bg-white dark:bg-[#16211C] p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">Status Sistem</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">database</span> Database (Prisma)
                            </span>
                            {dbStatus === 'Connected' ? (
                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">Terhubung</span>
                            ) : (
                                <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium border border-red-200 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">cloud_off</span> Terputus
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">trending_up</span> Mode Performa
                            </span>
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">50k SKU Optimized</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">inventory_2</span> Versi Aplikasi
                            </span>
                            <span className="text-sm font-mono text-slate-900 dark:text-slate-50 font-medium border px-2 py-0.5 rounded border-slate-200 dark:border-slate-800">v1.1.0-clean</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
