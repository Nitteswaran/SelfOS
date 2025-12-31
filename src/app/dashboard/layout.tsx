import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-background/50 backdrop-blur-sm overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4 backdrop-blur-md sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex flex-1 items-center justify-between">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Life Operating System</h2>
                        {/* Top bar widgets like time or notifications can go here */}
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
