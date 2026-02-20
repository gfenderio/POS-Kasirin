import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
                    {description && (
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
                    )}
                </div>
                {action && (
                    <div className="flex gap-2">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
