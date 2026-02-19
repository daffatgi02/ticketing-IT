"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import {
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
import { formatErrorMessage } from "@/lib/utils"

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
                toast.error("Gagal Masuk: " + formatErrorMessage(result.error))
            } else {
                toast.success("Berhasil Masuk!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem: " + formatErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Background Decorative Elements - Simplified */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <Card className="relative z-10 w-full max-w-[420px] border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white/95 backdrop-blur-sm rounded-[1.5rem] overflow-hidden">
                <CardHeader className="pt-10 pb-6 px-8 text-center space-y-4">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 p-2.5 transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/Logo WIG.png"
                            alt="PT WIG Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle className="text-xl font-bold tracking-tight text-slate-800 uppercase tracking-tighter">Welcome Back</CardTitle>
                        <CardDescription className="text-[12px] font-medium text-slate-400">
                            Access IT Platform PT Wijaya Inovasi
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Email Address</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary">
                                    <HugeiconsIcon icon={Mail01Icon} className="size-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@wijayainovasi.id"
                                    className="h-12 pl-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 font-medium"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" title="password" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</Label>
                                <a href="#" className="text-xs font-bold text-primary hover:opacity-80 transition-opacity">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-primary">
                                    <HugeiconsIcon icon={AccessIcon} className="size-5" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 pl-12 pr-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 font-medium"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                >
                                    <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} className="size-5" />
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="h-12 w-full bg-primary hover:bg-primary/95 text-white rounded-xl shadow-[0_8px_30px_rgba(var(--primary),0.15)] font-bold tracking-[0.2em] uppercase text-[10px] transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                    <div className="mt-10 pt-6 border-t border-slate-50">
                        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em] leading-relaxed opacity-80">
                            &copy; {new Date().getFullYear()} PT Wijaya Inovasi Global
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
