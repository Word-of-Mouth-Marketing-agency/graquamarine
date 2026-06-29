import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.filter((id: unknown): id is string => typeof id === "string")
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Image order is required." },
        { status: 400 }
      );
    }

    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return NextResponse.json(
        { error: "Image order contains duplicates." },
        { status: 400 }
      );
    }

    const existing = await prisma.galleryImage.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (existing.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more gallery images could not be found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.galleryImage.update({
          where: { id },
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
    console.error("Gallery image reorder error:", error);
    return NextResponse.json(
      { error: "Could not update gallery image order." },
      { status: 500 }
    );
  }
}
