import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

export function Footer() {
  return (
    <>
      <footer className="mt-auto bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Image
              src="/images/logo/site-logo.webp"
              alt={siteConfig.name}
              width={200}
              height={64}
              className="h-32 w-auto"
            />
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Premium, friendly Red Sea activities from Hurghada for diving,
              snorkeling, island days, and private boat experiences.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#008aa6]">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#063b5c]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#008aa6]">
              Contact
            </h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>{siteConfig.location}</p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="block hover:text-[#063b5c]"
              >
                {siteConfig.displayPhone}
              </a>
              <SocialIconLinks iconClassName="border-slate-300 text-slate-500" />
            </div>
          </div>
        </div>
      </footer>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-sm text-slate-500 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>
            Powered by{" "}
            <a
              href="https://wordofmoutheg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#008aa6] hover:underline"
            >
              WORD OF MOUTH
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
