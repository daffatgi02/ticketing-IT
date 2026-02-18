import { ProjectService } from "@/services/project.service"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { InfrastructureProjectCard } from "@/components/projects/infra-project-card"

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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <InfrastructureProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <div className="col-span-full flex h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-muted text-muted-foreground">
                        Belum ada proyek infrastruktur. Mulai dengan membuat proyek baru.
                    </div>
                )}
            </div>
        </div>
    )
}
