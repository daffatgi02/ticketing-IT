import { TicketService } from "@/services/ticket.service"
import { TicketDetail } from "@/components/ticketing/ticket-detail"
import { notFound } from "next/navigation"

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const ticket = await TicketService.getTicketById(id)

    if (!ticket) {
        notFound()
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <TicketDetail ticket={ticket} />
        </div>
    )
}
