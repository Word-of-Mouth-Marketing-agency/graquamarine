import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "graquamarine_admin";
const HASH_ALGORITHM = "sha256";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function hashPassword(password: string): string {
  return crypto.createHash(HASH_ALGORITHM).update(password).digest("hex");
}

export function createAdminCookieValue(): string {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }
  const token = crypto.randomBytes(32).toString("hex");
  const hash = hashPassword(adminPassword);
  return `${token}.${hash}`;
}

export function verifyAdminCookieValue(cookieValue: string): boolean {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return false;
    const parts = cookieValue.split(".");
    if (parts.length !== 2) return false;
    const hash = parts[1];
    const expectedHash = hashPassword(adminPassword);
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;
  return verifyAdminCookieValue(cookie.value);
}

export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createAdminCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
