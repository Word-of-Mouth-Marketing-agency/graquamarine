import type { Metadata } from "next";
import { HeroSlidesManager } from "@/components/admin/hero/HeroSlidesManager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminHeroSlides } from "@/lib/hero-slides";
import type { HeroSlideData } from "@/types";

export const metadata: Metadata = {
  title: "Admin Hero Images",
};

export default async function AdminHeroPage() {
  const admin = await requireAdmin();

  let initialSlides: HeroSlideData[] = [];
  let initialError = "";

  try {
    initialSlides = await getAdminHeroSlides();
  } catch {
    initialError = "Could not load hero images. Check the database connection.";
  }

  return (
    <HeroSlidesManager
      admin={admin}
      initialSlides={initialSlides}
      initialError={initialError}
    />
  );
}
