import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  adminSafeSelect,
  isValidAdminEmail,
  normalizeAdminEmail,
  serializeAdminAccount,
} from "@/lib/admin-account";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email = normalizeAdminEmail(body.email);
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";

    if (!isValidAdminEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 }
      );
    }

    const currentAdmin = await prisma.adminUser.findUnique({
      where: { id: admin.id },
      select: { id: true, passwordHash: true },
    });

    if (
      !currentAdmin ||
      !(await verifyPassword(currentPassword, currentAdmin.passwordHash))
    ) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const existing = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing && existing.id !== admin.id) {
      return NextResponse.json(
        { error: "This email is already in use." },
        { status: 409 }
      );
    }

    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: { email },
      select: adminSafeSelect,
    });

    return NextResponse.json(serializeAdminAccount(updated));
  } catch (error) {
    console.error("Admin email update error:", error);
    return NextResponse.json(
      { error: "Could not update email." },
      { status: 500 }
    );
  }
}
