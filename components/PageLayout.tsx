import React from 'react';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#0B120F] overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full">
                <div className="mx-auto w-full p-8 md:p-10 flex flex-col gap-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
