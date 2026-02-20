import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import { deleteProduct } from './actions'

// Helper for formatting currency
const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
    const products = await prisma.tbl_barang.findMany({
        take: 50, // Limit for demo
        orderBy: { nama_barang: 'asc' }
    })

    return (
        <PageLayout>
            <PageHeader
                title="Manajemen Inventaris"
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#161f1a] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#283930] transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-sm">tune</span>
                        <span className="text-sm font-medium">Pengaturan</span>
                    </button>
                }
            />

            {/* Page Content */}
            <div className="flex flex-1 overflow-hidden min-h-[600px] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-[#111814]">
                {/* Filter Sidebar (Collapsible) - Keeping static for UI demo as requested */}
                <aside className="w-72 bg-slate-50 dark:bg-[#161f1a] border-r border-slate-200 dark:border-[#283930] overflow-y-auto hidden lg:block flex-shrink-0">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">Filter</h3>
                            <button className="text-xs text-primary hover:text-primary/80 font-medium">Reset Semua</button>
                        </div>
                        {/* Category Filter */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3 cursor-pointer group">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Kategori</label>
                                <span className="material-symbols-outlined text-slate-500 dark:text-[#9db9ab] text-lg">expand_less</span>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="w-4 h-4 rounded border-gray-600 bg-slate-100 dark:bg-[#283930] text-primary focus:ring-primary focus:ring-offset-[#161f1a]" type="checkbox" />
                                    <span className="text-sm text-slate-500 dark:text-[#9db9ab] group-hover:text-slate-800 dark:text-white transition-colors">Elektronik</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="w-4 h-4 rounded border-gray-600 bg-slate-100 dark:bg-[#283930] text-primary focus:ring-primary focus:ring-offset-[#161f1a]" type="checkbox" />
                                    <span className="text-sm text-slate-500 dark:text-[#9db9ab] group-hover:text-slate-800 dark:text-white transition-colors">Aksesoris</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="w-4 h-4 rounded border-gray-600 bg-slate-100 dark:bg-[#283930] text-primary focus:ring-primary focus:ring-offset-[#161f1a]" type="checkbox" />
                                    <span className="text-sm text-slate-500 dark:text-[#9db9ab] group-hover:text-slate-800 dark:text-white transition-colors">Mebel</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="w-4 h-4 rounded border-gray-600 bg-slate-100 dark:bg-[#283930] text-primary focus:ring-primary focus:ring-offset-[#161f1a]" type="checkbox" />
                                    <span className="text-sm text-slate-500 dark:text-[#9db9ab] group-hover:text-slate-800 dark:text-white transition-colors">Pakaian</span>
                                </label>
                            </div>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-[#283930] w-full mb-6"></div>
                        {/* Stock Status */}
                        <div>
                            <div className="flex items-center justify-between mb-3 cursor-pointer">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status Stok</label>
                                <span className="material-symbols-outlined text-slate-500 dark:text-[#9db9ab] text-lg">expand_less</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#283930] text-slate-800 dark:text-white hover:bg-primary hover:text-[#111814] transition-colors border border-transparent hover:border-primary">Tersedia</button>
                                <button className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-900/50 transition-colors">Stok Menipis</button>
                                <button className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#283930] text-slate-800 dark:text-white hover:bg-red-900/50 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30">Stok Habis</button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Data Table Area */}
                <section className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111814]">
                    {/* Action Bar */}
                    <div className="p-5 pb-0">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                            {/* Pencarian & Filter Cepat */}
                            <div className="flex flex-1 w-full md:w-auto gap-3">
                                <div className="relative flex-1 max-w-lg">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-[#9db9ab]">search</span>
                                    </div>
                                    <input className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-[#283930] rounded-lg leading-5 bg-slate-50 dark:bg-[#161f1a] text-slate-100 placeholder-[#9db9ab] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors" placeholder="Cari nama, SKU, atau barcode..." type="text" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#161f1a] border border-slate-200 dark:border-[#283930] rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:bg-[#283930] transition-colors">
                                    <span className="material-symbols-outlined text-sm">tune</span>
                                    <span className="text-sm font-medium">Urutkan</span>
                                </button>
                            </div>
                            {/* Primary Actions */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-500 dark:text-[#9db9ab] hover:text-slate-800 dark:text-white hover:bg-slate-100 dark:bg-[#283930] transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                    <span className="text-sm font-medium hidden sm:inline">Ekspor</span>
                                </button>
                                <Link href="/inventory/add" className="flex flex-1 md:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-[#10d473] text-[#111814] rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    <span className="text-sm">Tambah Produk</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="flex-1 overflow-auto px-5 pb-5">
                        <div className="min-w-full inline-block align-middle">
                            <div className="border border-slate-200 dark:border-[#283930] rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-[#283930]">
                                    <thead className="bg-slate-50 dark:bg-[#161f1a] sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left" scope="col">
                                                <input className="rounded border-gray-600 bg-slate-100 dark:bg-[#283930] text-primary focus:ring-primary focus:ring-offset-[#161f1a]" type="checkbox" />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-[#9db9ab] uppercase tracking-wider cursor-pointer hover:text-slate-800 dark:text-white group" scope="col">
                                                Produk
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-[#9db9ab] uppercase tracking-wider cursor-pointer hover:text-slate-800 dark:text-white group" scope="col">
                                                SKU / Barcode
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-[#9db9ab] uppercase tracking-wider" scope="col">Satuan</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-[#9db9ab] uppercase tracking-wider cursor-pointer hover:text-slate-800 dark:text-white group" scope="col">
                                                Harga
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-[#9db9ab] uppercase tracking-wider" scope="col">Stok</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-[#9db9ab] uppercase tracking-wider" scope="col">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-[#111814] divide-y divide-[#283930]">
                                        {products.map((product) => (
                                            <tr key={product.idbar} className="hover:bg-[#1c2a23] transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input className="rounded border-gray-600 bg-slate-100 dark:bg-[#283930] text-primary focus:ring-primary focus:ring-offset-[#161f1a]" type="checkbox" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded bg-slate-100 dark:bg-[#283930] overflow-hidden">
                                                            {product.foto ? (
                                                                <div
                                                                    className="h-10 w-10 bg-cover bg-center"
                                                                    style={{ backgroundImage: `url('${product.foto}')` }}
                                                                ></div>
                                                            ) : (
                                                                <div className="h-10 w-10 flex items-center justify-center text-slate-500 dark:text-[#9db9ab]">
                                                                    {product.nama_barang.substring(0, 1)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-800 dark:text-white">{product.nama_barang}</div>
                                                            <div className="text-xs text-slate-500 dark:text-[#9db9ab]">ID: {product.idbar}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-500 dark:text-[#9db9ab] font-mono">{product.barcode}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-800 dark:text-white">{product.satuan || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm font-medium text-slate-800 dark:text-white font-mono">{formatRupiah(product.harga_jual)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${product.stock <= 5
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                        : product.stock <= 20
                                                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                            : 'bg-primary/10 text-primary border-primary/20'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${product.stock <= 5 ? 'bg-red-400' : product.stock <= 20 ? 'bg-yellow-500' : 'bg-primary'
                                                            }`}></span>
                                                        {product.stock <= 0 ? 'Stok Habis' : `${product.stock} Tersedia`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/inventory/add?id=${product.idbar}`} className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit Data">
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </Link>
                                                        <form action={deleteProduct}>
                                                            <input type="hidden" name="idbar" value={product.idbar} />
                                                            <button type="submit" className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Hapus Produk">
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="bg-white dark:bg-[#111814] px-5 py-4 border-t border-slate-200 dark:border-[#283930] flex items-center justify-between flex-shrink-0">
                        <div className="text-sm text-slate-500 dark:text-[#9db9ab]">
                            Menampilkan <span className="font-medium text-slate-800 dark:text-white">1</span> sampai <span className="font-medium text-slate-800 dark:text-white">50</span> dari <span className="font-medium text-slate-800 dark:text-white">Banyak</span> hasil
                        </div>
                        <nav className="flex items-center gap-2">
                            <button className="flex items-center justify-center w-8 h-8 rounded border border-slate-200 dark:border-[#283930] text-slate-500 dark:text-[#9db9ab] hover:bg-slate-100 dark:bg-[#283930] hover:text-slate-800 dark:text-white transition-colors disabled:opacity-50">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="flex items-center justify-center w-8 h-8 rounded bg-primary text-[#111814] font-medium text-sm">1</button>
                            <button className="flex items-center justify-center w-8 h-8 rounded border border-slate-200 dark:border-[#283930] text-slate-500 dark:text-[#9db9ab] hover:bg-slate-100 dark:bg-[#283930] hover:text-slate-800 dark:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </nav>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}
