-- Remove any duplicate emails keeping the most recent one
DELETE FROM email_leads_landing a
USING email_leads_landing b
WHERE a.id < b.id AND a.email = b.email;

-- Create a secure function to handle email lead upserts
CREATE OR REPLACE FUNCTION public.upsert_email_lead(
  p_email TEXT,
  p_nome TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'unknown',
  p_has_chat_interaction BOOLEAN DEFAULT false,
  p_has_diary_interaction BOOLEAN DEFAULT false,
  p_has_footer_interaction BOOLEAN DEFAULT false,
  p_has_starter_interaction BOOLEAN DEFAULT false,
  p_has_tino_chat_page_interaction BOOLEAN DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Try to update existing record
  UPDATE email_leads_landing
  SET 
    nome = COALESCE(p_nome, nome),
    has_chat_interaction = CASE WHEN p_has_chat_interaction THEN true ELSE has_chat_interaction END,
    has_diary_interaction = CASE WHEN p_has_diary_interaction THEN true ELSE has_diary_interaction END,
    has_footer_interaction = CASE WHEN p_has_footer_interaction THEN true ELSE has_footer_interaction END,
    has_starter_interaction = CASE WHEN p_has_starter_interaction THEN true ELSE has_starter_interaction END,
    has_tino_chat_page_interaction = CASE WHEN p_has_tino_chat_page_interaction THEN true ELSE has_tino_chat_page_interaction END,
    last_interaction_at = NOW()
  WHERE email = p_email
  RETURNING id INTO v_id;

  -- If no record was updated, insert a new one
  IF v_id IS NULL THEN
    INSERT INTO email_leads_landing (
      email,
      nome,
      source,
      has_chat_interaction,
      has_diary_interaction,
      has_footer_interaction,
      has_starter_interaction,
      has_tino_chat_page_interaction,
      last_interaction_at
    ) VALUES (
      p_email,
      p_nome,
      p_source,
      p_has_chat_interaction,
      p_has_diary_interaction,
      p_has_footer_interaction,
      p_has_starter_interaction,
      p_has_tino_chat_page_interaction,
      NOW()
    )
    RETURNING id INTO v_id;
  END IF;

  RETURN v_id;
END;
$$;