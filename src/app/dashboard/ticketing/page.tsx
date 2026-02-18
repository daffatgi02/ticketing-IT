import { TicketService } from "@/services/ticket.service"
import { CreateTicketDialog } from "@/components/ticketing/create-ticket-dialog"
import { TicketList } from "@/components/ticketing/ticket-list"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function TicketingPage() {
    const session = await getServerSession(authOptions)
    const isUserOnly = session?.user?.role === "USER"

    // Jika USER, hanya ambil tiket miliknya. Jika ADMIN/STAFF, ambil semua.
    const tickets = await TicketService.getAllTickets(isUserOnly ? session?.user?.id : undefined)

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ticketing Helpdesk</h2>
                    <p className="text-muted-foreground italic">Kelola dan lacak permintaan bantuan IT dari seluruh departemen.</p>
                </div>
                <CreateTicketDialog />
            </div>

            <TicketList initialTickets={tickets} />
        </div>
    )
}
