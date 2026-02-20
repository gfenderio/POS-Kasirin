import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'

// Helper
const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

export const dynamic = 'force-dynamic'

export default async function ReportsPage(props: { searchParams?: { period?: string } }) {
    // Await params if using Next.js 15+, or use directly in Next.js 14. We'll access gracefully.
    const searchParams = props.searchParams || {};
    const currentPeriod = searchParams.period || 'mingguan';

    // Note: tbl_jual_head does not have a relation to customer defined in schema.prisma.
    // We will display without customer name for now.
    const transactions = await prisma.tbl_jual_head.findMany({
        take: 20,
        orderBy: { tgl_jual: 'desc' },
    })

    const transactionCount = await prisma.tbl_jual_head.count()
    const productCount = await prisma.tbl_barang.count()

    // Calculate total revenue
    const revenueAgg = await prisma.tbl_jual_head.aggregate({
        _sum: {
            total: true
        }
    })
    const totalRevenue = revenueAgg._sum.total || 0

    return (
        <PageLayout>
            <PageHeader
                title="Laporan Penjualan & Analitik"
                description="Ringkasan kinerja toko untuk periode yang dipilih."
                action={
                    <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
                        <div className="flex items-center bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm">
                            <Link href="?period=harian" className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${currentPeriod === 'harian' ? 'bg-primary text-primary-content font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'}`}>Harian</Link>
                            <Link href="?period=mingguan" className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${currentPeriod === 'mingguan' ? 'bg-primary text-primary-content font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'}`}>Mingguan</Link>
                            <Link href="?period=bulanan" className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${currentPeriod === 'bulanan' ? 'bg-primary text-primary-content font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50'}`}>Bulanan</Link>
                        </div>
                        <button className="flex items-center gap-2 h-10 px-4 bg-primary hover:bg-primary-hover text-primary-content text-sm font-bold rounded-lg transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            <span>Ekspor</span>
                        </button>
                    </div>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            <span>12.5%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Pendapatan</p>
                        <p className="text-slate-900 dark:text-slate-50 text-2xl font-bold mt-1">{formatRupiah(totalRevenue)}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>

                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Transaksi</p>
                        <p className="text-slate-900 dark:text-slate-50 text-2xl font-bold mt-1">{transactionCount}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400">
                            <span className="material-symbols-outlined">local_mall</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Produk</p>
                        <p className="text-slate-900 dark:text-slate-50 text-2xl font-bold mt-1">{productCount}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#16211C] rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-slate-900 dark:text-slate-50 font-bold text-lg">Tren Pendapatan</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">Perbandingan pendapatan harian</p>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-3 sm:gap-6 min-h-[240px] px-2 pb-2">
                        {/* Mock Chart Bars */}
                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
                            <div key={day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className={`w-full rounded-t-sm transition-all relative ${i === 2 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200 dark:bg-gray-800 group-hover:bg-primary/40'}`} style={{ height: `${40 + (i * 8)}%` }}></div>
                                <span className={`text-xs font-medium ${i === 2 ? 'text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Category Breakdown (Placeholder) */}
                <div className="bg-white dark:bg-[#16211C] rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-slate-900 dark:text-slate-50 font-bold text-lg">Penjualan per Kategori</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">Distribusi</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                        <div className="relative size-48 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 shadow-inner">
                            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(var(--primary) 0% 45%, transparent 45% 100%)' }}></div>
                            <div className="size-32 bg-white dark:bg-[#16211C] rounded-full flex flex-col items-center justify-center z-10 shadow-sm border border-slate-200 dark:border-slate-800/50">
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Kategori Teratas</span>
                                <span className="text-slate-900 dark:text-slate-50 text-2xl font-bold">Makanan</span>
                                <span className="text-primary text-sm font-bold">45%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-[#16211C] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-slate-900 dark:text-slate-50 font-bold text-lg">Transaksi Terkini</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800">
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID Pesanan</th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tanggal & Waktu</th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pelanggan</th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Jumlah</th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {transactions.map((tx) => (
                                <tr key={tx.no_jual} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-50 font-mono">#{tx.no_jual}</td>
                                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">{new Date(tx.tgl_jual).toLocaleString('id-ID')}</td>
                                    <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-50">
                                        {/* Customer relation missing, showing ID User or anonymous */}
                                        Pelanggan {tx.id_user}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-900 dark:text-slate-50 font-bold font-mono">{formatRupiah(tx.total)}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageLayout>
    )
}
