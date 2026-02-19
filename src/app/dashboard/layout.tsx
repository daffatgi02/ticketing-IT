import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === "ADMIN"

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-4 bg-white px-6 border-b border-slate-100/80 sticky top-0 z-20">
                    <SidebarTrigger className="-ml-1 text-slate-400 hover:text-primary transition-colors" />
                    <Separator orientation="vertical" className="h-4 bg-slate-100" />
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                            {isAdmin ? "IT Department Dashboard" : "PT WIG Helpdesk Platform"}
                        </h1>
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
