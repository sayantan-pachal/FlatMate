import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "dark";
        }
        return "dark";
    });

    const isDark = theme === "dark";

    useEffect(() => {
        const root = document.documentElement;
        const metaTheme = document.querySelector('meta[name="theme-color"]');

        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            metaTheme?.setAttribute("content", "#040A12");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            metaTheme?.setAttribute("content", "#F4F6F9");
        }
    }, [isDark]);

    const handleToggle = () => {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={handleToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="relative inline-flex items-center w-14 h-8 lg:w-16 lg:h-8 rounded-full p-0.75 cursor-pointer bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-inner transition-colors duration-300 hover:border-amber-500/40 dark:hover:border-cyan-400/40 focus:outline-none"
        >
            {/* Background Track Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Sun className="w-3.5 h-3.5 text-amber-500/70" />
                <Moon className="w-3.5 h-3.5 text-cyan-400/70" />
            </div>

            {/* Sliding Gradient Thumb */}
            <span
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-md transform-gpu transition-all duration-300 ease-out ${
                    isDark
                        ? "translate-x-6 lg:translate-x-8 bg-linear-to-tr from-cyan-500 to-emerald-500 text-slate-950 shadow-cyan-500/25"
                        : "translate-x-0 bg-linear-to-tr from-orange-500 to-amber-400 text-white shadow-orange-500/25"
                }`}
            >
                {isDark ? (
                    <Moon className="w-3.5 h-3.5 fill-current" strokeWidth={2.5} />
                ) : (
                    <Sun className="w-3.5 h-3.5 fill-current" strokeWidth={2.5} />
                )}
            </span>
        </button>
    );
}