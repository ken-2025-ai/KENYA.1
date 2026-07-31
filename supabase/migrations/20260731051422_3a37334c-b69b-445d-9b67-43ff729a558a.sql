CREATE TYPE public.report_target AS ENUM ('market_listing','machinery_listing','user');
CREATE TYPE public.report_reason AS ENUM ('scam','fake_listing','misleading_price','spam','inappropriate','no_response','counterfeit','other');

CREATE TABLE public.listing_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid,
  target_type public.report_target NOT NULL,
  target_id uuid NOT NULL,
  reported_user_id uuid,
  target_title text,
  reason public.report_reason NOT NULL,
  details text,
  contact_email text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.listing_reports TO anon;
GRANT SELECT, INSERT ON public.listing_reports TO authenticated;
GRANT ALL ON public.listing_reports TO service_role;

ALTER TABLE public.listing_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a report"
ON public.listing_reports FOR INSERT
WITH CHECK (reporter_id IS NULL OR reporter_id = auth.uid());

CREATE POLICY "Reporters can view their own reports"
ON public.listing_reports FOR SELECT
USING (auth.uid() IS NOT NULL AND reporter_id = auth.uid());

CREATE INDEX idx_listing_reports_target ON public.listing_reports (target_type, target_id);