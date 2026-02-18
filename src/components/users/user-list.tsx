"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    Delete02Icon,
    MoreVerticalIcon,
    UserIcon,
    MailIcon,
    SearchIcon
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
import { deleteUserAction } from "@/app/actions/user.actions"
import { toast } from "sonner"

export function UserList({ initialUsers }: { initialUsers: any[] }) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredUsers = initialUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.")) return

        try {
            await deleteUserAction(id)
            toast.success("Pengguna berhasil dihapus")
        } catch (error: any) {
            toast.error("Gagal menghapus pengguna: " + error.message)
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "ADMIN": return "bg-red-500/10 text-red-500 border-red-500/20"
            case "STAFF": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "USER": return "bg-slate-500/10 text-slate-500 border-slate-500/20"
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <HugeiconsIcon icon={SearchIcon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari pengguna berdasarkan nama atau email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Peran</TableHead>
                                <TableHead>Tanggal Terdaftar</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <HugeiconsIcon icon={UserIcon} className="size-4" />
                                                </div>
                                                {user.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground italic">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getRoleColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString("id-ID")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuItem onClick={() => toast.info("Fitur edit segera hadir")}>
                                                        Edit Profil
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(user.id)}
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
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        Tidak ada pengguna ditemukan.
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
