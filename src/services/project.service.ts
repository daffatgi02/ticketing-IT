import prisma from "@/lib/prisma";
import { ProjectType, ProjectStatus } from "@prisma/client";

export class ProjectService {
    static async getAllProjects(type?: ProjectType) {
        return await prisma.project.findMany({
            where: type ? { type } : undefined,
            include: {
                manager: {
                    select: { name: true }
                },
                milestones: true
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    static async getProjectById(id: string) {
        return await prisma.project.findUnique({
            where: { id },
            include: {
                manager: {
                    select: { name: true }
                },
                milestones: true
            }
        });
    }

    static async createProject(data: {
        name: string;
        description?: string;
        type: ProjectType;
        managerId: string;
        websiteName?: string;
        environment?: string;
        startDate?: Date;
        endDate?: Date;
    }) {
        return await prisma.project.create({
            data: {
                ...data,
                status: ProjectStatus.PLANNING
            }
        });
    }

    static async updateProject(id: string, data: Partial<{
        name: string;
        description: string;
        status: ProjectStatus;
        websiteName: string;
        environment: string;
        startDate: Date;
        endDate: Date;
        managerId: string;
    }>) {
        return await prisma.project.update({
            where: { id },
            data
        });
    }

    static async deleteProject(id: string) {
        return await prisma.project.delete({
            where: { id }
        });
    }

    static async updateMilestone(id: string, data: { isCompleted?: boolean; title?: string }) {
        return await prisma.milestone.update({
            where: { id },
            data
        });
    }
}
