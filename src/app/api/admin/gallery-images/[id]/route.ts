import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const count = await prisma.galleryImage.count();
    if (count <= 1) {
      return NextResponse.json(
        { error: "Keep at least one gallery image." },
        { status: 400 }
      );
    }

    await prisma.galleryImage.delete({ where: { id } });

    const remaining = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    await prisma.$transaction(
      remaining.map((image, index) =>
        prisma.galleryImage.update({
          where: { id: image.id },
          data: { sortOrder: index },
        })
      )
    );

    const images = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    revalidatePath("/");

    return NextResponse.json({
      images: images.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        alt: image.alt || "",
        sortOrder: image.sortOrder,
        isActive: image.isActive,
      })),
    });
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";

    if (code === "P2025") {
      return NextResponse.json(
        { error: "Gallery image not found." },
        { status: 404 }
      );
    }

    console.error("Gallery image delete error:", error);
    return NextResponse.json(
      { error: "Could not remove gallery image." },
      { status: 500 }
    );
  }
}
