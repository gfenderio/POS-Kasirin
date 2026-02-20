import { Plus } from 'lucide-react'

interface Product {
    idbar: string
    nama_barang: string
    harga_jual: number
    harga_beli: number
    stock: number
    foto: string
    barcode: string
}

interface ProductCardProps {
    product: Product
    onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const formatRupiah = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)
    }

    // Fallback for image
    const imageDisplay = (product.foto && product.foto.length > 5)
        ? <div className="h-full w-full bg-cover bg-center rounded-md" style={{ backgroundImage: `url('/asset/${product.foto}')` }} />
        : <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-2xl">
            {product.nama_barang.substring(0, 2).toUpperCase()}
        </div>

    return (
        <div className="flex flex-col rounded-xl bg-white dark:bg-[#16211C] p-4 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-primary/50">
            <div className="mb-3 h-32 w-full rounded-lg bg-gray-100 dark:bg-gray-800 object-cover overflow-hidden">
                {imageDisplay}
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-50 line-clamp-2 min-h-[2.5em]">{product.nama_barang}</h3>
            <div className="mt-auto flex items-center justify-between">
                <span className="text-sm font-bold text-primary">{formatRupiah(product.harga_jual)}</span>
                <button
                    onClick={() => onAddToCart(product)}
                    className="rounded-full bg-green-100 p-2 text-primary transition-colors hover:bg-primary hover:text-white dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-primary dark:hover:text-white"
                    type="button"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Stock: {product.stock}</span>
                <span className="font-mono text-[10px]">{product.barcode}</span>
            </div>
        </div>
    )
}
