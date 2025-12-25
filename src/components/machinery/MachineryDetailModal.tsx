import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tractor,
  MapPin,
  Star,
  Shield,
  Gauge,
  CalendarIcon,
  User,
  Phone,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Machinery {
  id: string;
  title: string;
  description: string | null;
  category: string;
  brand: string | null;
  model: string | null;
  year_manufactured?: number | null;
  horsepower: number | null;
  capacity?: string | null;
  rental_rate: number;
  rental_period: string;
  county: string;
  town: string | null;
  image_urls: string[];
  is_available: boolean;
  is_verified: boolean;
  rating_average: number;
  review_count: number;
  owner_id: string;
}

interface MachineryDetailModalProps {
  machinery: Machinery;
  isOpen: boolean;
  onClose: () => void;
}

const getRentalPeriodLabel = (period: string) => {
  const labels: Record<string, string> = {
    hourly: "per hour",
    daily: "per day",
    weekly: "per week",
    per_acre: "per acre",
  };
  return labels[period] || period;
};

const MachineryDetailModal = ({
  machinery,
  isOpen,
  onClose,
}: MachineryDetailModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Fetch owner profile
  const { data: ownerProfile } = useQuery({
    queryKey: ["owner-profile", machinery.owner_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", machinery.owner_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: ["machinery-reviews", machinery.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("machinery_reviews")
        .select(`
          *,
          reviewer:profiles!machinery_reviews_reviewer_id_fkey(full_name)
        `)
        .eq("machinery_id", machinery.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotalAmount = () => {
    const days = calculateTotalDays();
    if (machinery.rental_period === "daily") {
      return days * machinery.rental_rate;
    }
    // For other periods, just show per-use rate
    return machinery.rental_rate;
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to book machinery",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Select Dates",
        description: "Please select start and end dates",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const { error } = await supabase.from("machinery_bookings").insert({
        machinery_id: machinery.id,
        farmer_id: user.id,
        owner_id: machinery.owner_id,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        total_amount: calculateTotalAmount(),
        farmer_notes: notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking Request Sent!",
        description: "The equipment owner will review your request.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const images = machinery.image_urls?.length > 0 ? machinery.image_urls : ["/placeholder.svg"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image Gallery */}
        <div className="relative h-64 md:h-80 bg-muted">
          <img
            src={images[currentImageIndex]}
            alt={machinery.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {machinery.is_verified && (
              <Badge className="bg-success text-success-foreground">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">{machinery.title}</DialogTitle>
                {machinery.brand && (
                  <p className="text-muted-foreground">
                    {machinery.brand} {machinery.model && `• ${machinery.model}`}
                    {machinery.year_manufactured && ` • ${machinery.year_manufactured}`}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  KES {machinery.rental_rate.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getRentalPeriodLabel(machinery.rental_period)}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Quick Specs */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {machinery.town ? `${machinery.town}, ` : ""}{machinery.county}
                </Badge>
                {machinery.horsepower && (
                  <Badge variant="secondary" className="text-sm py-1.5 px-3">
                    <Gauge className="h-4 w-4 mr-1" />
                    {machinery.horsepower} HP
                  </Badge>
                )}
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  <Star className="h-4 w-4 mr-1 fill-warning text-warning" />
                  {machinery.rating_average > 0 ? machinery.rating_average.toFixed(1) : "New"}
                  {machinery.review_count > 0 && ` (${machinery.review_count} reviews)`}
                </Badge>
              </div>

              {/* Description */}
              {machinery.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{machinery.description}</p>
                </div>
              )}

              {/* Owner Info */}
              {ownerProfile && (
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h4 className="font-semibold mb-3">Equipment Owner</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{ownerProfile.full_name || "Equipment Owner"}</p>
                      <p className="text-sm text-muted-foreground">{ownerProfile.location || machinery.county}</p>
                    </div>
                    {ownerProfile.phone && user && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${ownerProfile.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews && reviews.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recent Reviews</h4>
                  <div className="space-y-3">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rating
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {review.reviewer?.full_name || "Farmer"}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking */}
            <div className="space-y-4">
              <div className="p-4 border rounded-xl bg-card">
                <h4 className="font-semibold mb-4">Book This Equipment</h4>

                {/* Date Selection */}
                <div className="space-y-3 mb-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {startDate ? format(startDate, "PPP") : "Start Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {endDate ? format(endDate, "PPP") : "End Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Notes */}
                <Textarea
                  placeholder="Add notes for the owner (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mb-4"
                  rows={3}
                />

                {/* Total */}
                {startDate && endDate && (
                  <div className="p-3 bg-muted/50 rounded-lg mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Duration</span>
                      <span>{calculateTotalDays()} days</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Estimated Total</span>
                      <span className="text-primary">
                        KES {calculateTotalAmount().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-primary"
                  onClick={handleBooking}
                  disabled={isBooking || !user || machinery.owner_id === user?.id}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : machinery.owner_id === user?.id ? (
                    "This is your listing"
                  ) : !user ? (
                    "Sign in to Book"
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Booking
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  The owner will confirm your booking request
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MachineryDetailModal;