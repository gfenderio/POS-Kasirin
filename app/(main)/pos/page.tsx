'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useCheckoutSync } from '@/hooks/useCheckoutSync'
import { usePosShortcuts } from '@/hooks/usePosShortcuts'
import PaymentModal from './PaymentModal'

// Dynamic import with SSR disabled to reduce initial HTML payload and JS bundle for 50k items
const ProductCard = dynamic(() => import('@/components/ProductCard'), {
    ssr: false,
    loading: () => <div className="h-[280px] w-[200px] animate-pulse rounded-xl bg-gray-100 dark:bg-surface-dark/50"></div>
})

// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

interface Product {
    idbar: string
    nama_barang: string
    harga_jual: number
    harga_beli: number
    stock: number
    foto: string
    barcode: string
}

interface CartItem extends Product {
    qty: number
    subtotal: number
}

export default function POSPage() {
    const { mutate } = useSWRConfig()
    const { data: products, error: productsError } = useSWR<Product[]>('/api/products', fetcher)
    const { processCheckout, performSync } = useCheckoutSync({
        onSyncSuccess: () => mutate('/api/products')
    })

    const [cart, setCart] = useState<CartItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

    // Keyboard Shortcuts Integration
    const { searchInputRef, payInputRef } = usePosShortcuts({
        selectedIndex,
        setSelectedIndex,
        listLength: useMemo(() => {
            if (!products) return 0;
            return products.filter(p =>
                p.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.barcode.includes(searchQuery)
            ).length;
        }, [products, searchQuery]),
        onAddToCart: (idx) => {
            const results = products?.filter(p =>
                p.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.barcode.includes(searchQuery)
            ) || [];
            if (results[idx]) addToCart(results[idx]);
        },
        onCheckout: () => setIsPaymentModalOpen(true)
    });

    useEffect(() => {
        setIsOnline(navigator.onLine)
        const handleOnline = () => { setIsOnline(true); performSync(); }
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [performSync])

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!products) return []
        return products.filter((p) =>
            p.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.barcode.includes(searchQuery)
        )
    }, [products, searchQuery])

    // Reset selected index on search
    useEffect(() => setSelectedIndex(0), [searchQuery])

    // Cart calculations
    const totalAmount = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.subtotal, 0)
    }, [cart])

    // Helpers
    const addToCart = useCallback((product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.barcode === product.barcode)
            if (existing) {
                return prev.map((item) =>
                    item.barcode === product.barcode
                        ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.harga_jual }
                        : item
                )
            }
            return [...prev, { ...product, qty: 1, subtotal: product.harga_jual }]
        })
    }, [])

    const removeFromCart = (barcode: string) => {
        setCart((prev) => prev.filter((item) => item.barcode !== barcode))
    }

    const updateQty = (barcode: string, delta: number) => {
        setCart((prev) => {
            return prev.map((item) => {
                if (item.barcode === barcode) {
                    const newQty = Math.max(1, item.qty + delta)
                    return { ...item, qty: newQty, subtotal: newQty * item.harga_jual }
                }
                return item
            })
        })
    }

    const handleFinalCheckout = async (paymentMethod: 'CASH' | 'QRIS', amountPaid: number) => {
        if (cart.length === 0) return

        setIsProcessing(true)
        try {
            const result = await processCheckout({
                totalAmount,
                discountTotal: 0,
                finalAmount: totalAmount,
                amountPaid: amountPaid,
                paymentMethod: paymentMethod,
                createdAt: new Date().toISOString(),
                items: cart.map(item => ({
                    productId: item.idbar,
                    idbar: item.idbar,
                    nama_barang: item.nama_barang,
                    harga_beli: item.harga_beli,
                    qty: item.qty,
                    unitPrice: item.harga_jual,
                    subtotal: item.subtotal
                }))
            })

            if (result.success) {
                alert(result.offline ? 'Tersimpan offline! Data akan disinkronkan saat online.' : 'Transaksi berhasil!')
                setCart([])
                setIsPaymentModalOpen(false)
                mutate('/api/products')
            } else {
                alert(`Gagal memproses transaksi: ${result.error}`)
            }
        } catch (error: any) {
            console.error(error)
            alert('Gagal memproses transaksi')
        } finally {
            setIsProcessing(false)
        }
    }


    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

    if (productsError) return <div className="p-8 text-center text-red-500">Gagal memuat data produk</div>
    if (!products) return <div className="flex h-screen items-center justify-center text-primary"><span className="material-symbols-outlined text-[32px] animate-spin">refresh</span></div>

    return (
        <div className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-2rem)] gap-0 lg:gap-6 p-0 lg:p-6 overflow-hidden relative bg-slate-50 dark:bg-black/20">
            {/* Left: Product Selection */}
            <div className="flex flex-1 flex-col overflow-hidden p-4 lg:p-0">
                <div className="mb-4 sm:mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 pl-12 lg:pl-0">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <span className="material-symbols-outlined text-primary text-3xl">point_of_sale</span>
                        </div>
                        <div>
                            <h2 className="text-2xl xl:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Kasir</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`h-2 w-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                                    {isOnline ? 'System Online' : 'Offline Mode'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full xl:max-w-2xl group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[24px] text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cari Nama Barang atau Barcode... (F1)"
                            className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] py-3 sm:py-4 pl-14 pr-6 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all shadow-sm text-base sm:text-lg font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <kbd className="hidden sm:inline-flex h-6 items-center px-1.5 font-sans text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded transition-opacity">F1</kbd>
                        </div>
                    </div>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-4 overflow-y-auto pb-4 pr-1 sm:pr-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 content-start">
                    {filteredProducts.map((product, idx) => (
                        <div key={product.barcode} className={`transition-all rounded-xl ${selectedIndex === idx && document.activeElement === searchInputRef.current ? 'ring-4 ring-primary ring-opacity-50 scale-[1.02]' : ''}`}>
                            <ProductCard product={product} onAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Cart Overlay/Sidebar */}
            {/* Mobile Overlay */}
            {isCartOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 right-0 z-50 lg:relative lg:flex lg:translate-x-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex w-[90%] sm:w-96 flex-col bg-white dark:bg-[#16211C] border-l lg:border border-slate-200 dark:border-slate-800 shadow-2xl lg:shadow-xl lg:rounded-2xl overflow-hidden`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-50">
                        <span className="material-symbols-outlined text-[20px] text-primary">shopping_cart</span>
                        Keranjang
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-gray-400 space-y-2">
                                <span className="material-symbols-outlined text-[48px] opacity-20">shopping_cart</span>
                                <p>Keranjang kosong</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div key={item.barcode} className="flex gap-3 bg-gray-50 dark:bg-background-dark p-3 rounded-xl border border-transparent hover:border-slate-200 dark:border-slate-800 transition-colors group">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">{item.nama_barang}</h4>
                                            <div className="text-xs text-primary font-bold mt-0.5">
                                                {formatRupiah(item.harga_jual)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between gap-2">
                                            <div className="font-bold text-sm text-slate-900 dark:text-slate-50">{formatRupiah(item.subtotal)}</div>
                                            <div className="flex items-center gap-2 bg-white dark:bg-[#16211C] rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 shadow-sm">
                                                <button onClick={() => updateQty(item.barcode, -1)} className="p-1 hover:text-red-500 transition-colors flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[16px]">remove</span>
                                                </button>
                                                <span className="w-4 text-center text-xs font-medium">{item.qty}</span>
                                                <button onClick={() => updateQty(item.barcode, 1)} className="p-1 hover:text-green-500 transition-colors flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Totals & Checkout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-gray-50/50 dark:bg-white/5 rounded-b-2xl space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 px-1">
                            <span>Subtotal</span>
                            <span className="font-semibold">{formatRupiah(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-primary/10 dark:bg-primary/20 p-6 rounded-3xl border-2 border-primary/20">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Total</span>
                            <span className="text-4xl xl:text-5xl font-black text-primary tracking-tighter">
                                {formatRupiah(totalAmount)}
                            </span>
                        </div>
                    </div>


                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={isProcessing || cart.length === 0}
                        className={`w-full rounded-2xl py-5 font-black text-xl text-white shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isProcessing || cart.length === 0
                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-primary hover:bg-primary-hover shadow-primary/30'
                            }`}
                    >
                        {isProcessing ? <span className="material-symbols-outlined animate-spin">refresh</span> : (
                            <>
                                <span className="material-symbols-outlined">payment</span>
                                BAYAR (F9)
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#16211C] border-t border-slate-200 dark:border-slate-800 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-3.5 px-6 flex items-center justify-between shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#16211C]">
                                    {cart.reduce((a, b) => a + b.qty, 0)}
                                </span>
                            )}
                        </div>
                        <span className="font-bold">Lihat Keranjang</span>
                    </div>
                    <span className="text-xl font-black">{formatRupiah(totalAmount)}</span>
                </button>
            </div>

            {/* Safe area padding for mobile list */}
            <div className="lg:hidden h-24 w-full flex-shrink-0" />

            {/* Modals */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                totalAmount={totalAmount}
                onConfirm={handleFinalCheckout}
            />
        </div>
    )
}
