import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminGalleryImages } from "@/lib/gallery-images";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

const EXTENSION_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const images = await getAdminGalleryImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Admin gallery images fetch error:", error);
    return NextResponse.json(
      { error: "Could not load gallery images." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Choose a gallery image to upload." },
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
        { error: "Gallery image must be 8 MB or smaller." },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const uploadPath = path.join(UPLOAD_DIR, filename);
    const bytes = Buffer.from(await image.arrayBuffer());

    await writeFile(uploadPath, bytes);

    const currentLast = await prisma.galleryImage.findFirst({
      orderBy: { sortOrder: "desc" },
    });

    const galleryImage = await prisma.galleryImage.create({
      data: {
        imageUrl: `/uploads/gallery/${filename}`,
        alt: "Graquamarine gallery image",
        sortOrder: currentLast ? currentLast.sortOrder + 1 : 0,
        isActive: true,
      },
    });

    revalidatePath("/");

    return NextResponse.json({
      image: {
        id: galleryImage.id,
        imageUrl: galleryImage.imageUrl,
        alt: galleryImage.alt || "",
        sortOrder: galleryImage.sortOrder,
        isActive: galleryImage.isActive,
      },
    });
  } catch (error) {
    console.error("Gallery image upload error:", error);
    return NextResponse.json(
      { error: "Could not upload gallery image." },
      { status: 500 }
    );
  }
}
