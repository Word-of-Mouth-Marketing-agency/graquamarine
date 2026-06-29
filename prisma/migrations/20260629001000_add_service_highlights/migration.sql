-- AlterTable
ALTER TABLE "Service" ADD COLUMN "highlights" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- SeedHighlights
UPDATE "Service"
SET "highlights" = ARRAY['No experience required', 'Full instructor guidance', 'Shallow, clear-water dive site', 'All equipment included']::TEXT[]
WHERE "slug" = 'intro-diving' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['For certified divers', 'Guided Red Sea dive sites', 'Reef, wall, and drift dives', 'Equipment available on request']::TEXT[]
WHERE "slug" = 'professional-diving' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['Family-friendly and beginner-safe', 'Shallow reef access', 'All snorkeling gear included', 'Snacks and soft drinks provided']::TEXT[]
WHERE "slug" = 'snorkeling' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['Boat transfer included', 'Beach time and swimming', 'Snorkeling stops along the way', 'Lunch and soft drinks provided']::TEXT[]
WHERE "slug" = 'paradise-island' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['Classroom, pool, and open-water training', 'Full equipment during the course', 'Small group sizes', 'Internationally recognised curriculum']::TEXT[]
WHERE "slug" = 'open-water-diver-course' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['Builds on existing certification', 'Deep and navigation dives', 'Specialty skill modules', 'Small group instruction']::TEXT[]
WHERE "slug" = 'advanced-open-water-diver-course' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['Full boat exclusively for your group', 'Custom itinerary - you choose the stops', 'Captain and crew included', 'Flat price, not charged per guest']::TEXT[]
WHERE "slug" = 'private-boat' AND cardinality("highlights") = 0;

UPDATE "Service"
SET "highlights" = ARRAY['Boat transfer included', 'Beach loungers and shaded areas', 'Shallow, calm water for swimming', 'Soft drinks included']::TEXT[]
WHERE "slug" = 'orange-bay' AND cardinality("highlights") = 0;
