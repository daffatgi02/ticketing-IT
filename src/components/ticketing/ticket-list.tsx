"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    MoreVerticalIcon,
    Delete02Icon,
    Search01Icon,
    Ticket01Icon,
    PlusSignIcon,
    FilterIcon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTicketAction, updateTicketStatusAction } from "@/app/actions/ticket.actions"
import { toast } from "sonner"

export function TicketList({ initialTickets }: { initialTickets: any[] }) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTickets = initialTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus tiket ini?")) return

        try {
            await deleteTicketAction(id)
            toast.success("Tiket Berhasil Dihapus")
        } catch (error: any) {
            toast.error("Gagal menghapus tiket: " + error.message)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateTicketStatusAction(id, status as any)
            toast.success(`Status tiket diperbarui ke ${status}`)
        } catch (error: any) {
            toast.error("Gagal memperbarui status: " + error.message)
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT": return "bg-red-500/10 text-red-500 border-red-500/20"
            case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20"
            case "MEDIUM": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN": return "bg-green-500/10 text-green-500 border-green-500/20"
            case "IN_PROGRESS": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
            case "RESOLVED": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "CLOSED": return "bg-slate-500/10 text-slate-500 border-slate-500/20"
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari tiket berdasarkan judul atau ID..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <HugeiconsIcon icon={FilterIcon} className="size-4" />
                    Filter
                </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[120px]">ID</TableHead>
                                <TableHead>Judul Masalah</TableHead>
                                <TableHead>Pemohon</TableHead>
                                <TableHead>Prioritas</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-medium">{ticket.id.substring(0, 8)}</TableCell>
                                        <TableCell className="font-medium">{ticket.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{ticket.creator?.name || "Anonim"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")}>
                                                        Kerjakan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "RESOLVED")}>
                                                        Selesaikan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}>
                                                        Tutup
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(ticket.id)}
                                                        className="text-red-500 focus:text-red-500 focus:bg-red-50"
                                                    >
                                                        <HugeiconsIcon icon={Delete02Icon} className="mr-2 size-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Tidak ada tiket ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
