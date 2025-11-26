import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
  currentLocation?: string;
}

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  display_name: string;
}

export const LocationSelector = ({ 
  isOpen, 
  onClose, 
  onLocationSelect,
  currentLocation 
}: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState(currentLocation || "");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
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

  // Geocode search query using Nominatim API
  useEffect(() => {
    const searchLocation = async () => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery + ", Kenya"
          )}&limit=8&countrycodes=ke&addressdetails=1`
        );
        const data = await response.json();
        
        const locationSuggestions: LocationSuggestion[] = data.map((item: any) => ({
          name: item.name || item.display_name.split(",")[0],
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          display_name: item.display_name,
        }));
        
        setSuggestions(locationSuggestions);
      } catch (error) {
        console.error("Geocoding error:", error);
        toast({
          title: "Search Error",
          description: "Failed to search location. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchLocation, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
              description: `Receiving realtime updates for ${locationName}`,
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

  const displayLocations = searchQuery.length >= 3 && suggestions.length > 0
    ? suggestions
    : filteredLocations;

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
              placeholder="Type any location in Kenya (min 3 characters)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {isSearching && searchQuery.length >= 3 && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
            )}
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
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {displayLocations.map((location, index) => (
              <Button
                key={`${location.name}-${index}`}
                variant="outline"
                className="w-full justify-start hover:bg-primary/10 hover:border-primary text-left h-auto py-3"
                onClick={() => handleLocationClick(location.name, location.lat, location.lng)}
              >
                <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{location.name}</span>
                  {'display_name' in location && location.display_name && (
                    <span className="text-xs text-muted-foreground">
                      {String(location.display_name)}
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {displayLocations.length === 0 && searchQuery.length < 3 && (
            <div className="text-center py-8 text-muted-foreground">
              Type at least 3 characters to search for any location in Kenya
            </div>
          )}
          
          {displayLocations.length === 0 && searchQuery.length >= 3 && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              No locations found for "{searchQuery}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
