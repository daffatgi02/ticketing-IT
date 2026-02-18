import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
    static async getAllUsers() {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    static async createUser(data: {
        name: string;
        email: string;
        password?: string;
        role: Role;
    }) {
        const passwordHash = data.password
            ? await bcrypt.hash(data.password, 10)
            : undefined;

        return await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: data.role,
            }
        });
    }

    static async updateUser(id: string, data: Partial<{
        name: string;
        email: string;
        role: Role;
        password?: string;
    }>) {
        const updateData: any = { ...data };

        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
            delete updateData.password;
        }

        return await prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    static async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id }
        });
    }
}
