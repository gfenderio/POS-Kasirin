'use client';

import { useState, useEffect, useRef } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirm: (paymentMethod: 'CASH' | 'QRIS', amountPaid: number) => void;
}

export default function PaymentModal({ isOpen, onClose, totalAmount, onConfirm }: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
    const [amountPaid, setAmountPaid] = useState<number>(totalAmount);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setAmountPaid(totalAmount);
            // Small delay to ensure focus works on mobile
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, totalAmount]);

    if (!isOpen) return null;

    const change = amountPaid - totalAmount;
    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-[#16211C] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Selesaikan Pembayaran</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Total Display */}
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 text-center border border-primary/20">
                        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Total Tagihan</p>
                        <h2 className="text-4xl font-black text-primary tracking-tight">{formatRupiah(totalAmount)}</h2>
                    </div>

                    {/* Payment Method Toggle */}
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-[#0B120F] rounded-2xl border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setPaymentMethod('CASH')}
                            className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${paymentMethod === 'CASH'
                                ? 'bg-white dark:bg-[#16211C] shadow-md text-primary ring-1 ring-primary/20'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-3xl">payments</span>
                            <span className="font-bold text-sm">Tunai (Cash)</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('QRIS')}
                            className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${paymentMethod === 'QRIS'
                                ? 'bg-white dark:bg-[#16211C] shadow-md text-primary ring-1 ring-primary/20'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-3xl">qr_code_2</span>
                            <span className="font-bold text-sm">QRIS</span>
                        </button>
                    </div>

                    {/* Numeric Input Layer for Touch Devices */}
                    {paymentMethod === 'CASH' && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Uang Dibayar</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">Rp</span>
                                    <input
                                        ref={inputRef}
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-background-dark border-2 border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl py-5 pl-12 pr-6 text-3xl font-black text-slate-900 dark:text-slate-50 transition-all outline-none"
                                        value={amountPaid || ''}
                                        onChange={(e) => setAmountPaid(Number(e.target.value))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Change Display */}
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-100 dark:bg-[#0B120F] border border-slate-200 dark:border-slate-800">
                                <span className="text-sm font-bold text-slate-500">Kembalian</span>
                                <span className={`text-2xl font-black ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {formatRupiah(Math.max(0, change))}
                                </span>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'QRIS' && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-slate-50 dark:bg-background-dark rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center">
                                {/* Placeholder for QR Logic */}
                                <div className="text-center text-slate-300">
                                    <span className="material-symbols-outlined text-6xl">qr_code_2</span>
                                    <p className="text-[10px] uppercase font-bold tracking-tighter mt-2">Dinamis QRIS</p>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-slate-500">Scan QR di atas untuk menyelesaikan pembayaran</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => onConfirm(paymentMethod, paymentMethod === 'QRIS' ? totalAmount : amountPaid)}
                        disabled={paymentMethod === 'CASH' && amountPaid < totalAmount}
                        className={`flex-[2] py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all active:scale-[0.98] ${(paymentMethod === 'CASH' && amountPaid < totalAmount)
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-primary hover:bg-primary-hover shadow-primary/30'
                            }`}
                    >
                        KONFIRMASI
                    </button>
                </div>
            </div>
        </div>
    );
}
