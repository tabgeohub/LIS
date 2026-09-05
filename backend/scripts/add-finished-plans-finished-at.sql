-- Run manually against the LIS Postgres database.
-- Adds per-visit finish timestamp from Desktop Opslaan (uploaded with finished plans).

ALTER TABLE lis.finished_plans
  ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ NULL;
