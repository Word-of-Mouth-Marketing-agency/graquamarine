import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { AdminIdentity } from "@/types";

const COOKIE_NAME = "graquamarine_admin";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  sub: string;
  iat: number;
  exp: number;
};

const adminSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production.");
  }

  return process.env.DATABASE_URL || "";
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function serializeAdmin(
  admin: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
): AdminIdentity {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    createdAt: admin.createdAt.toISOString(),
    updatedAt: admin.updatedAt.toISOString(),
  };
}

function createSessionToken(adminId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    sub: adminId,
    iat: now,
    exp: now + COOKIE_MAX_AGE_SECONDS,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string): string | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = signPayload(encodedPayload);
    if (!safeCompare(signature, expectedSignature)) return null;

    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<
      AdminSessionPayload
    >;
    if (!payload.sub || typeof payload.exp !== "number") return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null;

    return payload.sub;
  } catch {
    return null;
  }
}

function readCookieFromHeader(
  cookieHeader: string | null,
  name: string
): string | null {
  if (!cookieHeader) return null;

  const cookiesFromHeader = cookieHeader.split(";");
  for (const cookie of cookiesFromHeader) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

async function getAdminByToken(token: string | null): Promise<AdminIdentity | null> {
  if (!token) return null;

  const adminId = verifySessionToken(token);
  if (!adminId) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: adminSelect,
  });

  return admin ? serializeAdmin(admin) : null;
}

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return getAdminByToken(cookie?.value || null);
}

export async function getAdminFromRequest(
  request: Request
): Promise<AdminIdentity | null> {
  return getAdminByToken(
    readCookieFromHeader(request.headers.get("cookie"), COOKIE_NAME)
  );
}

export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getCurrentAdmin());
}

export async function createAdminSession(adminUser: {
  id: string;
}): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(adminUser.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
