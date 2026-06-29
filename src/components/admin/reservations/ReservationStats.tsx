import type { ReservationRecord } from "@/components/admin/reservations/types";
import {
  formatMoney,
  getReservationTotal,
} from "@/components/admin/reservations/utils";

type ReservationStatsProps = {
  reservations: ReservationRecord[];
};

export function ReservationStats({ reservations }: ReservationStatsProps) {
  const total = reservations.length;
  const pending = reservations.filter((item) => item.status === "PENDING").length;
  const confirmed = reservations.filter(
    (item) => item.status === "CONFIRMED"
  ).length;
  const cancelled = reservations.filter(
    (item) => item.status === "CANCELLED"
  ).length;
  const totalValue = reservations
    .filter((item) => item.status === "CONFIRMED")
    .reduce((sum, item) => sum + getReservationTotal(item), 0);

  const cards = [
    {
      label: "Total reservations",
      value: String(total),
      helper: "Selected day requests",
      className: "border-brand-aqua/20 bg-white",
      valueClass: "text-brand-navy",
    },
    {
      label: "Pending",
      value: String(pending),
      helper: "Needs follow up",
      className: "border-brand-aqua/20 bg-white",
      valueClass: "text-brand-navy",
    },
    {
      label: "Confirmed",
      value: String(confirmed),
      helper: "Ready to serve",
      className: "border-brand-aqua/20 bg-white",
      valueClass: "text-brand-navy",
    },
    {
      label: "Cancelled",
      value: String(cancelled),
      helper: "Closed requests",
      className: "border-brand-aqua/20 bg-white",
      valueClass: "text-brand-navy",
    },
    {
      label: "Total value",
      value: formatMoney(totalValue),
      helper: "Confirmed reservations only",
      className: "border-brand-aqua/25 bg-brand-navy text-white",
      valueClass: "text-white",
    },
  ];

  return (
    <section className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`rounded-2xl border p-5 shadow-sm ${card.className}`}
        >
          <p
            className={`text-xs font-bold uppercase tracking-wide ${
              card.className.includes("bg-brand-navy")
                ? "text-white/65"
                : "text-brand-navy/55"
            }`}
          >
            {card.label}
          </p>
          <p className={`mt-3 text-3xl font-bold ${card.valueClass}`}>
            {card.value}
          </p>
          <p
            className={`mt-1 text-sm ${
              card.className.includes("bg-brand-navy")
                ? "text-white/70"
                : "text-brand-navy/55"
            }`}
          >
            {card.helper}
          </p>
        </article>
      ))}
    </section>
  );
}
