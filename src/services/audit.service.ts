import prisma from "@/lib/prisma";

export class AuditService {
    static async logAction(data: {
        action: string;
        entity: string;
        entityId: string;
        details?: string;
        userId: string;
    }) {
        try {
            return await prisma.auditLog.create({
                data: {
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId,
                    details: data.details,
                    userId: data.userId
                }
            });
        } catch (error) {
            console.error("Failed to create audit log:", error);
            // Don't throw error to prevent breaking the main action
        }
    }

    static async getLogs(limit: number = 50) {
        return await prisma.auditLog.findMany({
            include: {
                user: {
                    select: { name: true, role: true }
                }
            },
            orderBy: { timestamp: 'desc' },
            take: limit
        });
    }
}
