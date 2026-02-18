"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
    isLoading?: boolean
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    variant = "default",
    isLoading = false
}: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] border-none shadow-2xl p-0 overflow-hidden rounded-2xl">
                <div className={cn(
                    "h-1.5 w-full",
                    variant === "destructive" ? "bg-red-500" : "bg-primary"
                )} />

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                            variant === "destructive" ? "bg-red-50 text-red-500" : "bg-primary/5 text-primary"
                        )}>
                            <HugeiconsIcon icon={AlertCircleIcon} className="size-5" />
                        </div>
                        <DialogHeader className="text-left">
                            <DialogTitle className="text-lg font-bold tracking-tight text-slate-800">
                                {title}
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <DialogDescription className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                        {description}
                    </DialogDescription>

                    <DialogFooter className="flex flex-row items-center gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 sm:flex-none text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl py-5"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === "destructive" ? "destructive" : "default"}
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "flex-1 sm:flex-none text-xs font-bold uppercase tracking-widest rounded-xl py-5 px-8 shadow-md transition-all active:scale-[0.98]",
                                variant === "destructive"
                                    ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                                    : "bg-primary hover:bg-primary/95 shadow-primary/20"
                            )}
                        >
                            {isLoading ? "Memproses..." : confirmText}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
