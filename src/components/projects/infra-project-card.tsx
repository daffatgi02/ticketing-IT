"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Building01Icon, Calendar03Icon, UserIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { deleteProjectAction } from "@/app/actions/project.actions"
import { toast } from "sonner"
import { useState } from "react"

export function InfrastructureProjectCard({ project }: { project: any }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const completedMilestones = project.milestones?.filter((m: any) => m.isCompleted).length || 0
    const totalMilestones = project.milestones?.length || 0
    const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteProjectAction(project.id)
            toast.success("Proyek Dihapus")
            setIsConfirmOpen(false)
        } catch (error: any) {
            toast.error("Gagal menghapus: " + error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HugeiconsIcon icon={Building01Icon} className="size-5" />
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        {project.status}
                    </Badge>
                </div>
                <div className="mt-4 space-y-1">
                    <CardTitle className="leading-none">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                        {project.description || "Tidak ada deskripsi."}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progres Proyek</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                        <span>{project.endDate ? new Date(project.endDate).toLocaleDateString("id-ID") : "No Date"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HugeiconsIcon icon={UserIcon} className="size-3.5" />
                        <span className="truncate">{project.manager?.name || "No Manager"}</span>
                    </div>
                </div>

                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                    </Button>
                </div>
            </CardContent>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                variant="destructive"
                title="Hapus Proyek?"
                description={`Apakah Anda yakin ingin menghapus proyek "${project.name}"? Semua data terkait akan ikut terhapus.`}
                confirmText="Hapus Proyek"
            />
        </Card>
    )
}
