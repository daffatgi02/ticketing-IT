import prisma from "@/lib/prisma";
import { ApprovalStatus, InfraPhase } from "@prisma/client";

/**
 * Service for managing the 4-phase Infrastructure Project SOP workflow:
 * PROPOSAL → RKB → DISBURSEMENT → EXECUTION → COMPLETED
 */
export class InfraWorkflowService {

    // ─── Phase Transition ────────────────────────────────────────

    static async advancePhase(projectId: string): Promise<InfraPhase> {
        const project = await prisma.project.findUniqueOrThrow({
            where: { id: projectId },
            include: { proposal: true, rkbSubmission: true, disbursement: true },
        });

        const currentPhase = project.currentPhase;
        if (!currentPhase) {
            throw new Error("Proyek ini bukan proyek infrastruktur.");
        }

        const phaseOrder: InfraPhase[] = [
            InfraPhase.PROPOSAL,
            InfraPhase.RKB,
            InfraPhase.DISBURSEMENT,
            InfraPhase.EXECUTION,
            InfraPhase.COMPLETED,
        ];

        const currentIndex = phaseOrder.indexOf(currentPhase);
        if (currentIndex >= phaseOrder.length - 1) {
            throw new Error("Proyek sudah selesai, tidak bisa dipindahkan ke fase berikutnya.");
        }

        // Validate current phase is approved before advancing
        if (currentPhase === InfraPhase.PROPOSAL && project.proposal?.approvalStatus !== ApprovalStatus.APPROVED) {
            throw new Error("Proposal harus disetujui sebelum lanjut ke RKB.");
        }
        if (currentPhase === InfraPhase.RKB && project.rkbSubmission?.approvalStatus !== ApprovalStatus.APPROVED) {
            throw new Error("RKB harus disetujui sebelum lanjut ke Pencairan Dana.");
        }
        if (currentPhase === InfraPhase.DISBURSEMENT && project.disbursement?.approvalStatus !== ApprovalStatus.APPROVED) {
            throw new Error("Pencairan dana harus disetujui sebelum lanjut ke Eksekusi.");
        }

        const nextPhase = phaseOrder[currentIndex + 1];

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                currentPhase: nextPhase,
                status: nextPhase === InfraPhase.COMPLETED ? "COMPLETED" : "IN_PROGRESS",
            },
        });

        return updatedProject.currentPhase!;
    }

    // ─── Proposal ────────────────────────────────────────────────

    static async getProposal(projectId: string) {
        return prisma.infraProposal.findUnique({ where: { projectId } });
    }

    static async upsertProposal(projectId: string, data: {
        background?: string;
        objectives?: string;
        scope?: string;
        benefits?: string;
        riskAnalysis?: string;
        attachmentUrl?: string;
    }) {
        return prisma.infraProposal.upsert({
            where: { projectId },
            create: { projectId, ...data, approvalStatus: ApprovalStatus.DRAFT },
            update: { ...data, approvalStatus: ApprovalStatus.DRAFT },
        });
    }

    static async submitProposal(projectId: string) {
        return prisma.infraProposal.upsert({
            where: { projectId },
            create: { projectId, approvalStatus: ApprovalStatus.PENDING },
            update: { approvalStatus: ApprovalStatus.PENDING },
        });
    }

    static async approveProposal(projectId: string, approvedBy: string) {
        const proposal = await prisma.infraProposal.update({
            where: { projectId },
            data: {
                approvalStatus: ApprovalStatus.APPROVED,
                approvedBy,
                approvalDate: new Date(),
                rejectionReason: null,
            },
        });

        // Auto-advance phase
        await this.advancePhase(projectId);
        return proposal;
    }

    static async rejectProposal(projectId: string, reason: string) {
        return prisma.infraProposal.update({
            where: { projectId },
            data: {
                approvalStatus: ApprovalStatus.REJECTED,
                rejectionReason: reason,
            },
        });
    }

    // ─── RKB ─────────────────────────────────────────────────────

    static async getRkbSubmission(projectId: string) {
        return prisma.rkbSubmission.findUnique({ where: { projectId } });
    }

    static async getRkbItems(projectId: string) {
        return prisma.rkbItem.findMany({
            where: { projectId },
            orderBy: { createdAt: "asc" },
        });
    }

    static async upsertRkbSubmission(projectId: string, data: {
        submissionNumber?: string;
        justification?: string;
    }) {
        return prisma.rkbSubmission.upsert({
            where: { projectId },
            create: { projectId, ...data, approvalStatus: ApprovalStatus.DRAFT },
            update: { ...data, approvalStatus: ApprovalStatus.DRAFT },
        });
    }

    static async addRkbItem(projectId: string, data: {
        itemName: string;
        specification?: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        vendor?: string;
        notes?: string;
    }) {
        const totalPrice = data.quantity * data.unitPrice;
        const item = await prisma.rkbItem.create({
            data: { projectId, ...data, totalPrice },
        });

        // Recalculate total budget
        await this.recalculateRkbTotal(projectId);
        return item;
    }

    static async removeRkbItem(itemId: string) {
        const item = await prisma.rkbItem.delete({ where: { id: itemId } });
        await this.recalculateRkbTotal(item.projectId);
        return item;
    }

    static async recalculateRkbTotal(projectId: string) {
        const items = await prisma.rkbItem.findMany({ where: { projectId } });
        const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
        await prisma.rkbSubmission.upsert({
            where: { projectId },
            create: { projectId, totalBudget: total },
            update: { totalBudget: total },
        });
    }

    static async submitRkb(projectId: string) {
        return prisma.rkbSubmission.upsert({
            where: { projectId },
            create: { projectId, approvalStatus: ApprovalStatus.PENDING },
            update: { approvalStatus: ApprovalStatus.PENDING },
        });
    }

    static async approveRkb(projectId: string, approvedBy: string) {
        const rkb = await prisma.rkbSubmission.update({
            where: { projectId },
            data: {
                approvalStatus: ApprovalStatus.APPROVED,
                approvedBy,
                approvalDate: new Date(),
                rejectionReason: null,
            },
        });

        await this.advancePhase(projectId);
        return rkb;
    }

    static async rejectRkb(projectId: string, reason: string) {
        return prisma.rkbSubmission.update({
            where: { projectId },
            data: {
                approvalStatus: ApprovalStatus.REJECTED,
                rejectionReason: reason,
            },
        });
    }

    // ─── Finance Disbursement ────────────────────────────────────

    static async getDisbursement(projectId: string) {
        return prisma.financeDisbursement.findUnique({ where: { projectId } });
    }

    static async upsertDisbursement(projectId: string, data: {
        approvedBudget?: number;
        disbursedAmount?: number;
        disbursementDate?: Date;
        paymentMethod?: string;
        referenceNumber?: string;
        notes?: string;
    }) {
        return prisma.financeDisbursement.upsert({
            where: { projectId },
            create: { projectId, ...data, approvalStatus: ApprovalStatus.DRAFT },
            update: { ...data, approvalStatus: ApprovalStatus.DRAFT },
        });
    }

    static async submitDisbursement(projectId: string) {
        return prisma.financeDisbursement.upsert({
            where: { projectId },
            create: { projectId, approvalStatus: ApprovalStatus.PENDING },
            update: { approvalStatus: ApprovalStatus.PENDING },
        });
    }

    static async approveDisbursement(projectId: string, approvedBy: string) {
        const disbursement = await prisma.financeDisbursement.update({
            where: { projectId },
            data: {
                approvalStatus: ApprovalStatus.APPROVED,
                approvedBy,
                approvalDate: new Date(),
                notes: null,
            },
        });

        await this.advancePhase(projectId);
        return disbursement;
    }

    static async rejectDisbursement(projectId: string, reason: string) {
        return prisma.financeDisbursement.update({
            where: { projectId },
            data: {
                approvalStatus: ApprovalStatus.REJECTED,
                notes: reason,
            },
        });
    }

    // ─── Execution ───────────────────────────────────────────────

    static async getExecutionLogs(projectId: string) {
        return prisma.infraExecution.findMany({
            where: { projectId },
            orderBy: { executionDate: "desc" },
        });
    }

    static async addExecutionLog(projectId: string, data: {
        activityDescription: string;
        executionDate?: Date;
        progressPercentage: number;
        findings?: string;
        completedBy?: string;
        photoUrl?: string;
    }) {
        return prisma.infraExecution.create({
            data: {
                projectId,
                ...data,
                executionDate: data.executionDate ?? new Date(),
            },
        });
    }

    static async completeProject(projectId: string) {
        await prisma.project.update({
            where: { id: projectId },
            data: {
                currentPhase: InfraPhase.COMPLETED,
                status: "COMPLETED",
            },
        });
    }

    // ─── Full Project Data ───────────────────────────────────────

    static async getFullProjectData(projectId: string) {
        return prisma.project.findUniqueOrThrow({
            where: { id: projectId },
            include: {
                manager: { select: { name: true } },
                milestones: true,
                proposal: true,
                rkbSubmission: true,
                rkbItems: { orderBy: { createdAt: "asc" } },
                disbursement: true,
                executionLogs: { orderBy: { executionDate: "desc" } },
            },
        });
    }
}
