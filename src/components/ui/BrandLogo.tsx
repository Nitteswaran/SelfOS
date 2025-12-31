"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string; // For sizing/positioning
    showText?: boolean;
}

export function BrandLogo({ className, showText = false }: BrandLogoProps) {
    // We use CSS-based hiding for perfect hydration match to avoid flicker
    // or we can use next-themes if we want conditional rendering logic.
    // CSS based is usually safer for SSR hydration mismatch if the html class is used for dark mode.
    // Since we use `class="dark"` on html, CSS is best.

    return (
        <div className={cn("relative flex items-center justify-center shrink-0", className)}>
            {/* Light Logo: Show when NOT dark */}
            <div className="dark:hidden w-full h-full flex items-center justify-center">
                <img src="/logos/light_logo.png" alt="SelfOS Logo" className="w-full h-full object-contain" />
            </div>
            {/* Dark Logo: Show when dark */}
            <div className="hidden dark:block w-full h-full flex items-center justify-center">
                <img src="/logos/dark_logo.png" alt="SelfOS Logo" className="w-full h-full object-contain" />
            </div>

            {showText && (
                <span className="font-bold text-xl tracking-tighter ml-2">SelfOS</span>
            )}
        </div>
    );
}
