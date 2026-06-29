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

    const existing = await prisma.heroSlide.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (existing.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more hero images could not be found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.heroSlide.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    const slides = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    revalidatePath("/");

    return NextResponse.json({
      slides: slides.map((slide) => ({
        id: slide.id,
        imageUrl: slide.imageUrl,
        alt: slide.alt || "",
        sortOrder: slide.sortOrder,
        isActive: slide.isActive,
      })),
    });
  } catch (error) {
    console.error("Hero image reorder error:", error);
    return NextResponse.json(
      { error: "Could not update hero image order." },
      { status: 500 }
    );
  }
}
