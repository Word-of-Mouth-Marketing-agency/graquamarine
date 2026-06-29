import defaultHeroSlides from "@/data/default-hero-slides.json";
import { prisma } from "@/lib/prisma";
import type { HeroSlideData } from "@/types";

type DatabaseHeroSlide = Omit<HeroSlideData, "alt"> & {
  alt: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export const fallbackHeroSlides: HeroSlideData[] = defaultHeroSlides.map(
  (slide, index) => ({
    id: `fallback-hero-${index + 1}`,
    imageUrl: slide.imageUrl,
    alt: slide.alt,
    sortOrder: index,
    isActive: true,
  })
);

function toHeroSlideData(slide: DatabaseHeroSlide): HeroSlideData {
  return {
    id: slide.id,
    imageUrl: slide.imageUrl,
    alt: slide.alt || "",
    sortOrder: slide.sortOrder,
    isActive: slide.isActive,
  };
}

export async function ensureDefaultHeroSlides(): Promise<void> {
  for (const [index, slide] of defaultHeroSlides.entries()) {
    await prisma.heroSlide.upsert({
      where: { id: `hero_slide_${index + 1}` },
      update: {},
      create: {
        id: `hero_slide_${index + 1}`,
        imageUrl: slide.imageUrl,
        alt: slide.alt,
        sortOrder: index,
        isActive: true,
      },
    });
  }
}

export async function getPublicHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (slides.length === 0) {
      return fallbackHeroSlides;
    }

    return slides.map(toHeroSlideData);
  } catch {
    return fallbackHeroSlides;
  }
}

export async function getAdminHeroSlides(): Promise<HeroSlideData[]> {
  await ensureDefaultHeroSlides();

  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return slides.map(toHeroSlideData);
}
