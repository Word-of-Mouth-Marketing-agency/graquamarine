import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/lib/site";

const socialLinks = [
  {
    label: "Facebook",
    href: siteConfig.facebookUrl,
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: siteConfig.instagramUrl,
    Icon: FaInstagram,
  },
  {
    label: "WhatsApp",
    href: siteConfig.whatsappHref,
    Icon: FaWhatsapp,
  },
];

type SocialIconLinksProps = {
  className?: string;
  iconClassName?: string;
};

export function SocialIconLinks({
  className = "",
  iconClassName = "",
}: SocialIconLinksProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-white hover:text-brand-navy ${iconClassName}`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
