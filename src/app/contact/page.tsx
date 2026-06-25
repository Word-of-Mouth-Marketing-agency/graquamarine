import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Graquamarine for water activity reservations in Hurghada, Egypt.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="max-w-3xl text-slate-600">
        Get in touch for reservations, questions, hotel pickup, and custom
        private boat requests.
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
          <dt className="text-sm font-medium text-slate-500">Phone</dt>
          <dd>
            <a href={`tel:${siteConfig.phone}`} className="text-[#008aa6] hover:underline">
              {siteConfig.displayPhone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">WhatsApp</dt>
          <dd>
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22c55e] hover:underline"
            >
              {siteConfig.displayPhone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Website</dt>
          <dd>{siteConfig.domain}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Social</dt>
          <dd className="flex gap-3">
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008aa6] hover:underline"
            >
              Facebook
            </a>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008aa6] hover:underline"
            >
              Instagram
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
