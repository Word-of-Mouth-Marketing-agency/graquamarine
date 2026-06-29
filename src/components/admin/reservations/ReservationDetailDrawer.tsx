"use client";

import { useEffect, useState } from "react";
import {
  RESERVATION_STATUSES,
  type ReservationRecord,
  type ReservationStatus,
} from "@/components/admin/reservations/types";
import { StatusBadge } from "@/components/admin/reservations/StatusBadge";
import {
  buildReservationSummary,
  buildWhatsAppUrl,
  formatDate,
  formatMoney,
  formatPricingMode,
  getReservationTotal,
  parseActivities,
  statusMeta,
  summarizeActivities,
} from "@/components/admin/reservations/utils";

type NoteSaveState = "idle" | "saving" | "saved" | "error";

type ReservationDetailDrawerProps = {
  reservation: ReservationRecord | null;
  isUpdatingStatus: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: ReservationStatus) => Promise<boolean>;
  onSaveNote: (id: string, adminNote: string) => Promise<boolean>;
};

export function ReservationDetailDrawer({
  reservation,
  isUpdatingStatus,
  onClose,
  onStatusChange,
  onSaveNote,
}: ReservationDetailDrawerProps) {
  if (!reservation) return null;

  return (
    <ReservationDetailPanel
      key={reservation.id}
      reservation={reservation}
      isUpdatingStatus={isUpdatingStatus}
      onClose={onClose}
      onStatusChange={onStatusChange}
      onSaveNote={onSaveNote}
    />
  );
}

function ReservationDetailPanel({
  reservation,
  isUpdatingStatus,
  onClose,
  onStatusChange,
  onSaveNote,
}: Omit<ReservationDetailDrawerProps, "reservation"> & {
  reservation: ReservationRecord;
}) {
  const [noteDraft, setNoteDraft] = useState(reservation.adminNote || "");
  const [noteState, setNoteState] = useState<NoteSaveState>("idle");
  const [copyFeedback, setCopyFeedback] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, reservation]);

  const items = parseActivities(reservation.activities, reservation.guests);
  const whatsappUrl = buildWhatsAppUrl(reservation);
  const hasPhone = reservation.phone.trim().length > 0;
  const reservationTotal = getReservationTotal(reservation);
  const noteChanged = noteDraft !== (reservation.adminNote || "");

  async function copyText(text: string, feedback: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(feedback);
      window.setTimeout(() => setCopyFeedback(""), 1800);
    } catch {
      setCopyFeedback("Could not copy");
    }
  }

  async function saveNote() {
    setNoteState("saving");
    const ok = await onSaveNote(reservation.id, noteDraft);
    if (ok) setNoteDraft(noteDraft.trim());
    setNoteState(ok ? "saved" : "error");
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-navy/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Reservation details for ${reservation.fullName}`}
    >
      <button
        type="button"
        aria-label="Close reservation details"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />

      <aside className="absolute inset-x-0 bottom-0 max-h-[94vh] overflow-y-auto rounded-t-3xl bg-[#f7fbfd] shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-[560px] md:rounded-l-3xl md:rounded-tr-none">
        <div className="sticky top-0 z-10 border-b border-brand-aqua/15 bg-white/95 px-5 py-4 backdrop-blur md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge status={reservation.status} />
              <h2 className="mt-3 text-2xl font-bold text-brand-navy">
                {reservation.fullName}
              </h2>
              <p className="mt-1 text-sm font-semibold text-brand-aqua">
                {summarizeActivities(reservation)}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close reservation details"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-navy/10 text-lg font-bold text-brand-navy/55 transition hover:bg-brand-navy hover:text-white"
            >
              x
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 md:px-6">
          <section className="rounded-3xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
              Customer
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-brand-navy/45">Full name</p>
                <p className="text-lg font-bold text-brand-navy">
                  {reservation.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-navy/45">Phone</p>
                {hasPhone ? (
                  <a
                    href={`tel:${reservation.phone}`}
                    className="text-lg font-bold text-brand-aqua hover:underline"
                  >
                    {reservation.phone}
                  </a>
                ) : (
                  <p className="text-lg font-bold text-brand-navy/45">
                    Missing phone
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {hasPhone ? (
                  <a
                    href={`tel:${reservation.phone}`}
                    className="inline-flex h-10 items-center rounded-full bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-aqua"
                  >
                    Call
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-10 cursor-not-allowed items-center rounded-full bg-brand-navy/10 px-4 text-sm font-semibold text-brand-navy/35"
                  >
                    No phone
                  </button>
                )}
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center rounded-full bg-brand-aqua px-4 text-sm font-semibold text-white transition hover:bg-brand-navy"
                  >
                    WhatsApp
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-10 cursor-not-allowed items-center rounded-full border border-brand-navy/10 px-4 text-sm font-semibold text-brand-navy/35"
                  >
                    WhatsApp unavailable
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copyText(reservation.phone, "Phone copied")}
                  disabled={!hasPhone}
                  className="h-10 rounded-full border border-brand-navy/15 px-4 text-sm font-semibold text-brand-navy/65 transition hover:bg-brand-navy hover:text-white disabled:cursor-not-allowed disabled:text-brand-navy/35 disabled:hover:bg-transparent"
                >
                  Copy phone
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      buildReservationSummary(reservation),
                      "Summary copied"
                    )
                  }
                  className="h-10 rounded-full border border-brand-navy/15 px-4 text-sm font-semibold text-brand-navy/65 transition hover:bg-brand-navy hover:text-white"
                >
                  Copy summary
                </button>
              </div>
              {copyFeedback && (
                <p className="text-sm font-semibold text-brand-aqua">
                  {copyFeedback}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
                  Reservation
                </p>
                <p className="mt-3 text-3xl font-bold text-brand-navy">
                  {formatMoney(reservationTotal)}
                </p>
                <p className="text-sm text-brand-navy/50">Total value</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-60">
                <div className="rounded-2xl bg-[#f7fbfd] p-3">
                  <p className="text-brand-navy/45">Preferred</p>
                  <p className="font-bold text-brand-navy">
                    {formatDate(reservation.preferredDate)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7fbfd] p-3">
                  <p className="text-brand-navy/45">Guests</p>
                  <p className="font-bold text-brand-navy">
                    {reservation.guests}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7fbfd] p-3">
                  <p className="text-brand-navy/45">Created</p>
                  <p className="font-bold text-brand-navy">
                    {formatDate(reservation.createdAt)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7fbfd] p-3">
                  <p className="text-brand-navy/45">Updated</p>
                  <p className="font-bold text-brand-navy">
                    {formatDate(reservation.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-brand-navy/10 pt-5">
              <p className="text-sm font-bold text-brand-navy">Status</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {RESERVATION_STATUSES.map((status) => {
                  const active = reservation.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={isUpdatingStatus || active}
                      onClick={() => {
                        void onStatusChange(reservation.id, status);
                      }}
                      className={`h-11 rounded-full text-sm font-bold ring-1 transition disabled:cursor-not-allowed ${
                        active
                          ? statusMeta[status].badgeClass
                          : "bg-white text-brand-navy/60 ring-brand-navy/10 hover:bg-brand-navy/5"
                      } ${isUpdatingStatus ? "opacity-70" : ""}`}
                    >
                      {isUpdatingStatus && active
                        ? "Updating"
                        : statusMeta[status].label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
              Activities
            </p>
            <div className="mt-4 space-y-3">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={`${item.activityId || item.activityNameSnapshot}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-[#f7fbfd] p-4"
                  >
                    <div>
                      <p className="font-bold text-brand-navy">
                        {item.activityNameSnapshot}
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/55">
                        {formatMoney(item.unitPriceAtBooking)}{" "}
                        {formatPricingMode(item.pricingMode)} x{" "}
                        {item.guestCount}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-brand-aqua">
                        {formatMoney(item.lineTotal)}
                      </p>
                      <p className="text-xs text-brand-navy/45">Line total</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-[#f7fbfd] p-4">
                  <p className="font-bold text-brand-navy">
                    {reservation.activity}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
              Customer message
            </p>
            <p className="mt-3 rounded-2xl bg-[#f7fbfd] p-4 text-sm leading-7 text-brand-navy/75">
              {reservation.message || "No customer message."}
            </p>
          </section>

          <section className="rounded-3xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
              Admin note
            </p>
            <textarea
              value={noteDraft}
              onChange={(event) => {
                setNoteDraft(event.target.value);
                setNoteState("idle");
              }}
              rows={6}
              className="mt-3 w-full resize-none rounded-2xl border border-brand-navy/15 bg-white p-4 text-sm leading-6 text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
              placeholder="Add internal notes for the team..."
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveNote}
                disabled={noteState === "saving" || !noteChanged}
                className="h-11 rounded-full bg-brand-aqua px-5 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                {noteState === "saving" ? "Saving..." : "Save note"}
              </button>
              {noteChanged && (
                <button
                  type="button"
                  onClick={() => {
                    setNoteDraft(reservation.adminNote || "");
                    setNoteState("idle");
                  }}
                  className="h-11 rounded-full border border-brand-navy/15 px-5 text-sm font-semibold text-brand-navy/65 transition hover:bg-brand-navy hover:text-white"
                >
                  Revert
                </button>
              )}
              {noteState === "saved" && (
                <span className="text-sm font-semibold text-brand-aqua">
                  Saved
                </span>
              )}
              {noteState === "error" && (
                <span className="text-sm font-semibold text-brand-navy/60">
                  Could not save note
                </span>
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
