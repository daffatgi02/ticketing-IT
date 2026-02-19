"use client"

import { MonitoringStatus } from "@/types/monitoring"
import { HugeiconsIcon } from "@hugeicons/react"
import { SignalIcon, GlobalIcon, Alert01Icon, Tick01Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MonitoringCardProps {
    name: string
    address: string
    type: "IP" | "WEBSITE"
    status?: MonitoringStatus
    isLoading?: boolean
}

export function MonitoringCard({ name, address, type, status, isLoading }: MonitoringCardProps) {
    const isUp = status?.status === "UP"
    const isDown = status?.status === "DOWN"

    return (
        <Card className={cn(
            "group overflow-hidden transition-all hover:shadow-md",
            isDown ? "border-red-200 bg-red-50/10" : "border-slate-100"
        )}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex size-8 items-center justify-center rounded-lg transition-colors",
                                type === "IP" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                            )}>
                                <HugeiconsIcon icon={type === "IP" ? SignalIcon : GlobalIcon} className="size-4" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight">{name}</h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1 opacity-70 px-1 truncate max-w-[180px]">
                            {address}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 animate-pulse">
                            <div className="size-1.5 rounded-full bg-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Checking</span>
                        </div>
                    ) : (
                        <Badge variant="outline" className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter transition-all",
                            isUp ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                isDown ? "bg-red-50 text-red-600 border-red-100 animate-pulse" :
                                    "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                            <div className={cn("size-1.5 rounded-full mr-1.5", isUp ? "bg-emerald-500" : isDown ? "bg-red-500" : "bg-slate-300")} />
                            {status?.status || "Unknown"}
                        </Badge>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Clock01Icon} className="size-3 text-slate-400" />
                        <span className="text-[10px] text-slate-400 font-medium">
                            {status?.latency ? `${status.latency}ms` : "—"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {isUp ? (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600/80 uppercase tracking-widest">
                                <HugeiconsIcon icon={Tick01Icon} className="size-3" />
                                Stable
                            </div>
                        ) : isDown ? (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-red-600/80 uppercase tracking-widest">
                                <HugeiconsIcon icon={Alert01Icon} className="size-3" />
                                Timeout
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
