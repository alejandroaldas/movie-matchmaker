"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-3 bg-white dark:bg-gray-800 rounded-full backdrop-blur-md transition border border-gray-200 dark:border-gray-700 shadow-sm relative group w-12 h-12" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full backdrop-blur-md transition border border-gray-200 dark:border-gray-700 shadow-sm relative group"
            title="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-6 h-6" />
            ) : (
                <Moon className="w-6 h-6" />
            )}
        </button>
    );
}
