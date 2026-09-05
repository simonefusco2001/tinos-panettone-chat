-- Add new column to track tino chat page interactions
ALTER TABLE public.email_leads_landing 
ADD COLUMN has_tino_chat_page_interaction boolean DEFAULT false;