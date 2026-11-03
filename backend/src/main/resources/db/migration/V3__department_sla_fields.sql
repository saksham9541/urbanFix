-- ============================================================
-- UrbanFix AI Database Migration V3: Department SLA & Routing
-- ============================================================

ALTER TABLE departments ADD COLUMN IF NOT EXISTS default_sla_hours INT DEFAULT 24;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS is_sla_breached BOOLEAN DEFAULT FALSE;
