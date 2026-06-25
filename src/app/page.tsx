import Image from "next/image";
import Link from "next/link";
import { activities } from "@/lib/activities";
import { HeroSlideshow } from "@/components/hero/HeroSlideshow";

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

const gallerySlides = [
  "Dive day",
  "Snorkeling stop",
  "Island trip",
  "Private boat",
  "Orange Bay",
];

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative isolate overflow-hidden bg-[#063b5c] text-white">
        <HeroSlideshow />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#063b5c]/70 to-transparent" />
        <div className="mx-auto flex min-h-[620px] max-w-6xl items-center px-4 pb-20 pt-44 sm:min-h-[90vh] sm:pt-48">
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Water Activities in Hurghada
            </h1>
            <p className="max-w-xl text-base leading-7 text-cyan-50/90 sm:text-lg">
              Diving, snorkeling, island trips, and private boat experiences on
              the Red Sea.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[#f4c76b] px-5 py-2.5 text-sm font-semibold text-[#063b5c] shadow-lg shadow-slate-900/20 transition hover:bg-white"
                href="/activities"
              >
                Reserve Now
              </Link>
              <Link
                className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#063b5c]"
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbfb] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#008aa6]">
              Why guests choose us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#063b5c]">
              Safe, friendly, and adventurous Red Sea experiences
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-cyan-100 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[#063b5c]/15" />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="text-xl font-bold text-[#063b5c]">
                    {feature.title}
                  </h3>
                  <p className="leading-7 text-slate-600">{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-20">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/activites-bg.webp"
            alt=""
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/85" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#008aa6]">
                Activities
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#063b5c]">
                Reserve your next Red Sea activity
              </h2>
            </div>
            <Link
              href="/activities"
              className="w-fit rounded-full bg-[#008aa6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#063b5c]"
            >
              View all activities
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <article
                key={activity.slug}
                className="overflow-hidden rounded-lg border border-cyan-100 bg-white shadow-sm"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#063b5c]">
                    {activity.category}
                  </div>
                </div>
                <div className="flex min-h-64 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-[#063b5c]">
                      {activity.name}
                    </h3>
                    <p className="shrink-0 font-semibold text-[#008aa6]">
                      ${activity.basePriceUsd}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {activity.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activity.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs text-[#063b5c]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/activities"
                    className="mt-auto inline-flex w-fit rounded-full bg-[#f4c76b] px-4 py-2 text-sm font-semibold text-[#063b5c] transition hover:bg-[#008aa6] hover:text-white"
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
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#008aa6]">
                Gallery preview
              </p>
              <h2 className="text-3xl font-bold text-[#063b5c]">Red Sea Gallery</h2>
              <p className="max-w-2xl leading-8 text-slate-600">
                Placeholder gallery cards for future diving, snorkeling,
                island, and boat photos or short clips.
              </p>
            </div>
          </div>

          {/* TODO: Replace gallery placeholders with real Graquamarine photos/videos. */}
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 [scrollbar-color:#008aa6_transparent]">
            {gallerySlides.map((slide, index) => (
              <article
                key={slide}
                className="min-w-[260px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:min-w-[340px]"
              >
                <div className="h-64 bg-gradient-to-br from-[#77d7d3] via-[#008aa6] to-[#052f49] p-5">
                  <div className="flex h-full items-end rounded-lg border border-white/30 bg-white/10 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                        Slide {index + 1}
                      </p>
                      <h3 className="text-xl font-bold text-white">{slide}</h3>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <Image
          src="/images/backgrounds/first-dive-wide.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#063b5c]/70" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#f4c76b]">
              Ready for the Red Sea?
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold">
              Reserve your Hurghada water activity experience.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/activities"
              className="rounded-full bg-[#f4c76b] px-6 py-3 font-semibold text-[#063b5c] transition hover:bg-white"
            >
              Reserve Now
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#063b5c]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
