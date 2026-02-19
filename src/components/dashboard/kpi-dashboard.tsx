import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ActivityIcon,
    CheckmarkBadge01Icon,
    Clock01Icon,
    ChartBarLineIcon
} from "@hugeicons/core-free-icons";

interface KPIData {
    totalTickets: number;
    resolvedCount: number;
    mttr: string;
    slaRate: string;
    uptime?: number;
    totalDowntime?: number;
}

export function ITKPIDashboard({ data }: { data: KPIData }) {
    const metrics = [
        {
            title: "Ticket Volume",
            value: data.totalTickets,
            description: "Total tiket 30 hari terakhir",
            icon: ActivityIcon,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Uptime Server",
            value: `${data.uptime ?? 100}%`,
            description: "Persentase ketersediaan sistem",
            icon: ChartBarLineIcon,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Total Downtime",
            value: `${data.totalDowntime ?? 0}m`,
            description: "Durasi gangguan (30 hari)",
            icon: Clock01Icon,
            color: "text-red-600",
            bg: "bg-red-50"
        },
        {
            title: "MTTR IT",
            value: `${data.mttr}jam`,
            description: "Rata-rata waktu perbaikan",
            icon: Clock01Icon,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "SLA Rate",
            value: `${data.slaRate}%`,
            description: "Kepatuhan batas waktu",
            icon: CheckmarkBadge01Icon,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {metrics.map((m) => (
                <Card key={m.title} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {m.title}
                        </CardTitle>
                        <div className={`p-2 rounded-xl ${m.bg}`}>
                            <HugeiconsIcon icon={m.icon} className={`size-4 ${m.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{m.value}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                            {m.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
