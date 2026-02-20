'use client'

import { useEffect, useRef } from 'react'

interface UsePosShortcutsProps {
    selectedIndex: number;
    setSelectedIndex: (index: number | ((prev: number) => number)) => void;
    listLength: number;
    onAddToCart: (index: number) => void;
    onCheckout: () => void;
}

export function usePosShortcuts({
    selectedIndex,
    setSelectedIndex,
    listLength,
    onAddToCart,
    onCheckout
}: UsePosShortcutsProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const payInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // F1: Focus Search
            if (e.key === 'F1') {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }

            // F2: Focus Payment
            if (e.key === 'F2') {
                e.preventDefault();
                payInputRef.current?.focus();
                payInputRef.current?.select();
            }

            // F9: Checkout
            if (e.key === 'F9') {
                e.preventDefault();
                onCheckout();
            }

            // Arrow Navigation (only if common inputs are not in focus or if specifically needed)
            // But usually we want arrows to work even if search is focused to pick from results
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, listLength - 1));
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            }

            // Enter: Add selected to cart
            if (e.key === 'Enter') {
                // We check if we are currently searching to avoid double-triggering 
                // if the button itself is focused.
                if (document.activeElement === searchInputRef.current) {
                    if (selectedIndex >= 0 && selectedIndex < listLength) {
                        e.preventDefault();
                        onAddToCart(selectedIndex);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, listLength, onAddToCart, onCheckout, setSelectedIndex]);

    return {
        searchInputRef,
        payInputRef
    };
}
