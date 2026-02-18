"use server"

import { TicketService } from "@/services/ticket.service";
import { revalidatePath } from "next/cache";
import { TicketStatus, Priority } from "@prisma/client";
import { z } from "zod";
import { AuditService } from "@/services/audit.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ticketSchema = z.object({
    title: z.string().min(5, "Judul minimal 5 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    priority: z.nativeEnum(Priority),
    creatorId: z.string(),
});

export async function createTicketAction(formData: FormData) {
    try {
        const rawData = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            priority: formData.get("priority") as Priority,
            creatorId: formData.get("creatorId") as string,
        };

        console.log("Creating ticket with rawData:", rawData);

        const validated = ticketSchema.parse(rawData);
        const ticket = await TicketService.createTicket(validated);

        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            await AuditService.logAction({
                action: "CREATE",
                entity: "TICKET",
                entityId: ticket.id,
                details: `Membuat tiket: ${ticket.title}`,
                userId: session.user.id
            });
        }

        revalidatePath("/dashboard/ticketing");
        revalidatePath("/dashboard");
    } catch (error: any) {
        console.error("Error in createTicketAction:", error);
        if (error instanceof z.ZodError) {
            throw new Error(error.issues[0].message);
        }
        throw new Error(error.message || "Gagal membuat tiket");
    }
}

export async function updateTicketStatusAction(id: string, status: TicketStatus) {
    await TicketService.updateTicket(id, { status });
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        await AuditService.logAction({
            action: "UPDATE_STATUS",
            entity: "TICKET",
            entityId: id,
            details: `Mengubah status tiket menjadi ${status}`,
            userId: session.user.id
        });
    }
    revalidatePath("/dashboard/ticketing");
    revalidatePath("/dashboard");
}

export async function assignTicketAction(id: string, assigneeId: string) {
    await TicketService.updateTicket(id, {
        assigneeId,
        status: TicketStatus.IN_PROGRESS
    });
    revalidatePath("/dashboard/ticketing");
}

export async function updateTicketAction(id: string, data: any) {
    // Basic validation can be added here
    await TicketService.updateTicket(id, data);
    revalidatePath("/dashboard/ticketing");
}

export async function deleteTicketAction(id: string) {
    await TicketService.deleteTicket(id);
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        await AuditService.logAction({
            action: "DELETE",
            entity: "TICKET",
            entityId: id,
            details: `Menghapus tiket`,
            userId: session.user.id
        });
    }
    revalidatePath("/dashboard/ticketing");
    revalidatePath("/dashboard");
}
