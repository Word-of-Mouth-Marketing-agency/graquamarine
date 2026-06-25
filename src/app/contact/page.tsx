import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Graquamarine for water activity reservations in Hurghada, Egypt.",
};

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="max-w-3xl text-slate-600">
        Placeholder contact details for reservations, questions, hotel pickup,
        and custom private boat requests.
      </p>
      <dl className="grid gap-4 rounded border border-slate-200 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-slate-500">Business</dt>
          <dd>{siteConfig.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Location</dt>
          <dd>{siteConfig.location}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Website</dt>
          <dd>{siteConfig.domain}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Reservations</dt>
          <dd>WhatsApp / phone details pending</dd>
        </div>
      </dl>
    </div>
  );
}
