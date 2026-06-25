import Image from "next/image";
import Link from "next/link";
import { activities } from "@/lib/activities";
import { HeroSlideshow } from "@/components/hero/HeroSlideshow";
import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";

const featureCards = [
  {
    title: "100% Safety",
    text: "Safety-focused trips with briefings, equipment checks, and clear guidance before activities.",
    image: "/images/features/safety.webp",
  },
  {
    title: "Unforgettable Experience",
    text: "Friendly Red Sea moments built around diving, snorkeling, island days, and relaxed guest care.",
    image: "/images/features/experience.webp",
  },
  {
    title: "Exciting Location",
    text: "Hurghada gives guests easy access to clear water, reef views, islands, and boat adventures.",
    image: "/images/features/locations.webp",
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        <HeroSlideshow />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-brand-navy/70 to-transparent" />
        <div className="mx-auto flex min-h-[620px] max-w-6xl items-center px-4 pb-20 pt-44 sm:min-h-[90vh] sm:pt-48">
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Water Activities in Hurghada
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              Diving, snorkeling, island trips, and private boat experiences on
              the Red Sea.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-brand-aqua px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-white"
                href="/activities"
              >
                Reserve Now
              </Link>
              <Link
                className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-navy"
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
              Why guests choose us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy">
              Safe, friendly, and adventurous Red Sea experiences
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-brand-aqua/20 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-brand-navy/15" />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="text-xl font-bold text-brand-navy">
                    {feature.title}
                  </h3>
                  <p className="leading-7 text-brand-navy/75">{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-20">
        <Image
          src="/images/backgrounds/activites-bg.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-brand-navy/70" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
                Activities
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Reserve your next Red Sea activity
              </h2>
            </div>
            <Link
              href="/activities"
              className="w-fit rounded-full bg-brand-aqua px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy"
            >
              View all activities
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <article
                key={activity.slug}
                className="overflow-hidden rounded-lg border border-brand-aqua/20 bg-white shadow-sm"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-brand-navy">
                      {activity.name}
                    </h3>
                    <p className="shrink-0 font-semibold text-brand-aqua">
                      ${activity.basePriceUsd}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-brand-navy/75">
                    {activity.summary}
                  </p>
                  <Link
                    href="/activities"
                    className="mt-4 inline-flex w-fit rounded-full bg-brand-aqua px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy hover:text-white"
                  >
                    Reserve
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
              Gallery preview
            </p>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy">Red Sea Gallery</h2>
          </div>
          <GalleryCarousel />
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
              Reserve your Hurghada water activity experience.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/activities"
              className="rounded-full bg-brand-aqua px-6 py-3 font-semibold text-white transition hover:bg-white"
            >
              Reserve Now
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
