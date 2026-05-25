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

  const services = [
    {
      name: "Signature Glow Facial",
      description: "Editable business content: a hydrating facial designed for brighter, calmer skin.",
      price: 188,
      durationMin: 60,
      category: "Facial Treatment",
    },
    {
      name: "Skin Booster Treatment",
      description: "Editable business content: a premium hydration treatment for smoother-looking skin.",
      price: 388,
      durationMin: 90,
      category: "Skin Booster",
    },
    {
      name: "Brightening Care",
      description: "Editable business content: targeted care for dullness and uneven-looking tone.",
      price: 288,
      durationMin: 75,
      category: "Brightening",
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

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
