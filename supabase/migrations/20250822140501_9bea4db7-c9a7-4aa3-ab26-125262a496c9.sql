-- Add sold_at timestamp to market_listings table
ALTER TABLE public.market_listings 
ADD COLUMN sold_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create function to cleanup sold listings older than 2 hours
CREATE OR REPLACE FUNCTION public.cleanup_sold_listings()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.market_listings 
  WHERE sold_at IS NOT NULL 
  AND sold_at < NOW() - INTERVAL '2 hours';
END;
$$;