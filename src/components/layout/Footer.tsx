import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {siteConfig.name} - {siteConfig.location}
        </p>
        <Link href="/contact" className="hover:text-slate-950">
          Contact and reservations
        </Link>
      </div>
    </footer>
  );
}
