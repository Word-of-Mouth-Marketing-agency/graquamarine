-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GalleryImage_sortOrder_idx" ON "GalleryImage"("sortOrder");

-- CreateIndex
CREATE INDEX "GalleryImage_isActive_idx" ON "GalleryImage"("isActive");

-- SeedGalleryImages
INSERT INTO "GalleryImage" ("id", "imageUrl", "alt", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('gallery_image_1', '/images/gallery/gallery1.jpg', 'Graquamarine Red Sea gallery image 1', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gallery_image_2', '/images/gallery/gallery2.jpg', 'Graquamarine Red Sea gallery image 2', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gallery_image_3', '/images/gallery/gallery3.jpg', 'Graquamarine Red Sea gallery image 3', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gallery_image_4', '/images/gallery/gallery4.jpg', 'Graquamarine Red Sea gallery image 4', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gallery_image_5', '/images/gallery/gallery5.jpg', 'Graquamarine Red Sea gallery image 5', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
