"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className
}: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    // Logic to show a limited number of page buttons could be added here if needed
    // For now, showing all since our lists won't have thousands of pages yet.

    return (
        <div className={cn("flex items-center justify-between px-2 py-4", className)}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Page <span className="text-primary">{currentPage}</span> of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg border-slate-100 hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-30"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {pages.map(page => {
                        // Very basic elipsis logic for very long lists
                        if (totalPages > 7) {
                            if (page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                                if (page === 2 || page === totalPages - 1) return <span key={page} className="px-1 text-slate-300">...</span>
                                return null
                            }
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="icon"
                                className={cn(
                                    "size-8 rounded-lg text-xs font-bold transition-all",
                                    currentPage === page
                                        ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                                        : "hover:bg-slate-50 text-slate-500 hover:text-primary"
                                )}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </Button>
                        )
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg border-slate-100 hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-30"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
            </div>
        </div>
    )
}
