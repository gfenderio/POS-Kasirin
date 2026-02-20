'use client'

import React, { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts'
import { BrainCircuit, TrendingUp, AlertTriangle, Loader2, DollarSign } from 'lucide-react'
import axios from 'axios'

interface TopProduct {
    productId: string
    name: string
    totalSold: number
    revenue: number
}

interface PnLData {
    date: string
    grossSales: number
    totalCogs: number
    netProfit: number
}

interface MLRecommendation {
    productId: string
    name: string
    predictedNextWeekSales: number
    confidence: number
    message: string
}

export default function AnalyticsDashboard() {
    const [loading, setLoading] = useState(true)
    const [topProducts, setTopProducts] = useState<TopProduct[]>([])
    const [pnlData, setPnlData] = useState<PnLData[]>([])
    const [recommendations, setRecommendations] = useState<MLRecommendation[]>([])
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/api/analytics/dashboard')
                if (res.data.success) {
                    setTopProducts(res.data.data.topProducts)
                    setPnlData(res.data.data.pnl)
                    setRecommendations(res.data.data.recommendations)
                }
            } catch (err: any) {
                setError(err.message || 'Gagal memuat data analitik')
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg font-medium text-gray-500">Menghitung Data & Menjalankan Machine Learning...</span>
            </div>
        )
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>
    }

    // Totals for summary cards
    const totalWeeklyProfit = pnlData.reduce((acc, curr) => acc + curr.netProfit, 0)
    const totalWeeklyRevenue = pnlData.reduce((acc, curr) => acc + curr.grossSales, 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Analytics & AI Engine</h1>
                    <p className="text-gray-500 mt-1">Laporan finansial dan rekomendasi cerdas otomatis.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pendapatan Kotor 7 Hari</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{formatRupiah(totalWeeklyRevenue)}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Laba Bersih 7 Hari</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{formatRupiah(totalWeeklyProfit)}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400 rounded-2xl p-6 shadow-md text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-indigo-100">AI Alerts Aktif</p>
                            <h3 className="text-2xl font-bold mt-1">{recommendations.length} Rekomendasi Restock</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PnL Line Chart */}
                <div className="bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6">Laba-Rugi (PnL) 7 Hari Terakhir</h2>
                    <div className="h-80 w-full font-sans text-sm">
                        <ResponsiveContainer>
                            <AreaChart data={pnlData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                <YAxis tickFormatter={(val: number) => `Rp${val / 1000}k`} tickLine={false} axisLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
                                <Tooltip formatter={(value: any) => formatRupiah(value)} />
                                <Legend verticalAlign="top" height={36} />
                                <Area type="monotone" dataKey="grossSales" name="Pendapatan Kotor" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGross)" />
                                <Area type="monotone" dataKey="netProfit" name="Laba Bersih" stroke="#10b981" fillOpacity={1} fill="url(#colorNet)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Selling Products Bar Chart */}
                <div className="bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6">Produk Terlaris (30 Hari)</h2>
                    <div className="h-80 w-full font-sans text-sm">
                        <ResponsiveContainer>
                            <BarChart layout="vertical" data={topProducts} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} />
                                <Tooltip formatter={(value: any) => [`${value} pcs`, 'Terjual']} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="totalSold" name="Qty Terjual" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white dark:bg-[#16211C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">AI Stock Predictions (brain.js)</h2>
                </div>

                {recommendations.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">Tidak ada peringatan restock mendesak minggu ini.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recommendations.map((rec, idx) => (
                            <div key={rec.productId} className="flex gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50/50">
                                <div className="mt-1">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900">{rec.name}</h4>
                                        <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                                            {rec.confidence}% AI Confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                        {rec.message}
                                    </p>
                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        {/* Confidence progress bar */}
                                        <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${rec.confidence}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
