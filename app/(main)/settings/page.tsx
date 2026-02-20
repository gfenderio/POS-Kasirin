'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'

const themes = [
    { name: 'Default (Hijau)', value: 'default', color: '#13ec80' },
    { name: 'Biru Laut', value: 'ocean', color: '#3b82f6' },
    { name: 'Ungu Kerajaan', value: 'royal', color: '#8b5cf6' },
    { name: 'Oranye Senja', value: 'sunset', color: '#f97316' },
]

export default function SettingsPage() {
    const [currentTheme, setCurrentTheme] = useState('default')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('theme') || 'default'
        setCurrentTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
    }, [])

    const changeTheme = (theme: string) => {
        setCurrentTheme(theme)
        localStorage.setItem('theme', theme)
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme')
        } else {
            document.documentElement.setAttribute('data-theme', theme)
        }
    }

    if (!mounted) return null

    return (
        <PageLayout>
            <PageHeader title="Pengaturan" description="Kelola konfigurasi dan preferensi aplikasi POS Anda" />

            <div className="pt-4 max-w-4xl mx-auto w-full">

                {/* Appearance Section */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">palette</span>
                        Tampilan
                    </h2>
                    <div className="bg-white dark:bg-[#16211C] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Warna Tema</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <button
                                    onClick={() => changeTheme('default')}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${currentTheme === 'default' ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-12 bg-[#10B981] rounded-md shadow-sm"></div>
                                    <span className={`text-sm font-medium ${currentTheme === 'default' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>Default (Hijau)</span>
                                </button>
                                <button
                                    onClick={() => changeTheme('blue')}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${currentTheme === 'blue' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-12 bg-[#0ea5e9] rounded-md shadow-sm"></div>
                                    <span className={`text-sm font-medium ${currentTheme === 'blue' ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>Biru Laut</span>
                                </button>
                                <button
                                    onClick={() => changeTheme('purple')}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${currentTheme === 'purple' ? 'border-violet-500 bg-violet-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-12 bg-[#8b5cf6] rounded-md shadow-sm"></div>
                                    <span className={`text-sm font-medium ${currentTheme === 'purple' ? 'text-violet-500' : 'text-slate-500 dark:text-slate-400'}`}>Ungu Kerajaan</span>
                                </button>
                                <button
                                    onClick={() => changeTheme('orange')}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${currentTheme === 'orange' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-12 bg-[#f97316] rounded-md shadow-sm"></div>
                                    <span className={`text-sm font-medium ${currentTheme === 'orange' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>Oranye Senja</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Info Section */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">info</span>
                        Info Aplikasi
                    </h2>
                    <div className="bg-white dark:bg-[#16211C] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Nama Aplikasi</span>
                            <span className="text-slate-900 dark:text-slate-50 font-semibold">POS-Kasirin</span>
                        </div>
                        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Versi</span>
                            <span className="text-slate-900 dark:text-slate-50 font-mono">1.0.0</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Framework</span>
                            <span className="text-slate-900 dark:text-slate-50 font-mono">Next.js 14 + Tailwind CSS</span>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}
