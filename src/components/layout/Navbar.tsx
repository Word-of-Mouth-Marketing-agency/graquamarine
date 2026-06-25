import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Navbar() {
  return (
    <header className="border-b border-slate-200">
      <nav className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-semibold">
          {siteConfig.name}
        </Link>
        <ul className="flex flex-wrap gap-4 text-sm text-slate-700">
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-slate-950">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
