import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Graquamarine, a Hurghada water activities business focused on safe Red Sea experiences.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">About {siteConfig.name}</h1>
      <p className="max-w-3xl text-slate-600">
        Placeholder business story for Graquamarine. This page will later
        describe the team, Red Sea experience, safety standards, and guest
        support before and during each activity.
      </p>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Safety and guest care</h2>
        <p className="max-w-3xl text-slate-600">
          Placeholder safety text for certified guides, activity briefings,
          equipment checks, pickup coordination, and clear communication with
          guests.
        </p>
      </section>
    </div>
  );
}
