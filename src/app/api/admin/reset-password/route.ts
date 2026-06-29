import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { hashResetToken } from "@/lib/reset-token";

const INVALID_TOKEN_ERROR = "This reset link is invalid or expired.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!token) {
      return NextResponse.json(
        { error: INVALID_TOKEN_ERROR },
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

    const tokenHash = hashResetToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        adminId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { error: INVALID_TOKEN_ERROR },
        { status: 400 }
      );
    }

    const now = new Date();
    const updatedPasswordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      const tokenUse = await tx.passwordResetToken.updateMany({
        where: {
          id: resetToken.id,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });

      if (tokenUse.count !== 1) {
        throw new Error("Invalid reset token state.");
      }

      await tx.adminUser.update({
        where: { id: resetToken.adminId },
        data: { passwordHash: updatedPasswordHash },
      });

      await tx.passwordResetToken.updateMany({
        where: {
          adminId: resetToken.adminId,
          id: { not: resetToken.id },
          usedAt: null,
        },
        data: { usedAt: now },
      });
    });

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: INVALID_TOKEN_ERROR },
      { status: 400 }
    );
  }
}
