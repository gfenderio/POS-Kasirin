'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-transparent px-8">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Beranda</h2>
                <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></span>
                <p className="text-sm text-slate-500 dark:text-slate-400" id="current-date">
                    Hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 z-10">search</span>
                    <input
                        className="h-10 w-full rounded-lg border-none bg-white dark:bg-[#16211C] pl-9 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 focus:ring-1 focus:ring-primary shadow-sm ring-1 ring-surface-border dark:ring-surface-border"
                        placeholder="Cari..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <button
                    onClick={() => alert('Fitur notifikasi akan segera hadir!')}
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-[#16211C] text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-2.5 right-3 h-1.5 w-1.5 bg-primary rounded-full"></span>
                </button>
                <button
                    onClick={() => router.push('/pos')}
                    className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-content hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Transaksi Baru
                </button>
            </div>
        </header>
    );
}
