import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import {
  adminSafeSelect,
  normalizeAdminName,
  serializeAdminAccount,
} from "@/lib/admin-account";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = normalizeAdminName(body.name);

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        { error: "Name must be 80 characters or shorter." },
        { status: 400 }
      );
    }

    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: { name },
      select: adminSafeSelect,
    });

    return NextResponse.json(serializeAdminAccount(updated));
  } catch (error) {
    console.error("Admin profile update error:", error);
    return NextResponse.json(
      { error: "Could not update profile." },
      { status: 500 }
    );
  }
}
