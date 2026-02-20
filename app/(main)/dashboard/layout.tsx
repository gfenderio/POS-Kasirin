import Header from "@/components/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <Header />
            {children}
        </div>
    );
}

