import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socialLinks = [
  { label: "Facebook", href: siteConfig.facebookUrl, Icon: FaFacebookF },
  { label: "Instagram", href: siteConfig.instagramUrl, Icon: FaInstagram },
  { label: "WhatsApp", href: siteConfig.whatsappHref, Icon: FaWhatsapp },
];

export function Footer() {
  return (
    <>
      <footer className="mt-auto border-t border-brand-navy/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-4 sm:flex-row sm:justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo/site-logo.webp"
              alt={siteConfig.name}
              width={160}
              height={48}
              className="h-28 w-auto sm:h-32"
            />
          </Link>

          <ul className="flex flex-wrap justify-center gap-5 text-base font-medium text-brand-navy/75">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-brand-aqua"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/20 text-brand-navy/60 transition hover:border-brand-aqua hover:bg-brand-aqua hover:text-white"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>

      <div className="border-t border-brand-navy/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-2 text-center text-sm text-brand-navy/60 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
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
