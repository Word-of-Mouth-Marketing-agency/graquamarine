import type { Metadata } from "next";
import { ServicesManager } from "@/components/admin/services/ServicesManager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminServices } from "@/lib/services";
import type { ServiceCardData } from "@/types";

export const metadata: Metadata = {
  title: "Admin Services",
};

export default async function AdminServicesPage() {
  const admin = await requireAdmin();

  let initialServices: ServiceCardData[] = [];
  let initialError = "";

  try {
    initialServices = await getAdminServices();
  } catch {
    initialError = "Could not load services. Check the database connection.";
  }

  return (
    <ServicesManager
      admin={admin}
      initialServices={initialServices}
      initialError={initialError}
    />
  );
}
