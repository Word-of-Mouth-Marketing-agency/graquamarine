"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerClassName = isHome
    ? "absolute inset-x-0 top-0 z-40 border-b border-white/15 bg-transparent text-white"
    : "relative z-40 border-b border-brand-navy/20 bg-brand-navy text-white";
  const navLinkClassName = isHome
    ? "text-white/90 hover:text-white"
    : "text-white/85 hover:text-white";

  return (
    <header className={headerClassName}>
      <div className="border-b border-white/15 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">{siteConfig.location}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/85">
            <a
              href={`tel:${siteConfig.phone}`}
              className="hover:text-white"
            >
              {siteConfig.displayPhone}
            </a>
            <SocialIconLinks iconClassName="border-white/35 text-white/90" />
          </div>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="block">
            <Image
              src="/images/logo/site-white-logo.png"
              alt={siteConfig.name}
              width={200}
              height={48}
              className="h-12 w-auto sm:h-16"
              priority
            />
          </Link>
          <Link
            href="/activities"
            className="rounded-full bg-brand-aqua px-4 py-2 text-sm font-semibold text-white shadow-sm sm:hidden"
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
            className="hidden rounded-full bg-brand-aqua px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-white hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua sm:inline-flex"
          >
            Reserve Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
