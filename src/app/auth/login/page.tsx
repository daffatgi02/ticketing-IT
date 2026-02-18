"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import {
    DashboardSquare01Icon,
    Mail01Icon,
    AccessIcon,
    ViewIcon,
    ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Gagal Masuk: " + result.error)
            } else {
                toast.success("Berhasil Masuk!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-[400px] border-none shadow-2xl">
                <CardHeader className="space-y-4 pb-8 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden p-2">
                        <Image
                            src="/Logo WIG.png"
                            alt="PT WIG Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</CardTitle>
                        <CardDescription className="text-sm">
                            Silakan masuk ke <span className="font-semibold text-foreground">IT Dashboard PT WIG</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <div className="relative">
                                <HugeiconsIcon icon={Mail01Icon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@wijayainovasi.id"
                                    className="pl-10"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <a href="#" className="text-xs text-primary hover:underline">Lupa kata sandi?</a>
                            </div>
                            <div className="relative">
                                <HugeiconsIcon icon={AccessIcon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="px-10"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} className="size-4" />
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full shadow-lg shadow-primary/20" disabled={isLoading}>
                            {isLoading ? "Memproses..." : "Masuk Sekarang"}
                        </Button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            &copy; 2024 PT Wijaya Inovasi Gemilang. Seluruh Hak Cipta Dilindungi.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
