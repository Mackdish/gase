import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gas-shop.local";
  const admin2Email = "tesheric9@gmail.com";
  const customerEmail = "customer@gas-shop.local";

  const [adminPasswordHash, admin2PasswordHash, customerPasswordHash] = await Promise.all([
    bcrypt.hash("Admin123!", 10),
    bcrypt.hash("121212", 10),
    bcrypt.hash("Customer123!", 10),
  ]);

  const gas = await prisma.category.upsert({
    where: { slug: "gas" },
    update: { name: "GAS" },
    create: { name: "GAS", slug: "gas" },
  });

  const electrical = await prisma.category.upsert({
    where: { slug: "electrical-equipments" },
    update: { name: "ELECTRICAL EQUIPMENTS" },
    create: { name: "ELECTRICAL EQUIPMENTS", slug: "electrical-equipments" },
  });

  const furnitures = await prisma.category.upsert({
    where: { slug: "furnitures" },
    update: { name: "FURNITURES" },
    create: { name: "FURNITURES", slug: "furnitures" },
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Admin",
      email: adminEmail,
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: admin2Email },
    update: {
      name: "Admin",
      role: "ADMIN",
      passwordHash: admin2PasswordHash,
    },
    create: {
      name: "Admin",
      email: admin2Email,
      role: "ADMIN",
      passwordHash: admin2PasswordHash,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {},
    create: {
      name: "Customer",
      email: customerEmail,
      role: "CUSTOMER",
      passwordHash: customerPasswordHash,
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

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  const earbuds = await prisma.product.findUnique({
    where: { slug: "wireless-earbuds-pro" },
    select: { id: true },
  });

  const sneakers = await prisma.product.findUnique({
    where: { slug: "mens-minimal-sneakers" },
    select: { id: true },
  });

  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {
      items: {
        deleteMany: {},
      },
    },
    create: {
      userId: customer.id,
    },
  });

  const cart = await prisma.cart.findUnique({
    where: { userId: customer.id },
    select: { id: true },
  });

  if (cart && earbuds && sneakers) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: earbuds.id } },
      update: {},
      create: { cartId: cart.id, productId: earbuds.id, quantity: 1 },
    });
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: sneakers.id } },
      update: {},
      create: { cartId: cart.id, productId: sneakers.id, quantity: 2 },
    });
  }

  const firstProduct = await prisma.product.findUnique({
    where: { slug: "wireless-earbuds-pro" },
    select: { id: true },
  });

  if (firstProduct) {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: customer.id,
          productId: firstProduct.id,
        },
      },
      update: {
        rating: 5,
        comment: "Great sound and battery life.",
      },
      create: {
        userId: customer.id,
        productId: firstProduct.id,
        rating: 5,
        comment: "Great sound and battery life.",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
