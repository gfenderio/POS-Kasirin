import { prisma } from '@/lib/prisma'
import { ConflictError, NotFoundError, ValidationError } from '../core/errors'

export interface TransactionItemPayload {
    barcode: string
    nama_barang: string
    harga_beli: number
    harga_jual: number
    qty: number
    subtotal: number
}

export interface CreateTransactionPayload {
    total: number
    jml_bayar: number
    kembalian: number
    id_user: number
    items: TransactionItemPayload[]
}

/**
 * Service Layer for Transaction Operations
 * Handles pure business rules, validation, and database orchestration independent of HTTP
 */
export class TransactionService {

    /**
     * Executes a new pos transaction against the database using PRISMA interactive transactions.
     * Prevents oversell and recalculates totals against database truth.
     * 
     * @param payload Payload object derived from client request
     * @returns The newly created transaction head record
     * @throws ValidationError if qty is invalid or payment is insufficient
     * @throws NotFoundError if a product barcode doesn't exist
     * @throws ConflictError if an oversell scenario is detected
     */
    static async createTransaction(payload: CreateTransactionPayload) {
        const { jml_bayar, id_user, items } = payload

        // Validate empty items
        if (!items || items.length === 0) {
            throw new ValidationError('Cart is empty')
        }

        // Validate Quantity logic
        const invalidQty = items.some(item => item.qty <= 0)
        if (invalidQty) {
            throw new ValidationError('Quantity must be greater than zero')
        }

        const date = new Date()
        const no_jual = `JUAL-${date.getTime()}`

        // Interactive Transaction to enforce Atomicity and validations
        return await prisma.$transaction(async (tx) => {
            let verifiedTotal = 0
            const validItems = []

            // 1. Verify Prices and Check Stock (Data Integrity)
            for (const item of items) {
                const product = await tx.tbl_barang.findFirst({
                    where: { barcode: item.barcode }
                })

                if (!product) {
                    throw new NotFoundError(`Product not found: ${item.barcode}`)
                }

                if (product.stock < item.qty) {
                    throw new ConflictError(`Integritas Stok Gagal: Sisa stok untuk ${product.nama_barang} adalah ${product.stock}, sedangkan keranjang meminta ${item.qty}`);
                }

                // Server-forced pricing (never trust client 'harga_jual' or 'subtotal')
                const verifiedHargaJual = product.harga_jual
                const verifiedSubtotal = verifiedHargaJual * item.qty
                verifiedTotal += verifiedSubtotal

                // Push clean item
                validItems.push({
                    barcode: item.barcode,
                    nama_barang: product.nama_barang,
                    harga_beli: product.harga_beli, // Real COGS
                    harga_jual: verifiedHargaJual,
                    qty: item.qty,
                    subtotal: verifiedSubtotal
                })

                // Safely update stock decrement
                await tx.tbl_barang.update({
                    where: { idbar: product.idbar },
                    data: {
                        stock: {
                            decrement: item.qty
                        }
                    }
                })
            }

            // Trust but Verify Client total & payment
            if (jml_bayar < verifiedTotal) {
                throw new ValidationError(`Pembayaran Kurang. Total aktual adalah ${verifiedTotal} tetapi dibayar ${jml_bayar}`);
            }

            // 2. Create Transaction Records using Verified Server Logic
            const head = await tx.tbl_jual_head.create({
                data: {
                    no_jual,
                    tgl_jual: date,
                    total: verifiedTotal,
                    jml_bayar,
                    kembalian: jml_bayar - verifiedTotal,
                    id_user
                }
            })

            // Create Details
            for (const vItem of validItems) {
                await tx.tbl_jual_detail.create({
                    data: {
                        no_jual,
                        ...vItem
                    }
                })
            }

            return head
        })
    }
}
