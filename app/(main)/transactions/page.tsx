import { prisma } from '@/lib/prisma'
import { Download, Filter, Eye, DollarSign, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

export default async function TransactionsPage() {
    const transactions = await prisma.tbl_jual_head.findMany({
        take: 50,
        orderBy: { tgl_jual: 'desc' }
    })

    // Calculate totals
    const revenueAgg = await prisma.tbl_jual_head.aggregate({
        _sum: { jml_bayar: true }
    })
    const totalRevenue = revenueAgg._sum.jml_bayar || 0
    const transactionCount = await prisma.tbl_jual_head.count()

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
            <header className="flex flex-col gap-4 p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Riwayat Transaksi</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pantau penjualan dan pendapatan toko</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                            <Download className="h-4 w-4" />
                            Ekspor Laporan
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Pendapatan</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{formatRupiah(totalRevenue)}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Transaksi</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{transactionCount}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-900 dark:text-slate-50">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">ID Transaksi</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Waktu</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Pelanggan</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Total</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-center">Status</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {transactions.map((tx) => (
                                <tr key={tx.no_jual} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                                        #{tx.no_jual}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        {new Date(tx.tgl_jual).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        {tx.id_user === 1 ? 'Umum' : `User ${tx.id_user}`}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-slate-50">
                                        {formatRupiah(tx.jml_bayar)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Selesai
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-slate-900 dark:text-slate-50 dark:hover:bg-white/10 transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-600 dark:text-slate-400">
                                        Belum ada riwayat transaksi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
