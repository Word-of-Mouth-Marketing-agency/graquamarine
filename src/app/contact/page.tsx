import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-navy/20 px-3 py-2.5 text-brand-navy placeholder:text-brand-navy/40 transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 focus:outline-none";

const labelClass = "block text-sm font-medium text-brand-navy";

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
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            label="Send a Message"
            title="Contact form"
            subtitle="Fill in the form below and the Graquamarine team will get back to you shortly."
          />
          <form
            className="mt-8 grid gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-aqua/20 sm:p-8"
          >
            {/* TODO: Connect this form to the backend/email workflow. */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="contactPhone">
                  Phone / WhatsApp
                </label>
                <input
                  id="contactPhone"
                  name="phone"
                  type="tel"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="contactActivity">
                Activity interest
              </label>
              <input
                id="contactActivity"
                name="activity"
                type="text"
                className={inputClass}
                placeholder="e.g. Intro Diving, Private Boat"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="contactMessage">
                Message
              </label>
              <textarea
                id="contactMessage"
                name="message"
                rows={4}
                className={inputClass}
                required
              />
            </div>

            <button
              type="button"
              className="w-fit cursor-not-allowed rounded-full bg-brand-aqua/60 px-6 py-3 text-sm font-semibold text-white"
            >
              Backend integration pending
            </button>
          </form>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Our Location"
            title="Based in Hurghada, Egypt"
          />
          <div className="mt-10 overflow-hidden rounded-xl bg-brand-navy/5 ring-1 ring-brand-aqua/20">
            <div className="flex items-center justify-center bg-brand-navy/10 px-4 py-20 text-center">
              <div className="max-w-sm space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-aqua/10">
                  <FaMapMarkerAlt
                    aria-hidden="true"
                    className="h-6 w-6 text-brand-aqua"
                  />
                </div>
                <p className="text-lg font-semibold text-brand-navy">
                  Hurghada, Red Sea, Egypt
                </p>
                <p className="text-sm text-brand-navy/60">
                  Exact address and map embed will be added closer to launch.
                </p>
              </div>
            </div>
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
