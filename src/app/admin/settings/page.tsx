import type { Metadata } from "next";
import { AdminSettingsManager } from "@/components/admin/settings/AdminSettingsManager";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Settings",
};

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();

  return <AdminSettingsManager initialAdmin={admin} />;
}
