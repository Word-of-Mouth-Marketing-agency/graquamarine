import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site";
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Graquamarine for water activity reservations, questions, and private bookings in Hurghada, Egypt.",
};

const contactCards = [
  {
    icon: FaPhoneAlt,
    label: "Phone",
    value: siteConfig.displayPhone,
    href: `tel:${siteConfig.phone}`,
    color: "text-brand-aqua",
    bg: "bg-brand-aqua/10",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "Chat with us",
    href: siteConfig.whatsappHref,
    color: "text-[#22c55e]",
    bg: "bg-[#22c55e]/10",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Location",
    value: siteConfig.location,
    href: null,
    color: "text-brand-aqua",
    bg: "bg-brand-aqua/10",
  },
  {
    icon: FaFacebookF,
    label: "Facebook",
    value: "Follow us",
    href: siteConfig.facebookUrl,
    color: "text-brand-aqua",
    bg: "bg-brand-aqua/10",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    value: "Follow us",
    href: siteConfig.instagramUrl,
    color: "text-brand-aqua",
    bg: "bg-brand-aqua/10",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="Contact"
        subtitle="Ready to plan your Red Sea activity? Get in touch with Graquamarine in Hurghada."
      />

      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Get in Touch"
            title="We are here to help"
            subtitle="Choose the best way to reach us and we will respond as soon as possible."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactCards.map((card) => {
              const Icon = card.icon;
              const content = (
                <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-aqua/20 transition hover:shadow-md">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.bg}`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`h-5 w-5 ${card.color}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-navy/60">
                      {card.label}
                    </p>
                    <p className="mt-0.5 truncate font-semibold text-brand-navy">
                      {card.value}
                    </p>
                  </div>
                </div>
              );

              return card.href ? (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={card.label}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Send a Message"
            title="Get in touch"
            subtitle="Fill in the form and the Graquamarine team will get back to you shortly."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden rounded-xl sm:min-h-[400px]">
              <Image
                src="/images/gallery/gallery1.jpg"
                alt="Red Sea contact"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Our Location"
            title={`Based in ${siteConfig.location}`}
          />
          <div className="mt-10 overflow-hidden rounded-xl ring-1 ring-brand-aqua/20">
            <iframe
              title="Graquamarine location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47738.68979216996!2d33.79121109085505!3d27.212890362150237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145287b2cd3dbbb3%3A0x2db807f98bd3c360!2sHurghada%2C%20Red%20Sea%20Governorate!5e0!3m2!1sen!2seg!4v1782387974062!5m2!1sen!2seg"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-72 w-full border-0 sm:h-96"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-brand-navy/60">
              {siteConfig.location}
            </p>
            <a
              href="https://maps.app.goo.gl/dKgjq3LaabS61okWA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-full bg-brand-aqua px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-brand-aqua/15 bg-brand-navy/5 px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
            <FaWhatsapp aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-navy">
              Prefer a quick chat?
            </p>
            <p className="text-sm text-brand-navy/70">
              Reach us on WhatsApp for fast responses and availability checks.
            </p>
          </div>
          <Link
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#22c55e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16a34a]"
          >
            Chat on WhatsApp
          </Link>
        </div>
      </section>
    </div>
  );
}
