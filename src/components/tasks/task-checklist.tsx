"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { TaskDaily01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toggleTaskCompletionAction, deleteTaskAction } from "@/app/actions/task.actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function TaskChecklist({ tasks }: { tasks: any[] }) {
    const handleToggle = async (id: string, isCompleted: boolean) => {
        try {
            await toggleTaskCompletionAction(id, isCompleted)
            toast.success(isCompleted ? "Tugas selesai" : "Tugas dibuka kembali")
        } catch (error: any) {
            toast.error("Gagal memperbarui tugas: " + error.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus tugas ini?")) return

        try {
            await deleteTaskAction(id)
            toast.success("Tugas dihapus")
        } catch (error: any) {
            toast.error("Gagal menghapus tugas: " + error.message)
        }
    }

    return (
        <div className="grid gap-3">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <Card key={task.id} className={cn(
                        "group transition-all hover:shadow-sm",
                        task.isCompleted && "bg-muted/50 opacity-70"
                    )}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox
                                    checked={task.isCompleted}
                                    onCheckedChange={(checked) => handleToggle(task.id, !!checked)}
                                />
                                <div className="space-y-0.5">
                                    <p className={cn(
                                        "text-sm font-semibold",
                                        task.isCompleted && "line-through text-muted-foreground"
                                    )}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {task.description || "Tidak ada deskripsi."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {task.lastCompletedAt && (
                                    <span className="text-[10px] text-muted-foreground italic">
                                        Selesai: {new Date(task.lastCompletedAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-opacity"
                                    onClick={() => handleDelete(task.id)}
                                >
                                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                    Belum ada tugas untuk kategori ini.
                </div>
            )}
        </div>
    )
}
