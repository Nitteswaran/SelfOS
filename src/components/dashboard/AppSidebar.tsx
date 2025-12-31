"use client";

import {
    Calendar,
    LayoutDashboard,
    Map as MapIcon,
    PieChart,
    Settings,
    Sparkles,
    Target,
    User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useUserStore } from "@/lib/store/userStore";

const navItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Schedule",
        url: "/dashboard/schedule",
        icon: Calendar,
    },
    {
        title: "Insights",
        url: "/dashboard/insights",
        icon: PieChart,
    },
    {
        title: "Life Kernel",
        url: "/dashboard/life-kernel",
        icon: Sparkles,
    },
    {
        title: "Goals",
        url: "/goals",
        icon: Target,
    },
    {
        title: "Life Map",
        url: "/map",
        icon: MapIcon,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { user, userData } = useUserStore();
    const displayName = (userData?.displayName as string) || user?.displayName || user?.email?.split('@')[0] || "User";

    return (
        <Sidebar collapsible="icon" {...props} className="border-r border-border/50 bg-background/50 backdrop-blur-xl">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-2 font-bold text-xl tracking-tight">
                    <BrandLogo className="h-12 w-12" />
                    <span className="group-data-[collapsible=icon]:hidden">SelfOS</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Core System</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        className="transition-all hover:bg-white/10"
                                    >
                                        <a href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="mx-4 my-2 opacity-50" />

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Settings">
                                    <a href="/settings">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="h-12">
                            <User className="h-4 w-4" />
                            <div className="flex flex-col gap-0.5 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="font-semibold">{displayName}</span>
                                <span className="text-xs text-muted-foreground">Self OS</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    );
}
