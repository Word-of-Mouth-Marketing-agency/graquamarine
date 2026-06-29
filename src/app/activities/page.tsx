import type { Metadata } from "next";
import Link from "next/link";
import { ActivityImage } from "@/components/activities/ActivityImage";
import { ReservationForm } from "@/components/activities/ReservationForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublicActivities } from "@/lib/services";
import { siteConfig } from "@/lib/site";
import { FaWhatsapp } from "react-icons/fa";
import type { PricingMode } from "@/types";

function pricingLabel(mode: PricingMode): string {
  return mode === "flat" ? "flat boat price" : "per guest";
}

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Browse Graquamarine diving, snorkeling, island trips, courses, and private boat activities in Hurghada.",
};

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const activities = await getPublicActivities();

  return (
    <div className="bg-white">
      <PageHero title="Activities" />

      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          {activities.map((activity, i) => (
            <article
              key={activity.slug}
              className={`grid gap-6 md:grid-cols-5 md:gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`relative h-56 overflow-hidden rounded-xl sm:h-72 md:col-span-2 ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <ActivityImage
                  src={activity.image}
                  alt={activity.name}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="flex flex-col justify-center md:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-aqua">
                  {activity.category}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-brand-navy">
                  {activity.name}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl font-bold text-brand-aqua">
                    ${activity.basePriceUsd}
                  </span>
                  <span className="text-sm text-brand-navy/50">
                    ({pricingLabel(activity.pricingMode)})
                  </span>
                </div>
                <p className="mt-3 leading-relaxed text-brand-navy/75">
                  {activity.detailedDescription}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {activity.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-brand-navy/70"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-aqua"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="reservation" className="bg-white px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            label="Make a Reservation"
            title="Send a booking request"
            subtitle="Select the activities you are interested in and enter your details below. The Graquamarine team will get back to you to confirm."
          />
          <ReservationForm activities={activities} />
        </div>
      </section>

      <section className="border-t border-brand-aqua/15 bg-brand-navy/5 px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
            <FaWhatsapp aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-navy">Need a quick answer?</p>
            <p className="text-sm text-brand-navy/70">
              Send a WhatsApp message for fast confirmation and availability checks.
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
