import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "service-images"
);

const EXTENSION_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Choose an image to upload." },
        { status: 400 }
      );
    }

    const extension = EXTENSION_BY_TYPE.get(image.type);
    if (!extension) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WebP, or GIF image." },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const uploadPath = path.join(UPLOAD_DIR, filename);
    const bytes = Buffer.from(await image.arrayBuffer());

    await writeFile(uploadPath, bytes);

    return NextResponse.json({
      imageUrl: `/uploads/service-images/${filename}`,
    });
  } catch (error) {
    console.error("Service image upload error:", error);
    return NextResponse.json(
      { error: "Could not upload image." },
      { status: 500 }
    );
  }
}
