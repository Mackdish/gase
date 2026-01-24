import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type StoredImage = {
  url: string;
};

export async function storeImageLocally(file: File): Promise<StoredImage> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = path.extname(file.name).toLowerCase() || ".png";
  const safeExt = [".png", ".jpg", ".jpeg", ".webp"].includes(ext) ? ext : ".png";
  const name = `${crypto.randomUUID()}${safeExt}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const outPath = path.join(uploadDir, name);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(outPath, buffer);

  return { url: `/uploads/${name}` };
}

export async function storeImage(file: File): Promise<StoredImage> {
  // Cloudinary-ready: if you add Cloudinary credentials later, switch here.
  return await storeImageLocally(file);
}
