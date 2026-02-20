import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

export default async function ProductsPage({
    searchParams
}: {
    searchParams?: { search?: string }
}) {
    // Await searchParams for Next.js 15+ compatibility
    const params = await searchParams;
    const search = params?.search || '';

    const products = await prisma.tbl_barang.findMany({
        where: search ? {
            OR: [
                { nama_barang: { contains: search } },
                { barcode: { contains: search } }
            ]
        } : undefined,
        orderBy: { nama_barang: 'asc' }
    });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
            <header className="flex flex-col gap-4 p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Manajemen Produk</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Kelola inventaris dan stok produk</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Ekspor
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            Tambah Produk
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-gray-400 z-10">search</span>
                        <input
                            type="text"
                            placeholder="Cari nama, SKU, atau barcode..."
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">filter_list</span>
                        Filter
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-900 dark:text-slate-50">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Produk</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Barcode</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Harga</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-center">Stok</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {products.map((product) => (
                                <tr key={product.idbar} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden border border-slate-200 dark:border-slate-800">
                                                {product.foto && product.foto.length > 5 ? (
                                                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/asset/${product.foto}')` }} />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                        <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-slate-50">{product.nama_barang}</div>
                                                <div className="text-xs text-gray-500">ID: {product.idbar}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                                        {product.barcode}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {formatRupiah(product.harga_jual)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.stock <= 5
                                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                            : product.stock <= 20
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                                : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock <= 5 ? 'bg-red-500' : product.stock <= 20 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}></span>
                                            {product.stock <= 0 ? 'Habis' : `${product.stock} Unit`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-slate-900 dark:text-slate-50 dark:hover:bg-white/10 transition-colors">
                                            <span className="material-symbols-outlined text-[16px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
