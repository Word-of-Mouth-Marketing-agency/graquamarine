"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerClassName = isHome
    ? "absolute inset-x-0 top-0 z-40 border-b border-white/15 bg-transparent text-white"
    : "relative z-40 border-b border-cyan-900/20 bg-[#063b5c] text-white";
  const navLinkClassName = isHome
    ? "text-white/90 hover:text-white"
    : "text-cyan-50/85 hover:text-white";

  return (
    <header className={headerClassName}>
      <div className="border-b border-white/15 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">{siteConfig.location}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/85">
            {siteConfig.phonePlaceholders.map((phone) => (
              <span key={phone}>{phone}</span>
            ))}
            <SocialIconLinks iconClassName="border-white/35 text-white/90" />
          </div>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-white">
            {siteConfig.name}
          </Link>
          <Link
            href="/activities"
            className="rounded-full bg-[#f4c76b] px-4 py-2 text-sm font-semibold text-[#063b5c] shadow-sm sm:hidden"
          >
            Reserve Now
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ul className="flex flex-wrap gap-4 text-sm font-medium">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={navLinkClassName}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/activities"
            className="hidden rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white hover:text-[#063b5c] sm:inline-flex"
          >
            Reserve Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
