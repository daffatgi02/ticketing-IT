"use client"

import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    DocumentValidationIcon,
    Invoice02Icon,
    CreditCardIcon,
    Settings02Icon,
    CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons"

const PHASES = [
    { key: "PROPOSAL", label: "Proposal", icon: DocumentValidationIcon },
    { key: "RKB", label: "RKB", icon: Invoice02Icon },
    { key: "DISBURSEMENT", label: "Pencairan", icon: CreditCardIcon },
    { key: "EXECUTION", label: "Eksekusi", icon: Settings02Icon },
    { key: "COMPLETED", label: "Selesai", icon: CheckmarkCircle02Icon },
] as const

type PhaseKey = typeof PHASES[number]["key"]

interface PhaseStepperProps {
    currentPhase: PhaseKey
    onPhaseClick?: (phase: PhaseKey) => void
    activeTab?: PhaseKey
}

export function PhaseStepper({ currentPhase, onPhaseClick, activeTab }: PhaseStepperProps) {
    const currentIndex = PHASES.findIndex(p => p.key === currentPhase)

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {PHASES.map((phase, index) => {
                    const isCompleted = index < currentIndex
                    const isCurrent = index === currentIndex
                    const isClickable = index <= currentIndex && onPhaseClick
                    const isActive = activeTab === phase.key

                    return (
                        <div key={phase.key} className="flex items-center flex-1 last:flex-none">
                            {/* Step Circle + Label */}
                            <button
                                onClick={() => isClickable && onPhaseClick?.(phase.key)}
                                disabled={!isClickable}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 group transition-all",
                                    isClickable && "cursor-pointer",
                                    !isClickable && "cursor-default"
                                )}
                            >
                                <div className={cn(
                                    "flex size-10 items-center justify-center rounded-full border-2 transition-all",
                                    isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                                    isCurrent && "border-primary bg-primary text-white shadow-lg shadow-primary/30",
                                    !isCompleted && !isCurrent && "border-muted-foreground/30 bg-background text-muted-foreground/50",
                                    isActive && "ring-2 ring-primary/30 ring-offset-2",
                                )}>
                                    {isCompleted ? (
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
                                    ) : (
                                        <HugeiconsIcon icon={phase.icon} className="size-5" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[11px] font-medium whitespace-nowrap",
                                    isCompleted && "text-emerald-600",
                                    isCurrent && "text-primary font-semibold",
                                    !isCompleted && !isCurrent && "text-muted-foreground/50",
                                )}>
                                    {phase.label}
                                </span>
                            </button>

                            {/* Connector Line */}
                            {index < PHASES.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-0.5 mx-2 rounded-full transition-all",
                                    index < currentIndex ? "bg-emerald-500" : "bg-muted-foreground/20"
                                )} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { PHASES, type PhaseKey }
