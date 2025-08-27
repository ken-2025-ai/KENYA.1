import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Phone, MessageCircle, MapPin, User, Wheat, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    user_id: string;
    location: string;
    category: string;
    price_per_unit: number;
    unit: string;
    harvest_date: string;
  } | null;
}

interface FarmerProfile {
  full_name: string;
  phone: string;
  location: string;
  farm_size: string;
  farming_type: string;
  bio: string;
  avatar_url: string;
}

export const ContactFarmerModal = ({ isOpen, onClose, listing }: ContactFarmerModalProps) => {
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && listing) {
      fetchFarmerProfile();
    }
  }, [isOpen, listing]);

  const fetchFarmerProfile = async () => {
    if (!listing) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', listing.user_id)
        .single();

      if (error) {
        console.error('Error fetching farmer profile:', error);
        return;
      }

      setFarmerProfile(data);
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneContact = () => {
    if (farmerProfile?.phone) {
      window.open(`tel:${farmerProfile.phone}`, '_self');
    } else {
      toast({
        title: "Phone Not Available",
        description: "This farmer hasn't provided a phone number yet.",
        variant: "destructive"
      });
    }
  };

  const handleWhatsAppContact = () => {
    if (farmerProfile?.phone) {
      const message = `Hi! I'm interested in your ${listing?.title} listed on the marketplace. Could you please provide more details?`;
      const whatsappUrl = `https://wa.me/${farmerProfile.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast({
        title: "WhatsApp Not Available",
        description: "This farmer hasn't provided a phone number for WhatsApp.",
        variant: "destructive"
      });
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Contact Farmer</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">{listing.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.location}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {listing.category}
                </Badge>
              </div>
              <div className="mt-2 text-lg font-bold text-primary">
                KSh {listing.price_per_unit.toLocaleString()} per {listing.unit}
              </div>
            </div>

            {/* Farmer Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={farmerProfile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {farmerProfile?.full_name || "Farmer"}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{farmerProfile?.location || listing.location}</span>
                  </div>
                </div>
              </div>

              {farmerProfile?.bio && (
                <p className="text-sm text-muted-foreground">{farmerProfile.bio}</p>
              )}

              {/* Farm Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {farmerProfile?.farm_size && (
                  <div className="flex items-center gap-2">
                    <Wheat className="w-4 h-4 text-muted-foreground" />
                    <span>{farmerProfile.farm_size}</span>
                  </div>
                )}
                {farmerProfile?.farming_type && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{farmerProfile.farming_type}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact Options */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Get in Touch</h4>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handlePhoneContact}
                  className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow-primary transition-smooth"
                  disabled={!farmerProfile?.phone}
                >
                  <Phone className="w-4 h-4" />
                  Call Farmer
                </Button>
                <Button
                  onClick={handleWhatsAppContact}
                  variant="outline"
                  className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  disabled={!farmerProfile?.phone}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
              {!farmerProfile?.phone && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Contact information not available for this farmer yet.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};