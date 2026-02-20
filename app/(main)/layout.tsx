import Sidebar from '@/components/Sidebar'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-transparent text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {children}
            </div>
        </div>
    )
}
