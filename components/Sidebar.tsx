'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const sidebarItems = [
    { name: 'Beranda', href: '/dashboard', icon: 'dashboard' },
    { name: 'Kasir', href: '/pos', icon: 'point_of_sale' },
    { name: 'Inventaris', href: '/inventory', icon: 'inventory_2' },
    { name: 'Riwayat', href: '/transactions', icon: 'receipt_long' },
    { name: 'Laporan', href: '/reports', icon: 'bar_chart' },
    { name: 'Pengaturan', href: '/settings', icon: 'settings' },
]

import { useState, useEffect } from 'react'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    // Close sidebar on route change for mobile
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' })
        } catch (error) {
            console.error(error)
        }
        router.push('/login')
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg"
            >
                <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-40 lg:relative lg:flex lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#16211C] text-slate-900 dark:text-slate-50 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none`}>
                <div className="flex h-16 items-center justify-center border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-xl font-bold text-primary">POS Kasirin</h1>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                                            ? 'bg-green-100 text-emerald-600 font-bold dark:bg-green-900/20 dark:text-green-400'
                                            : 'text-slate-600 font-medium hover:bg-gray-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined ${isActive ? 'filled text-[20px]' : 'text-[20px]'}`}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4">
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Keluar
                    </button>
                </div>
            </div>
        </>
    )
}
