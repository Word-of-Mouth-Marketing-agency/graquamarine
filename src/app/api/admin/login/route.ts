import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-auth";
import {
  normalizeAdminEmail,
  isValidAdminEmail,
} from "@/lib/admin-account";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/password";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const INVALID_LOGIN_ERROR = "Invalid email or password.";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`admin-login:${clientIp}`, {
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const { email: rawEmail, password } = body;
    const email = normalizeAdminEmail(rawEmail);

    if (!email || !isValidAdminEmail(email) || typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: INVALID_LOGIN_ERROR },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    const passwordMatches = admin
      ? await verifyPassword(password, admin.passwordHash)
      : false;

    if (!admin || !passwordMatches) {
      return NextResponse.json(
        { error: INVALID_LOGIN_ERROR },
        { status: 401 }
      );
    }

    await createAdminSession(admin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
