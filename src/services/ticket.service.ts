import prisma from "@/lib/prisma";
import { Priority, TicketStatus } from "@prisma/client";

export class TicketService {
    static async getAllTickets(userId?: string) {
        return await prisma.ticket.findMany({
            where: userId ? { creatorId: userId } : undefined,
            include: {
                creator: {
                    select: { name: true, email: true }
                },
                assignee: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getTicketById(id: string) {
        return await prisma.ticket.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { name: true, email: true }
                },
                assignee: {
                    select: { name: true, email: true }
                },
                comments: {
                    include: {
                        author: {
                            select: { name: true, image: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
    }

    static async createTicket(data: {
        title: string;
        description: string;
        priority: Priority;
        creatorId: string;
    }) {
        return await prisma.ticket.create({
            data: {
                ...data,
                status: TicketStatus.OPEN
            }
        });
    }

    static async updateTicket(id: string, data: Partial<{
        title: string;
        description: string;
        priority: Priority;
        status: TicketStatus;
        assigneeId: string;
    }>) {
        return await prisma.ticket.update({
            where: { id },
            data
        });
    }

    static async deleteTicket(id: string) {
        return await prisma.ticket.delete({
            where: { id }
        });
    }
}
