import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const ALLOWED_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, adminNote } = body;

    const existing = await prisma.reservation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      data.status = status;
    }

    if (adminNote !== undefined) {
      data.adminNote = typeof adminNote === "string" ? adminNote.trim() : null;
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin reservation update error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
