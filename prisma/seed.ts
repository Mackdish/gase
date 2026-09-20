import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running the seed."
    );
  }

  const [gas, electrical, furnitures] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "gas" },
      update: { name: "GAS" },
      create: { name: "GAS", slug: "gas" },
    }),
    prisma.category.upsert({
      where: { slug: "electrical-equipments" },
      update: { name: "ELECTRICAL EQUIPMENTS" },
      create: { name: "ELECTRICAL EQUIPMENTS", slug: "electrical-equipments" },
    }),
    prisma.category.upsert({
      where: { slug: "furnitures" },
      update: { name: "FURNITURES" },
      create: { name: "FURNITURES", slug: "furnitures" },
    }),
  ]);

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrator",
      role: "ADMIN",
      passwordHash,
    },
    create: {
      name: "Administrator",
      email: adminEmail,
      role: "ADMIN",
      passwordHash,
    },
  });

  const products = [
    {
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      description: "Clear sound, strong bass, long battery life.",
      price: 4500,
      discount: 20,
      stock: 35,
      brand: "NovaSound",
      images: "https://placehold.co/600x600/png",
      isFlashSale: true,
      categoryId: electrical.id,
    },
    {
      name: "Smart Watch Active",
      slug: "smart-watch-active",
      description: "Fitness tracking, notifications, water resistant.",
      price: 7200,
      discount: 10,
      stock: 20,
      brand: "Pulse",
      images: "https://placehold.co/600x600/png",
      isFlashSale: false,
      categoryId: electrical.id,
    },
    {
      name: "Men's Minimal Sneakers",
      slug: "mens-minimal-sneakers",
      description: "Comfort fit, lightweight.",
      price: 3800,
      discount: 15,
      stock: 50,
      brand: "StreetWear",
      images: "https://placehold.co/600x600/png",
      isFlashSale: true,
      categoryId: furnitures.id,
    },
    {
      name: "Gas Regulator Kit",
      slug: "gas-regulator-kit",
      description: "Reliable regulator kit for home and commercial use.",
      price: 2500,
      discount: 5,
      stock: 40,
      brand: "SafeFlow",
      images: "https://placehold.co/600x600/png",
      isFlashSale: false,
      categoryId: gas.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
