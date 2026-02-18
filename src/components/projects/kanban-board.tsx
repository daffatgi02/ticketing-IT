"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
    MoreVerticalIcon,
    Delete02Icon,
    ArrowRight02Icon,
    GlobalIcon,
    ComputerIcon,
    UserIcon
} from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateProjectStatusAction, deleteProjectAction } from "@/app/actions/project.actions"
import { toast } from "sonner"

const COLUMNS = [
    { id: "PLANNING", title: "Antrean (Backlog)", color: "border-slate-300" },
    { id: "IN_PROGRESS", title: "Sedang Dikerjakan", color: "border-blue-400" },
    { id: "ON_HOLD", title: "Tertunda (Review)", color: "border-amber-400" },
    { id: "COMPLETED", title: "Selesai", color: "border-green-400" },
]

export function KanbanBoard({ initialProjects }: { initialProjects: any[] }) {
    const handleMove = async (id: string, status: string) => {
        try {
            await updateProjectStatusAction(id, status as any)
            toast.success(`Proyek dipindahkan ke ${status}`)
        } catch (error: any) {
            toast.error("Gagal memindahkan proyek")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus proyek ini?")) return
        try {
            await deleteProjectAction(id)
            toast.success("Proyek berhasil dihapus")
        } catch (error: any) {
            toast.error("Gagal menghapus proyek: " + error.message)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((column) => (
                <div key={column.id} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground italic">
                            {column.title}
                        </h3>
                        <Badge variant="secondary" className="rounded-full">
                            {initialProjects.filter(p => p.status === column.id).length}
                        </Badge>
                    </div>

                    <div className={`flex flex-1 flex-col gap-4 rounded-xl border-t-4 bg-muted/30 p-3 min-h-[500px] ${column.color}`}>
                        {initialProjects
                            .filter((p) => p.status === column.id)
                            .map((project) => (
                                <Card key={project.id} className="group cursor-grab border-none shadow-sm transition-all active:cursor-grabbing hover:shadow-md">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-sm font-bold">{project.name}</CardTitle>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <HugeiconsIcon icon={MoreVerticalIcon} className="size-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {COLUMNS.map(col => col.id !== project.status && (
                                                        <DropdownMenuItem key={col.id} onClick={() => handleMove(project.id, col.id)}>
                                                            <HugeiconsIcon icon={ArrowRight02Icon} className="mr-2 size-3.5" />
                                                            {col.title}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(project.id)}
                                                        className="text-red-500 focus:text-red-500"
                                                    >
                                                        <HugeiconsIcon icon={Delete02Icon} className="mr-2 size-3.5" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        {project.websiteName && (
                                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-primary font-semibold">
                                                <HugeiconsIcon icon={GlobalIcon} className="size-3" />
                                                <span className="truncate">{project.websiteName}</span>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="line-clamp-2 text-xs text-muted-foreground mb-4">
                                            {project.description || "Tidak ada deskripsi."}
                                        </p>
                                        <div className="flex items-center justify-between gap-1 mt-2">
                                            <div className="flex flex-wrap gap-1.5">
                                                <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                                    <HugeiconsIcon icon={UserIcon} className="size-3" />
                                                    <span>{project.manager?.name || "Admin"}</span>
                                                </div>
                                                {project.environment && (
                                                    <div className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600 border border-purple-100 uppercase">
                                                        <HugeiconsIcon icon={ComputerIcon} className="size-3" />
                                                        <span>{project.environment}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground italic whitespace-nowrap">
                                                {new Date(project.updatedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                        {initialProjects.filter(p => p.status === column.id).length === 0 && (
                            <div className="flex flex-1 items-center justify-center p-8 text-center text-[11px] text-muted-foreground italic border border-dashed rounded-lg border-muted-foreground/20">
                                Kosong
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
