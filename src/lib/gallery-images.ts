import defaultGalleryImages from "@/data/default-gallery-images.json";
import { prisma } from "@/lib/prisma";
import type { GalleryImageData } from "@/types";

type DatabaseGalleryImage = Omit<GalleryImageData, "alt"> & {
  alt: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export const fallbackGalleryImages: GalleryImageData[] = defaultGalleryImages.map(
  (image, index) => ({
    id: `fallback-gallery-${index + 1}`,
    imageUrl: image.imageUrl,
    alt: image.alt,
    sortOrder: index,
    isActive: true,
  })
);

function toGalleryImageData(image: DatabaseGalleryImage): GalleryImageData {
  return {
    id: image.id,
    imageUrl: image.imageUrl,
    alt: image.alt || "",
    sortOrder: image.sortOrder,
    isActive: image.isActive,
  };
}

export async function ensureDefaultGalleryImages(): Promise<void> {
  const existingCount = await prisma.galleryImage.count();
  if (existingCount > 0) return;

  for (const [index, image] of defaultGalleryImages.entries()) {
    await prisma.galleryImage.upsert({
      where: { id: `gallery_image_${index + 1}` },
      update: {},
      create: {
        id: `gallery_image_${index + 1}`,
        imageUrl: image.imageUrl,
        alt: image.alt,
        sortOrder: index,
        isActive: true,
      },
    });
  }
}

export async function getPublicGalleryImages(): Promise<GalleryImageData[]> {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (images.length === 0) {
      return fallbackGalleryImages;
    }

    return images.map(toGalleryImageData);
  } catch {
    return fallbackGalleryImages;
  }
}

export async function getAdminGalleryImages(): Promise<GalleryImageData[]> {
  await ensureDefaultGalleryImages();

  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return images.map(toGalleryImageData);
}
