import type { Metadata } from "next";
import { ReservationCommandCenter } from "@/components/admin/reservations/ReservationCommandCenter";
import type {
  ReservationRecord,
  ReservationStatus,
} from "@/components/admin/reservations/types";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Reservations",
};

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const initialReservations: ReservationRecord[] = reservations.map(
    (reservation) => ({
      id: reservation.id,
      activity: reservation.activity,
      activities: reservation.activities,
      preferredDate: reservation.preferredDate.toISOString(),
      fullName: reservation.fullName,
      phone: reservation.phone,
      guests: reservation.guests,
      message: reservation.message,
      totalPrice: reservation.totalPrice,
      adminNote: reservation.adminNote,
      status: reservation.status as ReservationStatus,
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
    })
  );

  return (
    <ReservationCommandCenter
      admin={admin}
      initialReservations={initialReservations}
    />
  );
}
