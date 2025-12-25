-- Add equipment owner flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_equipment_owner BOOLEAN DEFAULT false;

-- Create machinery categories enum
CREATE TYPE public.machinery_category AS ENUM (
  'tractor', 
  'harvester', 
  'plough', 
  'sprayer', 
  'pump', 
  'seeder', 
  'thresher', 
  'trailer',
  'other'
);

-- Create rental period enum
CREATE TYPE public.rental_period AS ENUM (
  'hourly', 
  'daily', 
  'weekly', 
  'per_acre'
);

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM (
  'pending',
  'approved', 
  'rejected',
  'in_progress',
  'completed',
  'cancelled'
);

-- Create machinery listings table
CREATE TABLE public.machinery_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category machinery_category NOT NULL DEFAULT 'tractor',
  brand TEXT,
  model TEXT,
  year_manufactured INTEGER,
  horsepower INTEGER,
  capacity TEXT,
  rental_rate NUMERIC NOT NULL,
  rental_period rental_period NOT NULL DEFAULT 'daily',
  county TEXT NOT NULL,
  town TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  image_urls TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  rating_average NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machinery bookings table
CREATE TABLE public.machinery_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machinery_id UUID NOT NULL REFERENCES public.machinery_listings(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount NUMERIC NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  farmer_notes TEXT,
  owner_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machinery reviews table
CREATE TABLE public.machinery_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machinery_id UUID NOT NULL REFERENCES public.machinery_listings(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.machinery_bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.machinery_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machinery_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machinery_reviews ENABLE ROW LEVEL SECURITY;

-- Machinery listings policies
CREATE POLICY "Anyone can view available machinery" 
ON public.machinery_listings 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Owners can view their own listings" 
ON public.machinery_listings 
FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can create listings" 
ON public.machinery_listings 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their listings" 
ON public.machinery_listings 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their listings" 
ON public.machinery_listings 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Machinery bookings policies
CREATE POLICY "Users can view their own bookings" 
ON public.machinery_bookings 
FOR SELECT 
USING (auth.uid() = farmer_id OR auth.uid() = owner_id);

CREATE POLICY "Farmers can create bookings" 
ON public.machinery_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Participants can update bookings" 
ON public.machinery_bookings 
FOR UPDATE 
USING (auth.uid() = farmer_id OR auth.uid() = owner_id);

-- Machinery reviews policies
CREATE POLICY "Anyone can view reviews" 
ON public.machinery_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Only farmers who completed booking can review" 
ON public.machinery_reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM public.machinery_bookings 
    WHERE id = booking_id 
    AND farmer_id = auth.uid() 
    AND status = 'completed'
  )
);

-- Create function to update machinery rating
CREATE OR REPLACE FUNCTION public.update_machinery_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.machinery_listings
  SET 
    rating_average = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.machinery_reviews 
      WHERE machinery_id = NEW.machinery_id
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.machinery_reviews 
      WHERE machinery_id = NEW.machinery_id
    )
  WHERE id = NEW.machinery_id;
  RETURN NEW;
END;
$$;

-- Create trigger for rating updates
CREATE TRIGGER update_machinery_rating_trigger
AFTER INSERT ON public.machinery_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_machinery_rating();

-- Create updated_at triggers
CREATE TRIGGER update_machinery_listings_updated_at
BEFORE UPDATE ON public.machinery_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machinery_bookings_updated_at
BEFORE UPDATE ON public.machinery_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();