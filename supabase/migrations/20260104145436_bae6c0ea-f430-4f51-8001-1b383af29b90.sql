-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the cleanup function to run daily at midnight
SELECT cron.schedule(
  'cleanup-expired-listings-daily',
  '0 0 * * *', -- Run at midnight every day
  $$
  SELECT
    net.http_post(
      url := 'https://lfipxpoypivbiraavtkw.supabase.co/functions/v1/cleanup-sold-listings',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaXB4cG95cGl2YmlyYWF2dGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjcwMDYsImV4cCI6MjA3MTQ0MzAwNn0.1V-bKiqLMengCWlNqu0j7UzJJiHq9TodJ-yEL9iRJTY"}'::jsonb,
      body := '{"source": "cron"}'::jsonb
    ) AS request_id;
  $$
);