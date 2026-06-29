import Link from "next/link";

type EmptyReservationsStateProps = {
  filtered: boolean;
  title?: string;
  description?: string;
  hideAction?: boolean;
  onClearFilters?: () => void;
};

export function EmptyReservationsState({
  filtered,
  title,
  description,
  hideAction = false,
  onClearFilters,
}: EmptyReservationsStateProps) {
  const heading =
    title ||
    (filtered ? "No reservations match these filters." : "No reservations yet.");
  const body =
    description ||
    (filtered
      ? "Try a different search, status, or sort option to find the request you need."
      : "New customer booking requests will appear here as soon as guests submit the reservation form.");

  return (
    <section className="rounded-3xl border border-dashed border-brand-aqua/25 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-aqua/10 text-lg font-bold text-brand-aqua">
        GR
      </div>
      <h2 className="mt-5 text-2xl font-bold text-brand-navy">{heading}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-navy/60">
        {body}
      </p>
      {!hideAction && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {filtered && onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full bg-brand-aqua px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-brand-aqua px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy"
            >
              Back to website
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
