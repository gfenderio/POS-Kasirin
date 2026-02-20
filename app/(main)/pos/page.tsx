'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { offlineDB } from '@/lib/offlineDB'

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
    const { data: products, error: productsError } = useSWR<Product[]>('/api/products', fetcher)

    // Customer data fetch removed as requested

    const [cart, setCart] = useState<CartItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [amountPaid, setAmountPaid] = useState<number>(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const searchInputRef = useRef<HTMLInputElement>(null)
    const payInputRef = useRef<HTMLInputElement>(null)

    // Sync Offline Transactions
    const syncOfflineTransactions = useCallback(async () => {
        const pending = await offlineDB.pendingTransactions.toArray()
        if (pending.length === 0) return

        let syncedCount = 0;
        for (const tx of pending) {
            try {
                await axios.post('/api/transaction', {
                    total: tx.totalAmount,
                    jml_bayar: tx.amountPaid,
                    kembalian: tx.change,
                    id_user: 1,
                    items: tx.items,
                    offlineId: tx.offlineId
                })
                await offlineDB.pendingTransactions.delete(tx.id!)
                syncedCount++;
            } catch (err) {
                console.error('Sync failed for offline tx', tx.offlineId)
            }
        }
        if (syncedCount > 0) {
            alert(`${syncedCount} transaksi offline berhasil disinkronkan otomatis!`)
        }
    }, [])

    useEffect(() => {
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            syncOfflineTransactions()
        }
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Initial sync
        if (navigator.onLine) syncOfflineTransactions()

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [syncOfflineTransactions])

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

    const change = amountPaid - totalAmount

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

    const handleCheckout = useCallback(async () => {
        if (cart.length === 0) return alert('Keranjang kosong')
        if (amountPaid < totalAmount) return alert('Pembayaran kurang')

        setIsProcessing(true)
        try {
            const itemsPayload = cart.map(item => ({
                barcode: item.barcode,
                nama_barang: item.nama_barang,
                harga_beli: item.harga_beli,
                harga_jual: item.harga_jual,
                qty: item.qty,
                subtotal: item.subtotal
            }))

            if (!isOnline) {
                // Save Offline to Dexie
                await offlineDB.pendingTransactions.add({
                    offlineId: `off-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    totalAmount: totalAmount,
                    amountPaid: amountPaid,
                    change: change,
                    items: itemsPayload,
                    timestamp: Date.now()
                })
                alert('Tersimpan offline! Akan disinkronkan saat koneksi pulih.')
                setCart([])
                setAmountPaid(0)
            } else {
                const payload = {
                    total: totalAmount,
                    jml_bayar: amountPaid,
                    kembalian: change,
                    id_user: 1, // Hardcoded for now, default cashier
                    items: itemsPayload
                }

                await axios.post('/api/transaction', payload)
                alert('Transaksi berhasil!')
                setCart([])
                setAmountPaid(0)
            }
        } catch (error) {
            console.error(error)
            alert('Transaksi gagal')
        } finally {
            setIsProcessing(false)
        }
    }, [cart, amountPaid, totalAmount, change, isOnline])

    // Keyboard Shortcuts Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F1') {
                e.preventDefault(); searchInputRef.current?.focus()
            } else if (e.key === 'F2') {
                e.preventDefault(); payInputRef.current?.focus()
            } else if (e.key === 'F9') {
                e.preventDefault(); handleCheckout()
            } else if (e.key === 'ArrowDown') {
                if (document.activeElement === searchInputRef.current && filteredProducts.length > 0) {
                    e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, filteredProducts.length - 1))
                }
            } else if (e.key === 'ArrowUp') {
                if (document.activeElement === searchInputRef.current && filteredProducts.length > 0) {
                    e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, 0))
                }
            } else if (e.key === 'Enter') {
                if (document.activeElement === searchInputRef.current && selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
                    e.preventDefault(); addToCart(filteredProducts[selectedIndex])
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [filteredProducts, selectedIndex, handleCheckout, addToCart])

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

    if (productsError) return <div className="p-8 text-center text-red-500">Gagal memuat data produk</div>
    if (!products) return <div className="flex h-screen items-center justify-center text-primary"><span className="material-symbols-outlined text-[32px] animate-spin">refresh</span></div>

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 p-6">
            {/* Left: Product Selection */}
            <div className="flex flex-1 flex-col">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Kasir (POS)</h2>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isOnline ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                            {isOnline ? <><span className="material-symbols-outlined text-[14px]">wifi</span> Online</> : <><span className="material-symbols-outlined text-[14px]">wifi_off</span> Offline Mode</>}
                        </div>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">search</span>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cari (F1)... [↑↓ Pilih, Enter Tambah]"
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16211C] py-3 pl-10 pr-4 text-slate-900 dark:text-slate-50 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto pb-4 pr-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 content-start">
                    {filteredProducts.map((product, idx) => (
                        <div key={product.barcode} className={`transition-all rounded-xl ${selectedIndex === idx && document.activeElement === searchInputRef.current ? 'ring-4 ring-primary ring-opacity-50 scale-[1.02]' : ''}`}>
                            <ProductCard product={product} onAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="flex w-96 flex-col rounded-2xl bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gray-50/50 dark:bg-white/5 rounded-t-2xl">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-50">
                        <span className="material-symbols-outlined text-[20px] text-primary">shopping_cart</span>
                        Keranjang
                    </h2>
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
                        <div className="flex justify-between items-center bg-slate-100 dark:bg-[#0B120F] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="text-lg font-bold text-slate-600 dark:text-slate-400">TOTAL</span>
                            <span className="text-4xl font-extrabold text-primary tracking-tight">
                                {formatRupiah(totalAmount)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Bayar</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                            <input
                                ref={payInputRef}
                                type="number"
                                className="block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none transition-colors font-mono font-medium"
                                value={amountPaid || ''}
                                onChange={(e) => setAmountPaid(Number(e.target.value))}
                                placeholder="0 (F2)"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between text-sm items-center p-2 bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="font-medium text-gray-500">Kembalian</span>
                        <span className={`font-mono font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {formatRupiah(Math.max(0, change))}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing || cart.length === 0}
                        className={`w-full rounded-xl py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isProcessing || cart.length === 0
                            ? 'bg-gray-400 cursor-not-allowed shadow-none opacity-70'
                            : 'bg-primary hover:bg-primary-hover'
                            }`}
                    >
                        {isProcessing ? <span className="material-symbols-outlined animate-spin">refresh</span> : 'Selesaikan Transaksi (F9)'}
                    </button>
                </div>
            </div>
        </div>
    )
}
