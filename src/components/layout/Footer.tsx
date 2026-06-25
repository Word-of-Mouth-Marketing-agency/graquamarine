import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

export function Footer() {
  return (
    <>
      <footer className="mt-auto bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo/site-logo.webp"
              alt={siteConfig.name}
              width={200}
              height={64}
              className="h-36 w-auto"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-navy/75">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-aqua">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
              Contact
            </h3>
            <div className="mt-3 space-y-2 text-sm text-brand-navy/75">
              <p>{siteConfig.location}</p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="block hover:text-brand-aqua"
              >
                {siteConfig.displayPhone}
              </a>
              <SocialIconLinks iconClassName="border-brand-navy/20 text-brand-navy/60" />
            </div>
          </div>
        </div>
      </footer>

      <div className="border-t border-brand-navy/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-sm text-brand-navy/60 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>
            Powered by{" "}
            <a
              href="https://wordofmoutheg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-aqua hover:underline"
            >
              WORD OF MOUTH
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
