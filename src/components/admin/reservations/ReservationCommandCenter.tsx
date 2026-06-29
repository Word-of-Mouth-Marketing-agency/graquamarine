"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyReservationsState } from "@/components/admin/reservations/EmptyReservationsState";
import { ReservationActivityDemand } from "@/components/admin/reservations/ReservationActivityDemand";
import { ReservationCard } from "@/components/admin/reservations/ReservationCard";
import { ReservationDaySelector } from "@/components/admin/reservations/ReservationDaySelector";
import { ReservationDetailDrawer } from "@/components/admin/reservations/ReservationDetailDrawer";
import { ReservationFilters } from "@/components/admin/reservations/ReservationFilters";
import { ReservationStats } from "@/components/admin/reservations/ReservationStats";
import {
  defaultReservationFilters,
  type ReservationFilters as ReservationFiltersType,
  type ReservationRecord,
  type ReservationStatus,
} from "@/components/admin/reservations/types";
import type { AdminIdentity } from "@/types";
import {
  filterReservationsBySelectedDay,
  filterReservations,
  getTodayDateKey,
  hasActiveFilters,
  normalizeReservationList,
  normalizeReservationRecord,
  sortReservations,
} from "@/components/admin/reservations/utils";

type ReservationCommandCenterProps = {
  initialReservations: ReservationRecord[];
  admin: AdminIdentity;
};

export function ReservationCommandCenter({
  initialReservations,
  admin,
}: ReservationCommandCenterProps) {
  const router = useRouter();
  const [reservations, setReservations] =
    useState<ReservationRecord[]>(initialReservations);
  const [filters, setFilters] = useState<ReservationFiltersType>(
    defaultReservationFilters
  );
  const [selectedDate, setSelectedDate] = useState(getTodayDateKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const selectedDayReservations = useMemo(() => {
    return filterReservationsBySelectedDay(reservations, selectedDate);
  }, [reservations, selectedDate]);

  const pendingCount = selectedDayReservations.filter(
    (reservation) => reservation.status === "PENDING"
  ).length;

  const visibleReservations = useMemo(() => {
    return sortReservations(
      filterReservations(selectedDayReservations, filters),
      filters.sort
    );
  }, [filters, selectedDayReservations]);

  const selectedReservation =
    reservations.find((reservation) => reservation.id === selectedReservationId) ||
    null;

  const filtersActive = hasActiveFilters(filters);

  async function fetchReservations() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/reservations");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not load reservations.");
      }

      setReservations(normalizeReservationList(data));
    } catch {
      setError("Could not load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    status: ReservationStatus
  ): Promise<boolean> {
    setUpdatingStatusId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return false;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not update status.");
      }

      const updated = normalizeReservationRecord(data);
      if (!updated) throw new Error("Invalid reservation response.");

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? updated : reservation
        )
      );
      return true;
    } catch {
      setError("Could not update reservation status.");
      return false;
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function saveAdminNote(
    id: string,
    adminNote: string
  ): Promise<boolean> {
    setError("");

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return false;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not save note.");
      }

      const updated = normalizeReservationRecord(data);
      if (!updated) throw new Error("Invalid reservation response.");

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? updated : reservation
        )
      );
      return true;
    } catch {
      setError("Could not save admin note.");
      return false;
    }
  }

  function clearFilters() {
    setFilters(defaultReservationFilters);
  }

  function selectDate(nextDate: string) {
    if (!nextDate) return;
    setSelectedDate(nextDate);
    setSelectedReservationId(null);
  }

  return (
    <AdminShell
      title="Reservations"
      subtitle="Manage the selected day's booking requests and follow up quickly."
      admin={admin}
      countLabel={`${pendingCount} pending request${
        pendingCount !== 1 ? "s" : ""
      } for selected day`}
      actions={
        <>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-full border border-brand-navy/10 px-4 text-sm font-semibold text-brand-navy/65 transition hover:bg-brand-navy hover:text-white"
          >
            Back to website
          </Link>
          <button
            type="button"
            onClick={fetchReservations}
            disabled={loading}
            className="inline-flex h-10 items-center rounded-full bg-brand-aqua px-4 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <ReservationDaySelector
          selectedDate={selectedDate}
          reservationCount={selectedDayReservations.length}
          onChange={selectDate}
        />

        <ReservationStats reservations={selectedDayReservations} />

        <ReservationFilters
          filters={filters}
          totalCount={selectedDayReservations.length}
          visibleCount={visibleReservations.length}
          onChange={setFilters}
          onClear={clearFilters}
        />

        <ReservationActivityDemand reservations={selectedDayReservations} />

        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-brand-aqua/20 bg-white p-4 text-sm text-brand-navy/70 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={fetchReservations}
              className="w-fit rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-aqua"
            >
              Retry
            </button>
          </div>
        )}

        {loading && reservations.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-60 animate-pulse rounded-3xl border border-brand-aqua/10 bg-white shadow-sm"
              />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <EmptyReservationsState filtered={false} />
        ) : selectedDayReservations.length === 0 ? (
          <EmptyReservationsState
            filtered={false}
            title="No reservations for this day."
            description="Choose another day to review its bookings, or keep this day selected while new requests come in."
            hideAction
          />
        ) : visibleReservations.length === 0 ? (
          <EmptyReservationsState
            filtered={filtersActive}
            onClearFilters={clearFilters}
          />
        ) : (
          <section className="space-y-4">
            {visibleReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                isUpdating={updatingStatusId === reservation.id}
                onViewDetails={(nextReservation) =>
                  setSelectedReservationId(nextReservation.id)
                }
              />
            ))}
          </section>
        )}
      </div>

      <ReservationDetailDrawer
        reservation={selectedReservation}
        isUpdatingStatus={
          selectedReservation ? updatingStatusId === selectedReservation.id : false
        }
        onClose={() => setSelectedReservationId(null)}
        onStatusChange={updateStatus}
        onSaveNote={saveAdminNote}
      />
    </AdminShell>
  );
}
