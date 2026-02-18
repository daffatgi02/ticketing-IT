import { ProjectService } from "@/services/project.service"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { InfrastructureList } from "@/components/projects/infrastructure-list"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function InfrastructurePage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role === "USER") {
        redirect("/dashboard")
    }

    const projects = await ProjectService.getAllProjects("INFRASTRUCTURE")

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proyek Infrastruktur</h2>
                    <p className="text-muted-foreground italic">Pantau progres instalasi hardware, jaringan, dan sistem fisik.</p>
                </div>
                <CreateProjectDialog defaultType="INFRASTRUCTURE" />
            </div>

            <InfrastructureList initialProjects={projects} />
        </div>
    )
}
