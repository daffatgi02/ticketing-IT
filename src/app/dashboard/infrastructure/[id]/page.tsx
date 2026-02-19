import { InfraWorkflowService } from "@/services/infra-workflow.service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect, notFound } from "next/navigation"
import { InfraProjectDetail } from "@/components/projects/infra/infra-project-detail"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function InfraProjectPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role === "USER") {
        redirect("/dashboard")
    }

    const { id } = await params

    try {
        const project = await InfraWorkflowService.getFullProjectData(id)
        if (project.type !== "INFRASTRUCTURE") {
            redirect("/dashboard/infrastructure")
        }

        return (
            <div className="flex flex-1 flex-col gap-6 p-6">
                <InfraProjectDetail project={project} />
            </div>
        )
    } catch {
        notFound()
    }
}
