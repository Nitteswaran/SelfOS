"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, isConfigured } from "@/lib/firebase";
import { useUserStore } from "@/lib/store/userStore";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading, setUserData } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();

    // Apply initial theme on first load (local preference or system)
    useEffect(() => {
        if (typeof window === "undefined") return;
        let initial: "dark" | "light" = "dark";
        const stored = window.localStorage.getItem("selfos-theme");
        if (stored === "dark" || stored === "light") {
            initial = stored;
        } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            initial = "dark";
        } else {
            initial = "light";
        }
        const root = document.documentElement;
        if (initial === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        window.localStorage.setItem("selfos-theme", initial);
    }, []);

    const applyTheme = (mode: "dark" | "light") => {
        if (typeof document !== "undefined") {
            const root = document.documentElement;
            if (mode === "dark") root.classList.add("dark");
            else root.classList.remove("dark");
        }
        if (typeof window !== "undefined") {
            window.localStorage.setItem("selfos-theme", mode);
        }
    };

    useEffect(() => {
        if (!isConfigured) {
            console.warn("Firebase not configured. Auth skipped.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Fetch user profile from Firestore
                try {
                    if (typeof navigator !== "undefined" && !navigator.onLine) {
                        console.warn("Skipping user profile fetch because client is offline.");
                    } else {
                        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            setUserData(data);
                            const prefs: unknown = (data as any).preferences;
                            if (prefs && typeof prefs === "object") {
                                const themePref = (prefs as any).theme;
                                if (themePref === "dark" || themePref === "light") {
                                    applyTheme(themePref);
                                }
                            }
                        } else {
                            setUserData(null);
                            // If logged in but no profile, redirect to onboarding (unless already there)
                            if (!pathname?.startsWith("/onboarding")) {
                                router.push("/onboarding");
                            }
                        }
                    }
                } catch (error: any) {
                    if (error?.code === "unavailable") {
                        console.warn("Firestore unavailable while fetching user data (possibly offline).", error);
                    } else {
                        console.error("Error fetching user data:", error);
                    }
                }
            } else {
                setUserData(null);
                // If not logged in and trying to access protected routes, redirect to login
                const publicRoutes = ["/", "/login", "/signup"];
                if (!publicRoutes.includes(pathname || "")) {
                    router.push("/login"); // or landing
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setLoading, setUserData, pathname, router]);

    return <>{children}</>;
}
