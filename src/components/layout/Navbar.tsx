"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBars, FaFacebookF, FaInstagram, FaTimes, FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/lib/site";

const socialLinks = [
  { label: "Facebook", href: siteConfig.facebookUrl, Icon: FaFacebookF },
  { label: "Instagram", href: siteConfig.instagramUrl, Icon: FaInstagram },
  { label: "WhatsApp", href: siteConfig.whatsappHref, Icon: FaWhatsapp },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPublicPage = !pathname.startsWith("/admin");
  const headerClassName = isPublicPage
    ? "absolute inset-x-0 top-0 z-40 border-b border-white/15 bg-transparent text-white"
    : "relative z-40 border-b border-brand-navy/20 bg-brand-navy text-white";
  const navLinkClassName = isPublicPage
    ? "text-white/90 hover:text-white"
    : "text-white/85 hover:text-white";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className={headerClassName}>
      {/* Top row — hidden on mobile */}
      <div className="hidden border-b border-white/15 bg-white/5 backdrop-blur-sm md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-sm">
          <p className="font-medium">{siteConfig.location}</p>
          <div className="flex items-center gap-x-4 text-white/85">
            <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
              {siteConfig.displayPhone}
            </a>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/35 text-white/90 transition hover:bg-white hover:text-brand-navy"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="block shrink-0">
          <Image
            src="/images/logo/site-white-logo.png"
            alt={siteConfig.name}
            width={200}
            height={48}
            className="h-14 w-auto sm:h-16"
            priority
          />
        </Link>

        {/* Desktop nav + Reserve */}
        <div className="hidden items-center gap-4 sm:flex">
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
            className="rounded-full bg-brand-aqua px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-white hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua"
          >
            Reserve Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full sm:hidden"
        >
          <FaBars aria-hidden="true" className="h-6 w-6" />
        </button>
      </nav>

      {/* Off-canvas backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm sm:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Off-canvas menu */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 right-0 z-50 flex w-4/5 max-w-[320px] flex-col bg-white shadow-2xl transition-transform duration-300 sm:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-brand-navy/60">{siteConfig.location}</span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-navy/60 hover:text-brand-navy"
          >
            <FaTimes aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="space-y-1">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-brand-navy transition hover:bg-brand-navy/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Link
              href="/activities"
              onClick={closeMenu}
              className="block rounded-full bg-brand-aqua px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-navy"
            >
              Reserve Now
            </Link>
          </div>
        </nav>

        <div className="border-t border-brand-navy/10 px-5 py-4">
          <p className="mb-3 text-xs text-brand-navy/50">{siteConfig.location}</p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/20 text-brand-navy/60 transition hover:border-brand-aqua hover:bg-brand-aqua hover:text-white"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
