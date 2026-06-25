"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type ReservationRecord = {
  id: string;
  activity: string;
  preferredDate: string;
  fullName: string;
  phone: string;
  guests: number;
  hotelLocation: string | null;
  message: string | null;
  adminNote: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

function statusColor(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const didFetchRef = useRef(false);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reservations");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReservations(data);
    } catch {
      setError("Could not load reservations.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchReservations();
    }
  }, [fetchReservations]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch {
      setError("Failed to update reservation.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateAdminNote(id: string, adminNote: string) {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote }),
      });
      if (!res.ok) throw new Error("Update failed");
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, adminNote } : r))
      );
    } catch {
      // Silently fail for note updates
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="bg-white px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-brand-navy/60">
              {reservations.length} reservation
              {reservations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchReservations}
              className="rounded-full border border-brand-aqua/30 px-4 py-2 text-sm font-medium text-brand-aqua transition hover:bg-brand-aqua hover:text-white"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-brand-navy/20 px-4 py-2 text-sm font-medium text-brand-navy/60 transition hover:bg-brand-navy/10"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-brand-navy/60">
            Loading reservations...
          </p>
        ) : reservations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-navy/20 py-16 text-center">
            <p className="text-brand-navy/60">No reservations yet.</p>
            <Link href="/" className="mt-2 inline-block text-sm text-brand-aqua hover:underline">
              Back to website
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-xl border border-brand-navy/10 md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-brand-navy/5 text-left text-brand-navy/60">
                  <tr>
                    <th className="px-4 py-3 font-medium">Activity</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Guests</th>
                    <th className="px-4 py-3 font-medium">Hotel</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy/5">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-brand-navy/[0.02]">
                      <td className="px-4 py-3 font-medium text-brand-navy">
                        {r.activity}
                      </td>
                      <td className="px-4 py-3 text-brand-navy/80">
                        {new Date(r.preferredDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-brand-navy/80">
                        {r.fullName}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${r.phone}`}
                          className="text-brand-aqua hover:underline"
                        >
                          {r.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-brand-navy/80">
                        {r.guests}
                      </td>
                      <td className="px-4 py-3 text-brand-navy/60">
                        {r.hotelLocation || "—"}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-brand-navy/60">
                        {r.message || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            updateStatus(r.id, e.target.value)
                          }
                          disabled={updatingId === r.id}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(r.status)} cursor-pointer border-0 focus:ring-2 focus:ring-brand-aqua/30 focus:outline-none`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          defaultValue={r.adminNote || ""}
                          placeholder="Add note..."
                          onBlur={(e) => {
                            if (e.target.value !== (r.adminNote || "")) {
                              updateAdminNote(r.id, e.target.value);
                            }
                          }}
                          className="w-28 rounded border border-brand-navy/10 px-2 py-1 text-xs text-brand-navy focus:border-brand-aqua focus:ring-1 focus:ring-brand-aqua/20 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-brand-navy/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-brand-navy">
                        {r.activity}
                      </h3>
                      <p className="text-sm text-brand-navy/60">
                        {r.fullName}
                      </p>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      disabled={updatingId === r.id}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(r.status)} cursor-pointer border-0 focus:ring-2 focus:ring-brand-aqua/30 focus:outline-none`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-brand-navy/50">Date:</span>{" "}
                      <span className="text-brand-navy/80">
                        {new Date(r.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-brand-navy/50">Guests:</span>{" "}
                      <span className="text-brand-navy/80">{r.guests}</span>
                    </div>
                    <div>
                      <span className="text-brand-navy/50">Phone:</span>{" "}
                      <a
                        href={`tel:${r.phone}`}
                        className="text-brand-aqua"
                      >
                        {r.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-brand-navy/50">Hotel:</span>{" "}
                      <span className="text-brand-navy/60">
                        {r.hotelLocation || "—"}
                      </span>
                    </div>
                    {r.message && (
                      <div className="col-span-2">
                        <span className="text-brand-navy/50">Message:</span>{" "}
                        <span className="text-brand-navy/60">
                          {r.message}
                        </span>
                      </div>
                    )}
                    <div className="col-span-2 mt-1">
                      <input
                        type="text"
                        defaultValue={r.adminNote || ""}
                        placeholder="Admin note..."
                        onBlur={(e) => {
                          if (e.target.value !== (r.adminNote || "")) {
                            updateAdminNote(r.id, e.target.value);
                          }
                        }}
                        className="w-full rounded border border-brand-navy/10 px-2 py-1 text-sm text-brand-navy focus:border-brand-aqua focus:ring-1 focus:ring-brand-aqua/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-brand-navy/40">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
