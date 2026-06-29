import type { AdminIdentity } from "@/types";

export const adminSafeSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function normalizeAdminEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidAdminEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeAdminName(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function serializeAdminAccount(admin: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): AdminIdentity {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    createdAt: admin.createdAt.toISOString(),
    updatedAt: admin.updatedAt.toISOString(),
  };
}
