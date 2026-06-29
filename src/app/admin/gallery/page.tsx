import type { Metadata } from "next";
import { GalleryImagesManager } from "@/components/admin/gallery/GalleryImagesManager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminGalleryImages } from "@/lib/gallery-images";
import type { GalleryImageData } from "@/types";

export const metadata: Metadata = {
  title: "Admin Gallery",
};

export default async function AdminGalleryPage() {
  const admin = await requireAdmin();

  let initialImages: GalleryImageData[] = [];
  let initialError = "";

  try {
    initialImages = await getAdminGalleryImages();
  } catch {
    initialError = "Could not load gallery images. Check the database connection.";
  }

  return (
    <GalleryImagesManager
      admin={admin}
      initialImages={initialImages}
      initialError={initialError}
    />
  );
}
