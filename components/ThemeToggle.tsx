"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="flex h-9 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium animate-pulse bg-gray-100 dark:bg-[#16211C]"></div>
    }

    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    return (
        <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
        >
            <span className="material-symbols-outlined text-[20px]">
                {currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span>
                {currentTheme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            </span>
        </button>
    )
}
