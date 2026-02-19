"use server"

import { MonitoringService } from "@/services/monitoring.service";
import { MonitoringStatus } from "@/types/monitoring";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Server action to get current uptime status of all targets
 */
export async function getUptimeStatusAction(): Promise<MonitoringStatus[]> {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        // Run all checks in parallel for maximum speed
        return await MonitoringService.checkAll();
    } catch (error) {
        console.error("[Monitoring Action] Error:", error);
        throw new Error("Failed to fetch uptime status");
    }
}
