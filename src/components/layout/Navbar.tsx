import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-cyan-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="bg-[#063b5c] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">{siteConfig.location}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/85">
            {siteConfig.phonePlaceholders.map((phone) => (
              <span key={phone}>{phone}</span>
            ))}
            <div className="flex items-center gap-2">
              {siteConfig.socialPlaceholders.map((social) => (
                <span
                  key={social}
                  className="rounded-full border border-white/30 px-2 py-0.5 text-xs"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-[#063b5c]">
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
          <ul className="flex flex-wrap gap-4 text-sm font-medium text-slate-700">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[#008aa6]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/activities"
            className="hidden rounded-full bg-[#008aa6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#063b5c] sm:inline-flex"
          >
            Reserve Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
