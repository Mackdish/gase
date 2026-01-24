import { NextResponse } from "next/server";
import { storeImage } from "@/lib/imageStorage";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File is required" }, { status: 400 });
  }

  const stored = await storeImage(file);
  return NextResponse.json({ ok: true, data: { url: stored.url } }, { status: 201 });
}
