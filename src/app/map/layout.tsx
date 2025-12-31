"use client";

import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-background">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4 backdrop-blur-xl bg-background/50 sticky top-0 z-50">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="opacity-50">SelfOS</span>
                        <span>/</span>
                        <span className="opacity-100">Life Map</span>
                    </div>
                </header>
                {children}
            </main>
        </SidebarProvider>
    );
}
