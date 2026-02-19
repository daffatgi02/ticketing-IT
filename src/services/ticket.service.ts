import prisma from "@/lib/prisma";
import { Priority, TicketStatus } from "@prisma/client";
import { DowntimeService } from "./downtime.service";

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
        category: string;
        classification: string;
        creatorId: string;
    }) {
        return await prisma.ticket.create({
            data: {
                ...data,
                status: TicketStatus.OPEN
            }
        });
    }

    static async getKPIData() {
        const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
        const allTickets = await prisma.ticket.findMany({
            where: {
                createdAt: {
                    gte: last30Days
                }
            }
        });

        // Get Downtime Stats
        const downtimeStats = await DowntimeService.getDowntimeStats(30);

        const totalTickets = allTickets.length;
        const resolvedTickets = allTickets.filter(t => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED);
        const resolvedCount = resolvedTickets.length;

        // Calculate MTTR (Mean Time to Resolution) in hours
        let totalResolutionTime = 0;
        resolvedTickets.forEach(ticket => {
            const resTime = (ticket.updatedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60);
            totalResolutionTime += resTime;
        });
        const mttr = resolvedCount > 0 ? (totalResolutionTime / resolvedCount).toFixed(1) : "0";

        // SLA Compliance (Resolved within 24 hours for HIGH/URGENT, 48 hours for others)
        let slaCompliantCount = 0;
        resolvedTickets.forEach(ticket => {
            const resTime = (ticket.updatedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60);
            const limit = (ticket.priority === Priority.HIGH || ticket.priority === Priority.URGENT) ? 24 : 48;
            if (resTime <= limit) slaCompliantCount++;
        });
        const slaRate = resolvedCount > 0 ? ((slaCompliantCount / resolvedCount) * 100).toFixed(0) : "100";

        return {
            totalTickets,
            resolvedCount,
            mttr,
            slaRate,
            uptime: downtimeStats.uptimePercentage,
            totalDowntime: downtimeStats.totalDowntimeMinutes,
            categoryDistribution: {
                LAPTOP: (allTickets as any[]).filter(t => t.category === "LAPTOP").length,
                WIFI: (allTickets as any[]).filter(t => t.category === "WIFI").length,
                HP: (allTickets as any[]).filter(t => t.category === "HP").length,
                OTHER: (allTickets as any[]).filter(t => t.category === "OTHER").length,
            }
        };
    }

    static async updateTicket(id: string, data: Partial<{
        title: string;
        description: string;
        priority: Priority;
        status: TicketStatus;
        category: string;
        classification: string;
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

    static async addComment(ticketId: string, authorId: string, content: string) {
        return await prisma.comment.create({
            data: {
                ticketId,
                authorId,
                content,
            }
        });
    }
}
