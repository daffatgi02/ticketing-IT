const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@wijayainovasi.id" },
        update: {
            passwordHash,
            role: "ADMIN",
        },
        create: {
            email: "admin@wijayainovasi.id",
            name: "Budi Santoso (Admin)",
            passwordHash,
            role: "ADMIN",
        },
    });

    // 2. Create Staff
    const staff = await prisma.user.upsert({
        where: { email: "staff@wijayainovasi.id" },
        update: {
            passwordHash,
            role: "STAFF",
        },
        create: {
            email: "staff@wijayainovasi.id",
            name: "Andi Wijaya (IT Staff)",
            passwordHash,
            role: "STAFF",
        },
    });

    // 3. Create Regular User
    const user = await prisma.user.upsert({
        where: { email: "user@wijayainovasi.id" },
        update: {
            passwordHash,
            role: "USER",
        },
        create: {
            email: "user@wijayainovasi.id",
            name: "Siti Aminah (Karyawan)",
            passwordHash,
            role: "USER",
        },
    });

    console.log("Seeding complete:");
    console.log("- Admin: admin@wijayainovasi.id / password123");
    console.log("- Staff: staff@wijayainovasi.id / password123");
    console.log("- User: user@wijayainovasi.id / password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
