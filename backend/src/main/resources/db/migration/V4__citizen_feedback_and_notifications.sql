-- Phase 5: Citizen Feedback & Real-Time Notifications Schema

ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS citizen_rating INTEGER,
ADD COLUMN IF NOT EXISTS citizen_feedback TEXT,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    complaint_id BIGINT REFERENCES complaints(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'STATUS_CHANGE',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

