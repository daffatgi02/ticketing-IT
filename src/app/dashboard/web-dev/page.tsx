import { ProjectService } from "@/services/project.service"
import { KanbanBoard } from "@/components/projects/kanban-board"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function WebDevPage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role === "USER") {
        redirect("/dashboard")
    }

    const projects = await ProjectService.getAllProjects("WEB_DEV")

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Web Development</h2>
                    <p className="text-muted-foreground italic">Kelola siklus pengembangan aplikasi dan fitur baru secara efisien.</p>
                </div>
                <CreateProjectDialog defaultType="WEB_DEV" />
            </div>

            <KanbanBoard initialProjects={projects} />
        </div>
    )
}
