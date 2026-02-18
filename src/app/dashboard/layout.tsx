import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-4 bg-white px-6 border-b border-slate-100/80 sticky top-0 z-20">
                    <SidebarTrigger className="-ml-1 text-slate-400 hover:text-primary transition-colors" />
                    <Separator orientation="vertical" className="h-4 bg-slate-100" />
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">IT Department Dashboard</h1>
                        <div className="flex items-center gap-3">
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col overflow-y-auto bg-slate-50/50">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
