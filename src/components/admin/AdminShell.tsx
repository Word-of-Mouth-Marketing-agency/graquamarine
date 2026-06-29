"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { AdminIdentity } from "@/types";

type AdminShellProps = {
  title: string;
  subtitle: string;
  admin: AdminIdentity;
  countLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navItems = [
  { label: "Reservations", href: "/admin" },
  { label: "Services", href: "/admin/services" },
  { label: "Hero Images", href: "/admin/hero" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminShell({
  title,
  subtitle,
  admin,
  countLabel,
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7fbfd]">
      <header className="border-b border-brand-aqua/15 bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-wide text-brand-aqua"
              >
                Graquamarine
              </Link>
              <p className="mt-1 text-xs text-white/60">Website control panel</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="max-w-64 truncate text-sm font-bold text-white">
                  {admin.name}
                </p>
                <p className="max-w-64 truncate text-xs text-white/60">
                  {admin.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white transition hover:border-brand-aqua hover:bg-brand-aqua"
              >
                Logout
              </button>
            </div>
          </div>

          <nav className="flex justify-start gap-2 overflow-x-auto rounded-full bg-white/10 p-1 sm:justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-brand-navy shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
                Admin
              </p>
              <h1 className="mt-1 text-3xl font-bold text-brand-navy">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-navy/65">
                {subtitle}
              </p>
              {countLabel && (
                <p className="mt-2 text-sm font-semibold text-brand-navy/55">
                  {countLabel}
                </p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
