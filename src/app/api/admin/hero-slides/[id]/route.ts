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
    const count = await prisma.heroSlide.count();
    if (count <= 1) {
      return NextResponse.json(
        { error: "Keep at least one hero image." },
        { status: 400 }
      );
    }

    await prisma.heroSlide.delete({ where: { id } });

    const remaining = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    await prisma.$transaction(
      remaining.map((slide, index) =>
        prisma.heroSlide.update({
          where: { id: slide.id },
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
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";

    if (code === "P2025") {
      return NextResponse.json(
        { error: "Hero image not found." },
        { status: 404 }
      );
    }

    console.error("Hero image delete error:", error);
    return NextResponse.json(
      { error: "Could not remove hero image." },
      { status: 500 }
    );
  }
}
