import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(128),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
});

export const productCreateSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  description: z.string().max(2000).optional(),
  price: z.number().int().nonnegative(),
  discount: z.number().int().min(0).max(95).optional(),
  stock: z.number().int().min(0).optional(),
  brand: z.string().max(80).optional(),
  images: z.array(z.string().url()).min(1),
  isFlashSale: z.boolean().optional(),
  categoryId: z.string().min(1),
});

export const cartAddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const cartUpdateSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELED"]),
});

export const guestCheckoutSchema = z.object({
  mobileNumber: z.string().trim().min(7).max(32),
  hostelName: z.string().trim().min(2).max(120),
  doorNumber: z.string().trim().min(1).max(40),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
});

export const reviewUpsertSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).nullable().optional(),
});
