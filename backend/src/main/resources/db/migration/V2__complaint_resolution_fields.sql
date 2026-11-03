-- ============================================================
-- UrbanFix AI Database Migration V2: Complaint Resolution Fields
-- ============================================================

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolution_notes TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolution_image_url TEXT;

