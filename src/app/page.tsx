import Link from "next/link";
import { activities } from "@/lib/activities";
import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          {siteConfig.location}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold">
          {siteConfig.name} water activities website foundation
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Placeholder intro for diving, snorkeling, island trips, and private
          boat reservations in Hurghada.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded bg-slate-900 px-4 py-2 text-white"
            href="/activities"
          >
            View activities
          </Link>
          <Link
            className="rounded border border-slate-300 px-4 py-2"
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Starter activity catalog</h2>
        <p className="mt-2 text-slate-600">
          {activities.length} services are structured in shared data for reuse
          across pages and the future reservation flow.
        </p>
      </section>
    </div>
  );
}
