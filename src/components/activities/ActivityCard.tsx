import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/types";

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-brand-aqua/20 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={activity.image}
          alt={activity.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-brand-navy">{activity.name}</h3>
          <p className="shrink-0 font-semibold text-brand-aqua">
            ${activity.basePriceUsd}
          </p>
        </div>
        <p className="mt-3 text-sm leading-6 text-brand-navy/75">
          {activity.summary}
        </p>
        <div className="mt-auto pt-5">
          <Link
            href="#reservation"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-aqua text-sm font-semibold text-white transition hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-aqua focus-visible:ring-offset-2"
          >
            Reserve
          </Link>
        </div>
      </div>
    </article>
  );
}
