-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroSlide_sortOrder_idx" ON "HeroSlide"("sortOrder");

-- CreateIndex
CREATE INDEX "HeroSlide_isActive_idx" ON "HeroSlide"("isActive");

-- SeedHeroSlides
INSERT INTO "HeroSlide" ("id", "imageUrl", "alt", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('hero_slide_1', '/images/hero/slide1.jpg', 'Graquamarine Red Sea diving hero image', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hero_slide_2', '/images/hero/slide2.jpg', 'Graquamarine boat and water activity hero image', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hero_slide_3', '/images/hero/slide3.jpg', 'Graquamarine snorkeling and diving hero image', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hero_slide_4', '/images/hero/slide4.jpg', 'Graquamarine Hurghada sea adventure hero image', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
