-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_sortOrder_idx" ON "Service"("sortOrder");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- SeedServices
INSERT INTO "Service" ("id", "slug", "name", "description", "price", "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('service_intro_diving', 'intro-diving', 'Intro Diving', 'A beginner-friendly diving experience for first-time guests.', 50, '/images/activities/intro-diving.webp', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_professional_diving', 'professional-diving', 'Professional Diving', 'Guided dives for certified or experienced divers.', 60, '/images/activities/professional-diving.webp', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_snorkeling', 'snorkeling', 'Snorkeling', 'A relaxed Red Sea snorkeling trip for families and groups.', 40, '/images/activities/snorkeling.webp', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_paradise_island', 'paradise-island', 'Paradise Island', 'A day trip to Paradise Island with sea activities.', 30, '/images/activities/paradise-island.jpg', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_open_water_diver_course', 'open-water-diver-course', 'Open Water Diver Course', 'Entry-level diver certification course.', 350, '/images/activities/openwater-divercourse.webp', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_advanced_open_water_diver_course', 'advanced-open-water-diver-course', 'Advanced Open Water Diver Course', 'Advanced certification course for certified divers.', 300, '/images/activities/advanced-openwater-divercourse.webp', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_private_boat', 'private-boat', 'Private Boat', 'Private boat reservation for custom group trips.', 500, '/images/activities/private-boat.webp', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service_orange_bay', 'orange-bay', 'Orange Bay', 'A Red Sea island day trip to Orange Bay.', 30, '/images/activities/orange-bay.jpg', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
