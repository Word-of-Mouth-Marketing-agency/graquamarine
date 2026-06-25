import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "#",
    Icon: FaInstagram,
  },
  {
    label: "WhatsApp",
    href: "#",
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
          // TODO: Replace placeholder href with the real Graquamarine social link.
          href={href}
          aria-label={label}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-white hover:text-[#063b5c] ${iconClassName}`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
