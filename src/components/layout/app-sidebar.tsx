"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    DashboardSquare01Icon,
    Ticket01Icon,
    Building01Icon,
    SourceCodeIcon,
    TaskDaily01Icon,
    Settings01Icon,
    UserIcon,
    Logout01Icon,
    UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { signOut, useSession } from "next-auth/react"

import Image from "next/image"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Beranda",
        url: "/dashboard",
        icon: DashboardSquare01Icon,
    },
    {
        title: "Tiket Bantuan",
        url: "/dashboard/ticketing",
        icon: Ticket01Icon,
    },
    {
        title: "Proyek Infrastruktur",
        url: "/dashboard/infrastructure",
        icon: Building01Icon,
    },
    {
        title: "Proyek Web Dev",
        url: "/dashboard/web-dev",
        icon: SourceCodeIcon,
    },
    {
        title: "Tugas Rutin",
        url: "/dashboard/tasks",
        icon: TaskDaily01Icon,
    },
    {
        title: "Pengaturan",
        url: "/dashboard/settings",
        icon: Settings01Icon,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    const navItems = React.useMemo(() => {
        // Base items for ADMIN and STAFF
        let filtered = [...items]

        // Jika USER, lepaskan semua kecuali "Tiket Bantuan"
        if (session?.user?.role === "USER") {
            filtered = items.filter(item => item.title === "Tiket Bantuan")
        }

        // Tambahkan Manajemen Pengguna khusus ADMIN
        if (session?.user?.role === "ADMIN") {
            filtered.push({
                title: "Manajemen Pengguna",
                url: "/dashboard/settings/users",
                icon: UserMultipleIcon,
            })
        }

        return filtered
    }, [session?.user?.role])

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden">
                                <Image
                                    src="/Logo WIG.png"
                                    alt="PT WIG Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold text-xs">PT Wijaya Inovasi Gemilang</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">IT Dashboard</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <HugeiconsIcon icon={item.icon} className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                                    <span>Keluar</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
