import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { TicketService } from "@/services/ticket.service"
import { ProjectService } from "@/services/project.service"
import { TaskService } from "@/services/task.service"
import { AuditService } from "@/services/audit.service"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import {
    Ticket01Icon,
    Building01Icon,
    SourceCodeIcon,
    TaskDaily01Icon,
    ActivityIcon,
    UserIcon
} from "@hugeicons/core-free-icons"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const isUser = session?.user?.role === "USER"
    const userId = session?.user?.id || ""

    // Fetch Real Data
    const [tickets, projectsInfra, projectsWeb, tasks, rawLogs] = await Promise.all([
        TicketService.getAllTickets(isUser ? userId : undefined) as Promise<any[]>,
        ProjectService.getAllProjects("INFRASTRUCTURE") as Promise<any[]>,
        ProjectService.getAllProjects("WEB_DEV") as Promise<any[]>,
        TaskService.getTasksByUser(userId) as Promise<any[]>,
        !isUser ? AuditService.getLogs(5) as Promise<any[]> : Promise.resolve([])
    ])

    const openTicketsCount = tickets.filter(t => t.status === "OPEN").length
    const activeInfraCount = projectsInfra.filter(p => p.status === "IN_PROGRESS").length
    const activeWebCount = projectsWeb.filter(p => p.status === "IN_PROGRESS").length
    const todayTasks = tasks.filter(t => t.frequency === "DAILY")
    const completedTasksCount = todayTasks.filter(t => t.isCompleted).length

    const stats = [
        {
            title: isUser ? "Tiket Saya (Aktif)" : "Tiket Terbuka",
            value: openTicketsCount.toString(),
            description: "Membutuhkan perhatian segera",
            icon: Ticket01Icon,
            color: "text-blue-500",
        },
        ...(!isUser ? [
            {
                title: "Proyek Infra Aktif",
                value: activeInfraCount.toString(),
                description: "Sedang dalam pengerjaan",
                icon: Building01Icon,
                color: "text-orange-500",
            },
            {
                title: "Proyek Web Aktif",
                value: activeWebCount.toString(),
                description: "Dalam perancangan/dev",
                icon: SourceCodeIcon,
                color: "text-purple-500",
            },
            {
                title: "Tugas Hari Ini",
                value: `${completedTasksCount}/${todayTasks.length}`,
                description: "Progres pemeliharaan harian",
                icon: TaskDaily01Icon,
                color: "text-green-500",
            },
        ] : [])
    ]

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <HugeiconsIcon icon={stat.icon} className={`size-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className={`grid gap-4 ${isUser ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-7"}`}>
                <Card className={isUser ? "col-span-1" : "col-span-4"}>
                    <CardHeader>
                        <CardTitle>{isUser ? "Tiket Saya" : "Tiket Terbaru"}</CardTitle>
                        <CardDescription>
                            {isUser ? "Status permintaan bantuan Anda." : "Permintaan bantuan terbaru dari karyawan."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tickets.length > 0 ? tickets.slice(0, 3).map((ticket) => (
                                <div key={ticket.id} className="flex items-center gap-4 rounded-lg border p-3">
                                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                                        <HugeiconsIcon icon={Ticket01Icon} className="size-4" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {ticket.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {isUser ? `Dibuat ${formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: id })}` : `Oleh ${ticket.creator?.name || "Anonim"} • ${formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: id })}`}
                                        </p>
                                    </div>
                                    <div className={`text-xs font-semibold uppercase ${ticket.priority === 'URGENT' ? 'text-red-600' :
                                        ticket.priority === 'HIGH' ? 'text-orange-500' : 'text-blue-500'
                                        }`}>
                                        {ticket.priority}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-center py-4 text-muted-foreground italic">Belum ada tiket.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                {!isUser && (
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Tugas Harian</CardTitle>
                            <CardDescription>
                                Tugas pemeliharaan rutin untuk hari ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {todayTasks.length > 0 ? todayTasks.slice(0, 5).map((task) => (
                                    <div key={task.id} className="flex items-center gap-3">
                                        <div className={`size-4 rounded border ${task.isCompleted ? 'bg-primary border-primary' : ''}`} />
                                        <span className={`text-sm ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-center py-4 text-muted-foreground italic">Tidak ada tugas hari ini.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {!isUser && (
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HugeiconsIcon icon={ActivityIcon} className="size-5 text-primary" />
                            Log Aktivitas Sistem (Audit Logs)
                        </CardTitle>
                        <CardDescription>
                            Riwayat perubahan data terbaru yang dilakukan oleh admin dan staf.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {rawLogs.length > 0 ? rawLogs.map((log: any) => (
                                <div key={log.id} className="flex items-start gap-4 text-sm pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                        <HugeiconsIcon icon={UserIcon} className="size-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900">
                                            {log.user?.name || "Sistem"}
                                            <span className="font-normal text-slate-500"> melakukan </span>
                                            <span className="text-primary">{log.action}</span>
                                            <span className="font-normal text-slate-500"> pada </span>
                                            {log.entity}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate italic">
                                            {log.details}
                                        </p>
                                    </div>
                                    <div className="text-[10px] text-slate-400 whitespace-nowrap pt-1">
                                        {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: id })}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-8 text-muted-foreground italic">Belum ada riwayat aktivitas.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
