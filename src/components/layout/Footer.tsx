import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#052f49] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">{siteConfig.name}</h2>
          <p className="max-w-sm text-sm leading-6 text-cyan-50/80">
            Premium, friendly Red Sea activities from Hurghada for diving,
            snorkeling, island days, and private boat experiences.
          </p>
          <p className="text-sm text-cyan-50/70">{siteConfig.displayDomain}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f4c76b]">
            Navigation
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50/80">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f4c76b]">
            Contact
          </h3>
          <div className="mt-3 space-y-2 text-sm text-cyan-50/80">
            <p>{siteConfig.location}</p>
            <a
              href={`tel:${siteConfig.phone}`}
              className="block hover:text-white"
            >
              {siteConfig.displayPhone}
            </a>
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white"
            >
              WhatsApp
            </a>
            <SocialIconLinks iconClassName="border-white/25 text-cyan-50/85" />
          </div>
        </div>
      </div>
    </footer>
  );
}
