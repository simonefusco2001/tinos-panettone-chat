-- Add source column to track email lead origin
ALTER TABLE email_leads_landing 
ADD COLUMN source text NOT NULL DEFAULT 'unknown';

COMMENT ON COLUMN email_leads_landing.source IS 'Origine della raccolta email: chat, diary, footer-newsletter, starter-early-access';
