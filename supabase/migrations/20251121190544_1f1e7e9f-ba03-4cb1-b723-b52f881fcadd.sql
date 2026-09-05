-- Step 1: Add columns for complete tracking
ALTER TABLE email_leads_landing 
ADD COLUMN IF NOT EXISTS all_sources jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_interaction_at timestamp with time zone DEFAULT now();

-- Step 2: Populate all_sources with source value for all records
UPDATE email_leads_landing 
SET all_sources = jsonb_build_array(source)
WHERE all_sources = '[]'::jsonb;

-- Step 3: For duplicate emails, merge all sources into the oldest record
WITH duplicate_groups AS (
  SELECT 
    email,
    jsonb_agg(DISTINCT source) as all_sources_merged,
    MAX(created_at) as last_interaction
  FROM email_leads_landing
  GROUP BY email
  HAVING COUNT(*) > 1
),
oldest_records AS (
  SELECT DISTINCT ON (e.email) 
    e.id,
    e.email
  FROM email_leads_landing e
  INNER JOIN duplicate_groups dg ON e.email = dg.email
  ORDER BY e.email, e.created_at ASC
)
UPDATE email_leads_landing e
SET 
  all_sources = dg.all_sources_merged,
  last_interaction_at = dg.last_interaction
FROM duplicate_groups dg
INNER JOIN oldest_records o ON dg.email = o.email
WHERE e.id = o.id;

-- Step 4: Delete duplicate records (keep only the oldest one per email)
DELETE FROM email_leads_landing
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id
  FROM email_leads_landing
  ORDER BY email, created_at ASC
);

-- Step 5: Add UNIQUE constraint on email
ALTER TABLE email_leads_landing 
ADD CONSTRAINT email_leads_landing_email_unique UNIQUE (email);

-- Step 6: Add comments for documentation
COMMENT ON COLUMN email_leads_landing.source IS 'Prima fonte di raccolta email (immutabile)';
COMMENT ON COLUMN email_leads_landing.all_sources IS 'Array JSON con tutte le fonti di interazione dell''utente';
COMMENT ON COLUMN email_leads_landing.last_interaction_at IS 'Timestamp dell''ultima interazione dell''utente';