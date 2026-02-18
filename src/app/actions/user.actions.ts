"use server"

import { UserService } from "@/services/user.service";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { z } from "zod";
import { AuditService } from "@/services/audit.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const userSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email salah"),
    role: z.nativeEnum(Role),
    password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
});

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Akses ditolak. Anda bukan Admin.");
    }
}

export async function createUserAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Hanya admin yang dapat mengelola pengguna");
    }

    try {
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: (formData.get("password") as string) || undefined,
            role: formData.get("role") as Role,
        };

        const validated = userSchema.parse(rawData);
        const user = await UserService.createUser(validated);

        if (session?.user?.id) {
            await AuditService.logAction({
                action: "CREATE",
                entity: "USER",
                entityId: user.id,
                details: `Membuat pengguna baru: ${user.name} (${user.role})`,
                userId: session.user.id
            });
        }
        revalidatePath("/dashboard/settings/users");
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(error.issues[0].message);
        }
        throw new Error(error.message || "Gagal membuat pengguna");
    }
}

export async function updateUserAction(id: string, formData: FormData) {
    await checkAdmin();

    try {
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            role: formData.get("role") as Role,
            password: (formData.get("password") as string) || undefined,
        };

        const validated = userSchema.partial().parse(rawData);
        const user = await UserService.updateUser(id, validated);

        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            await AuditService.logAction({
                action: "UPDATE",
                entity: "USER",
                entityId: user.id,
                details: `Memperbarui data pengguna: ${user.name}`,
                userId: session.user.id
            });
        }
        revalidatePath("/dashboard/settings/users");
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(error.issues[0].message);
        }
        throw new Error(error.message || "Gagal memperbarui pengguna");
    }
}

export async function deleteUserAction(id: string) {
    try {
        await checkAdmin();
        await UserService.deleteUser(id);

        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            await AuditService.logAction({
                action: "DELETE",
                entity: "USER",
                entityId: id,
                details: `Menghapus pengguna`,
                userId: session.user.id
            });
        }
        revalidatePath("/dashboard/settings/users");
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus pengguna");
    }
}
