"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    MoreVerticalIcon,
    Delete02Icon,
    Search01Icon,
    Ticket01Icon,
    PlusSignIcon,
    FilterIcon,
    ViewIcon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
import { Pagination } from "@/components/ui/pagination"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { deleteTicketAction, updateTicketStatusAction } from "@/app/actions/ticket.actions"
import { toast } from "sonner"
import { formatErrorMessage } from "@/lib/utils"

import { useSession } from "next-auth/react"

const ITEMS_PER_PAGE = 8

export function TicketList({ initialTickets }: { initialTickets: any[] }) {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN"

    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const filteredTickets = initialTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination Logic
    const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const handleDelete = async () => {
        if (!ticketToDelete) return
        setIsDeleting(true)

        try {
            await deleteTicketAction(ticketToDelete)
            toast.success("Tiket Berhasil Dihapus")
            setTicketToDelete(null)
        } catch (error: any) {
            toast.error("Gagal menghapus tiket: " + formatErrorMessage(error))
        } finally {
            setIsDeleting(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateTicketStatusAction(id, status as any)
            toast.success(`Status tiket diperbarui ke ${status}`)
        } catch (error: any) {
            toast.error("Gagal memperbarui status: " + formatErrorMessage(error))
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
                            {paginatedTickets.length > 0 ? (
                                paginatedTickets.map((ticket) => (
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
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="size-8 text-primary hover:bg-primary/10" asChild title="Lihat Detail">
                                                    <Link href={`/dashboard/ticketing/${ticket.id}`}>
                                                        <HugeiconsIcon icon={ViewIcon} className="size-4" />
                                                    </Link>
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`/dashboard/ticketing/${ticket.id}`} className="flex items-center">
                                                                <HugeiconsIcon icon={ViewIcon} className="mr-2 size-4" />
                                                                Lihat Detail
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        {isAdmin && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")} className="cursor-pointer">
                                                                    Kerjakan
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "RESOLVED")} className="cursor-pointer">
                                                                    Selesaikan
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "CLOSED")} className="cursor-pointer">
                                                                    Tutup
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => setTicketToDelete(ticket.id)}
                                                                    className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                                                                >
                                                                    <HugeiconsIcon icon={Delete02Icon} className="mr-2 size-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <ConfirmModal
                isOpen={!!ticketToDelete}
                onClose={() => setTicketToDelete(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                variant="destructive"
                title="Hapus Tiket?"
                description="Tiket ini akan dihapus permanen. Pastikan masalah sudah benar-benar selesai atau tidak valid."
                confirmText="Ya, Hapus Tiket"
            />
        </div>
    )
}
