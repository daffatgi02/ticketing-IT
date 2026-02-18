import { TaskService } from "@/services/task.service"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { TaskChecklist } from "@/components/tasks/task-checklist"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import { redirect } from "next/navigation"

export default async function TasksPage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role === "USER") {
        redirect("/dashboard")
    }

    const tasks = await TaskService.getTasksByUser(session?.user?.id || "")
    if (!tasks) return null // Handle unexpected null

    const dailyTasks = tasks.filter(t => t.frequency === "DAILY")
    const weeklyTasks = tasks.filter(t => t.frequency === "WEEKLY")
    const monthlyTasks = tasks.filter(t => t.frequency === "MONTHLY")

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tugas Rutin IT</h2>
                    <p className="text-muted-foreground italic">Pantau dan selesaikan checklist pemeliharaan sistem berkala.</p>
                </div>
                <CreateTaskDialog />
            </div>

            <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-3 bg-muted/50 p-1">
                    <TabsTrigger value="daily">Harian</TabsTrigger>
                    <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="daily">
                        <TaskChecklist tasks={dailyTasks} />
                    </TabsContent>
                    <TabsContent value="weekly">
                        <TaskChecklist tasks={weeklyTasks} />
                    </TabsContent>
                    <TabsContent value="monthly">
                        <TaskChecklist tasks={monthlyTasks} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
