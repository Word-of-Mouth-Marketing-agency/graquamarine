import { NextResponse } from "next/server";
import {
  isValidAdminEmail,
  normalizeAdminEmail,
} from "@/lib/admin-account";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import {
  createRawResetToken,
  getResetTokenExpiry,
  hashResetToken,
} from "@/lib/reset-token";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const GENERIC_MESSAGE = "If this email exists, we sent a password reset link.";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function isEmailProviderConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getBaseUrl(request: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  if (!isProduction()) return "http://localhost:3000";

  console.warn("NEXT_PUBLIC_SITE_URL is not set for password reset links.");
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const ipRateLimit = checkRateLimit(`admin-forgot-password-ip:${clientIp}`, {
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(ipRateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const email = normalizeAdminEmail(body.email);
    let devResetUrl: string | undefined;

    console.info("Forgot password requested.");
    if (!isProduction()) {
      console.info(`Forgot password email: ${email || "(invalid)"}`);
      console.info(
        `Password reset email provider configured: ${isEmailProviderConfigured()}`
      );
    }

    if (!email || !isValidAdminEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const rateLimit = checkRateLimit(`admin-forgot-password:${email}`, {
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (admin) {
      const now = new Date();
      const rawToken = createRawResetToken();
      const resetUrl = `${getBaseUrl(
        request
      )}/admin/reset-password?token=${encodeURIComponent(rawToken)}`;

      await prisma.$transaction([
        prisma.passwordResetToken.deleteMany({
          where: { expiresAt: { lt: now } },
        }),
        prisma.passwordResetToken.updateMany({
          where: {
            adminId: admin.id,
            usedAt: null,
          },
          data: { usedAt: now },
        }),
        prisma.passwordResetToken.create({
          data: {
            adminId: admin.id,
            tokenHash: hashResetToken(rawToken),
            expiresAt: getResetTokenExpiry(),
          },
        }),
      ]);

      try {
        const emailResult = await sendPasswordResetEmail({
          to: admin.email,
          name: admin.name,
          resetUrl,
        });

        if (!isProduction() && emailResult.skipped) {
          devResetUrl = resetUrl;
          console.info(`Local development reset link for ${admin.email}: ${resetUrl}`);
        }
      } catch (error) {
        console.error("Password reset email error:", error);
        if (!isProduction()) {
          devResetUrl = resetUrl;
          console.info(`Local development reset link for ${admin.email}: ${resetUrl}`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: GENERIC_MESSAGE,
      ...(devResetUrl && !isProduction() ? { devResetUrl } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
