import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import { prisma } from '@/lib/prisma'
import { saveProduct } from '../actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AddEditInventory(props: { searchParams?: { id?: string } }) {
    // Next.js 15+ searchParams are async, optionally access gracefully
    const searchParams = props.searchParams || {};
    const id = searchParams.id;

    let product = null;
    if (id) {
        product = await prisma.tbl_barang.findUnique({ where: { idbar: id } });
    }

    return (
        <PageLayout>
            <PageHeader
                title={product ? "Edit Produk" : "Tambah Produk"}
                description="Isi form di bawah untuk menyimpan data produk ke inventaris"
            />

            <div className="bg-white dark:bg-[#16211C] p-6 lg:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl">
                <form action={saveProduct} className="flex flex-col gap-5">
                    <input type="hidden" name="idbar" value={product?.idbar || ''} />

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Barcode / SKU</label>
                        <input name="barcode" defaultValue={product?.barcode || `899${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`} readOnly={!!product} required placeholder="Contoh: 899..." className={`w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${!!product ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        {!!product && <p className="text-xs text-slate-500 mt-1 pb-2">Barcode tidak dapat diubah setelah produk dibuat.</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Barang</label>
                        <input name="nama_barang" defaultValue={product?.nama_barang || ''} required placeholder="Contoh: Indomie Goreng" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harga Beli (Modal)</label>
                            <input name="harga_beli" type="number" defaultValue={product?.harga_beli || ''} required min="0" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harga Jual</label>
                            <input name="harga_jual" type="number" defaultValue={product?.harga_jual || ''} required min="0" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stok Awal</label>
                            <input name="stock" type="number" defaultValue={product?.stock !== undefined ? product.stock : 0} required min="0" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Satuan</label>
                            <input name="satuan" defaultValue={product?.satuan || 'PCS'} required placeholder="PCS, KARTON, LITER..." className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Link Foto URL (Opsional)</label>
                        <input name="foto" defaultValue={product?.foto || ''} placeholder="Contoh: https://example.com/image.jpg atau nama file.jpg" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-[#111814] text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <Link href="/inventory" className="px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Batal</Link>
                        <button type="submit" className="bg-primary hover:bg-primary-hover px-8 py-2.5 rounded-lg text-primary-content font-bold shadow-lg shadow-primary/20 transition-all">
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
}
