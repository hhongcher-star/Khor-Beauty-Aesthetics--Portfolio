import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@khorbeauty.com" },
    update: {},
    create: {
      email: "admin@khorbeauty.com",
      password: hashedPassword,
      name: "Khor Beauty Admin",
      role: "admin",
    },
  });

  console.log("Admin user created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });