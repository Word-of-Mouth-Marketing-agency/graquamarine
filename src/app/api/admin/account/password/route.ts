import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation must match." },
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

    if (await verifyPassword(newPassword, currentAdmin.passwordHash)) {
      return NextResponse.json(
        { error: "Choose a new password different from the current one." },
        { status: 400 }
      );
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin password update error:", error);
    return NextResponse.json(
      { error: "Could not update password." },
      { status: 500 }
    );
  }
}
