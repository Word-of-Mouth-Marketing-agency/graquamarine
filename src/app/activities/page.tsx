import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ReservationForm } from "@/components/activities/ReservationForm";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { activities } from "@/lib/activities";
import { siteConfig } from "@/lib/site";
import { FaWhatsapp } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Browse Graquamarine diving, snorkeling, island trips, courses, and private boat activities in Hurghada.",
};

export default function ActivitiesPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="Activities"
      />

      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="All Activities"
            title="Find your next Red Sea adventure"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.slug} activity={activity} />
            ))}
          </div>
        </div>
      </section>

      <section id="reservation" className="bg-white px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            label="Make a Reservation"
            title="Send a booking request"
            subtitle="Fill in the details below and the Graquamarine team will get back to you to confirm your activity."
          />
          <ReservationForm />
        </div>
      </section>

      <section className="border-t border-brand-aqua/15 bg-brand-navy/5 px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
            <FaWhatsapp aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-navy">
              Need a quick answer?
            </p>
            <p className="text-sm text-brand-navy/70">
              Send a WhatsApp message for fast confirmation and availability
              checks.
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
