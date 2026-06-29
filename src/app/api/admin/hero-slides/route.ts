import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminHeroSlides } from "@/lib/hero-slides";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero-slides");

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
    const slides = await getAdminHeroSlides();
    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Admin hero slides fetch error:", error);
    return NextResponse.json(
      { error: "Could not load hero images." },
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
        { error: "Choose a hero image to upload." },
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
        { error: "Hero image must be 8 MB or smaller." },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const uploadPath = path.join(UPLOAD_DIR, filename);
    const bytes = Buffer.from(await image.arrayBuffer());

    await writeFile(uploadPath, bytes);

    const currentLast = await prisma.heroSlide.findFirst({
      orderBy: { sortOrder: "desc" },
    });

    const slide = await prisma.heroSlide.create({
      data: {
        imageUrl: `/uploads/hero-slides/${filename}`,
        alt: "Graquamarine hero image",
        sortOrder: currentLast ? currentLast.sortOrder + 1 : 0,
        isActive: true,
      },
    });

    revalidatePath("/");

    return NextResponse.json({
      slide: {
        id: slide.id,
        imageUrl: slide.imageUrl,
        alt: slide.alt || "",
        sortOrder: slide.sortOrder,
        isActive: slide.isActive,
      },
    });
  } catch (error) {
    console.error("Hero image upload error:", error);
    return NextResponse.json(
      { error: "Could not upload hero image." },
      { status: 500 }
    );
  }
}
