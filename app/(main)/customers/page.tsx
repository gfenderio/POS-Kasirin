import { prisma } from '@/lib/prisma'
import { Plus, Search, MoreVertical, Phone, MapPin, User } from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
    const customers = await prisma.tbl_customer.findMany({
        orderBy: { nama: 'asc' }
    })

    return (
        <PageLayout>
            <PageHeader
                title="Data Pelanggan"
                description="Kelola informasi pelanggan toko Anda"
                action={
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content hover:bg-primary-hover transition-colors shadow-sm">
                        <Plus className="h-4 w-4" />
                        Tambah Pelanggan
                    </button>
                }
            />

            <div className="relative max-w-md mt-4 mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari pelanggan..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm transition-colors"
                />
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-900 dark:text-slate-50">
                    <thead className="bg-gray-50 dark:bg-[#111814] border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Nama</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Telepon</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Alamat</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {customers.map((customer) => (
                            <tr key={customer.id_customer} className="hover:bg-gray-50 dark:hover:bg-[#111814] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{customer.nama}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Phone className="h-3 w-3" />
                                        {customer.telpon || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                        <MapPin className="h-3 w-3" />
                                        {customer.alamat || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-slate-900 dark:text-slate-50 dark:hover:bg-white/10 transition-colors">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-600 dark:text-slate-400">
                                    Belum ada data pelanggan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    )
}
