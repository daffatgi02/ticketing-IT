import { exec } from "child_process";
import { promisify } from "util";
import { MONITORING_TARGETS, MonitoringStatus, MonitoringTarget } from "@/types/monitoring";

const execAsync = promisify(exec);

export class MonitoringService {
    /**
     * Checks a single target status
     */
    static async checkTarget(target: MonitoringTarget): Promise<MonitoringStatus> {
        if (target.type === "IP") {
            return await this.pingIP(target);
        } else {
            return await this.checkWebsite(target);
        }
    }

    /**
     * Ping as standard IP (Windows compatible)
     */
    private static async pingIP(target: MonitoringTarget): Promise<MonitoringStatus> {
        const start = Date.now();
        try {
            // -n 1: 1 packet, -w 1000: 1s timeout
            const command = `ping -n 1 -w 1000 ${target.address}`;
            const { stdout } = await execAsync(command);

            const latency = Date.now() - start;

            // Simple check for success in output
            const isUp = stdout.includes("TTL=") || stdout.includes("Reply from");

            return {
                id: target.id,
                status: isUp ? "UP" : "DOWN",
                latency: isUp ? latency : null,
                lastChecked: new Date(),
            };
        } catch (error) {
            return {
                id: target.id,
                status: "DOWN",
                latency: null,
                lastChecked: new Date(),
            };
        }
    }

    /**
     * Check website status via fetch
     */
    private static async checkWebsite(target: MonitoringTarget): Promise<MonitoringStatus> {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch(target.address, {
                method: "HEAD", // Greener than GET
                signal: controller.signal,
                headers: {
                    "User-Agent": "IT-Monitoring-Bot/1.0"
                }
            });

            clearTimeout(timeoutId);
            const latency = Date.now() - start;

            return {
                id: target.id,
                status: response.ok ? "UP" : "DOWN",
                latency: response.ok ? latency : null,
                lastChecked: new Date(),
            };
        } catch (error) {
            return {
                id: target.id,
                status: "DOWN",
                latency: null,
                lastChecked: new Date(),
            };
        }
    }

    /**
     * Check all targets
     */
    static async checkAll(): Promise<MonitoringStatus[]> {
        const results = await Promise.all(
            MONITORING_TARGETS.map(target => this.checkTarget(target))
        );
        return results;
    }
}
