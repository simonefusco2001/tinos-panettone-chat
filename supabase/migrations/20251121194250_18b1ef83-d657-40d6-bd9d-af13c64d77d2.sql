-- Rimuovere la colonna all_sources (non più necessaria)
ALTER TABLE email_leads_landing DROP COLUMN IF EXISTS all_sources;

-- Aggiungere colonne booleane per ogni form
ALTER TABLE email_leads_landing 
ADD COLUMN IF NOT EXISTS has_chat_interaction BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_diary_interaction BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_footer_interaction BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_starter_interaction BOOLEAN DEFAULT FALSE;

-- Popolare le colonne basandosi sul campo 'source' esistente
UPDATE email_leads_landing SET has_chat_interaction = TRUE WHERE source = 'chat';
UPDATE email_leads_landing SET has_diary_interaction = TRUE WHERE source = 'diary';
UPDATE email_leads_landing SET has_footer_interaction = TRUE WHERE source = 'footer-newsletter';
UPDATE email_leads_landing SET has_starter_interaction = TRUE WHERE source = 'starter-early-access';

-- Creare indici per query veloci (opzionale ma consigliato)
CREATE INDEX IF NOT EXISTS idx_chat_interaction ON email_leads_landing(has_chat_interaction);
CREATE INDEX IF NOT EXISTS idx_diary_interaction ON email_leads_landing(has_diary_interaction);
CREATE INDEX IF NOT EXISTS idx_footer_interaction ON email_leads_landing(has_footer_interaction);
CREATE INDEX IF NOT EXISTS idx_starter_interaction ON email_leads_landing(has_starter_interaction);

-- Aggiornare commenti
COMMENT ON COLUMN email_leads_landing.has_chat_interaction IS 'TRUE se l''utente ha interagito con il form chat';
COMMENT ON COLUMN email_leads_landing.has_diary_interaction IS 'TRUE se l''utente ha interagito con il form diary';
COMMENT ON COLUMN email_leads_landing.has_footer_interaction IS 'TRUE se l''utente ha interagito con il form footer newsletter';
COMMENT ON COLUMN email_leads_landing.has_starter_interaction IS 'TRUE se l''utente ha interagito con il form starter early access';