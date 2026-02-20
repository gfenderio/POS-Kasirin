'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { posCache } from '@/lib/cache'

export async function saveProduct(formData: FormData) {
    const rawId = formData.get('idbar') as string;
    const idbar = rawId || `BRG${Date.now()}`;
    const barcode = formData.get('barcode') as string;
    const nama_barang = formData.get('nama_barang') as string;
    const harga_beli = Number(formData.get('harga_beli'));
    const harga_jual = Number(formData.get('harga_jual'));
    const stock = Number(formData.get('stock'));
    const satuan = formData.get('satuan') as string || 'PCS';
    const foto = formData.get('foto') as string || '';

    await prisma.tbl_barang.upsert({
        where: { idbar },
        update: {
            nama_barang, harga_beli, harga_jual, stock, satuan, foto
        },
        create: {
            idbar, barcode, nama_barang, harga_beli, harga_jual, stock, satuan,
            stock_minimal: '0', foto
        }
    });

    // Invalidate POS cache
    posCache.delete('all_products');

    revalidatePath('/inventory');
    redirect('/inventory');
}

export async function deleteProduct(formData: FormData) {
    const idbar = formData.get('idbar') as string;
    if (idbar) {
        await prisma.tbl_barang.delete({ where: { idbar } });
        // Invalidate POS cache
        posCache.delete('all_products');
        revalidatePath('/inventory');
    }
}
