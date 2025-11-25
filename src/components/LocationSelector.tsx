import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  currentLocation?: string;
}

export const LocationSelector = ({ 
  isOpen, 
  onClose, 
  onLocationSelect,
  currentLocation 
}: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation || "");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const kenyanLocations = [
    { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
    { name: "Mombasa", lat: -4.0435, lng: 39.6682 },
    { name: "Kisumu", lat: -0.0917, lng: 34.7680 },
    { name: "Nakuru", lat: -0.3031, lng: 36.0800 },
    { name: "Eldoret", lat: 0.5143, lng: 35.2698 },
    { name: "Thika", lat: -1.0332, lng: 37.0693 },
    { name: "Malindi", lat: -3.2167, lng: 40.1167 },
    { name: "Kitale", lat: 1.0157, lng: 35.0062 },
    { name: "Kakamega", lat: 0.2827, lng: 34.7519 },
    { name: "Machakos", lat: -1.5177, lng: 37.2634 },
    { name: "Meru", lat: 0.0470, lng: 37.6560 },
    { name: "Nyeri", lat: -0.4197, lng: 36.9473 },
    { name: "Kericho", lat: -0.3683, lng: 35.2839 },
    { name: "Embu", lat: -0.5392, lng: 37.4572 },
    { name: "Bungoma", lat: 0.5635, lng: 34.5606 }
  ];

  const handleLocationClick = (name: string, lat: number, lng: number) => {
    onLocationSelect(name, lat, lng);
    toast({
      title: "Location Updated",
      description: `Weather and market data will now show for ${name}`,
    });
    onClose();
  };

  const handleCurrentLocation = () => {
    setIsSearching(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode using OpenStreetMap Nominatim
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const locationName = data.address?.city || data.address?.town || data.address?.county || "Unknown Location";
            
            onLocationSelect(locationName, latitude, longitude);
            toast({
              title: "Location Detected",
              description: `Using your current location: ${locationName}`,
            });
            onClose();
          } catch (error) {
            toast({
              title: "Error",
              description: "Could not determine location name",
              variant: "destructive"
            });
          }
          setIsSearching(false);
        },
        (error) => {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access or select manually",
            variant: "destructive"
          });
          setIsSearching(false);
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setIsSearching(false);
    }
  };

  const filteredLocations = kenyanLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Select Your Location
          </DialogTitle>
          <DialogDescription>
            Choose your location to get accurate weather forecasts and market prices for your area
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Location Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCurrentLocation}
            disabled={isSearching}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {isSearching ? "Detecting location..." : "Use My Current Location"}
          </Button>

          {/* Location Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {filteredLocations.map((location) => (
              <Button
                key={location.name}
                variant="outline"
                className="justify-start hover:bg-primary/10 hover:border-primary"
                onClick={() => handleLocationClick(location.name, location.lat, location.lng)}
              >
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {location.name}
              </Button>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No locations found. Try a different search term.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
