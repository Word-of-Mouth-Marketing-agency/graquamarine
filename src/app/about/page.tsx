import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Graquamarine — water activities, diving, snorkeling, and private boat adventures in Hurghada, Egypt.",
};

const valueCards = [
  {
    title: "Safety-First Planning",
    text: "Every trip starts with a safety briefing, equipment check, and clear guest guidance so you can enjoy the Red Sea with confidence.",
    image: "/images/features/safety.webp",
  },
  {
    title: "Local, Friendly Support",
    text: "Our approachable team knows Hurghada and the Red Sea inside out, helping you feel welcome and well informed from the moment you arrive.",
    image: "/images/features/experience.webp",
  },
  {
    title: "Simple Reservations",
    text: "A clear booking process with transparent pricing and helpful communication makes planning your Red Sea adventure straightforward.",
    image: "/images/features/locations.webp",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="About Graquamarine"
      />

      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Our Story"
            title="Bringing the Red Sea closer to you"
          />
          <div className="mt-8 max-w-3xl space-y-4 leading-relaxed text-brand-navy/75">
            <p>
              Graquamarine helps guests enjoy the best of the Red Sea through
              diving, snorkeling, island trips, and private boat experiences in
              Hurghada. Whether you are taking your first breath underwater or
              planning a custom group day on the water, we make it easy to find
              and reserve the right activity.
            </p>
            <p>
              Every trip is built around clear planning, friendly local support,
              and a focus on safety so you can relax and enjoy the experience.
              From pickup coordination to activity briefings, we keep things
              straightforward so you spend more time on the water and less time
              worrying about logistics.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Why Choose Us"
            title="Safe, friendly, and unforgettable Red Sea experiences"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-brand-aqua/20 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    className="object-cover object-center transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-brand-navy/15" />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="text-xl font-bold text-brand-navy">
                    {card.title}
                  </h3>
                  <p className="leading-7 text-brand-navy/75">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 min-h-[350px]">
        <Image
          src="/images/backgrounds/first-dive-wide.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-brand-navy/70" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
              Ready for the Red Sea?
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold">
              Explore our activities or get in touch with the team.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/activities"
              className="rounded-full bg-brand-aqua px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-brand-navy"
            >
              View Activities
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-brand-navy"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
