import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tractor, ArrowRight, Star, MapPin } from "lucide-react";

const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Machakos", "Meru", "Nyeri",
  "Kakamega", "Kisii", "Thika", "Malindi", "Kitale", "Garissa", "Naivasha", "Embu",
  "Kericho", "Bungoma", "Migori", "Narok", "Uasin Gishu", "Trans Nzoia", "Kiambu", "Muranga"
];

export const EquipmentPreview = () => {
  const [selectedCounty, setSelectedCounty] = useState<string>("");

  const { data: equipment, isLoading } = useQuery({
    queryKey: ["equipment-preview", selectedCounty],
    queryFn: async () => {
      let query = supabase
        .from("machinery_listings")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (selectedCounty) {
        query = query.ilike("county", `%${selectedCounty}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (rate: number, period: string) => {
    return `KES ${rate.toLocaleString()}/${period}`;
  };

  const getDefaultImage = (category: string) => {
    const images: Record<string, string> = {
      tractor: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
      harvester: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      plough: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      sprayer: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
      pump: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      seeder: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      thresher: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      trailer: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
    };
    return images[category] || images.tractor;
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-muted/50 via-background to-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Tractor className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Equipment Leasing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mb-4">
            Farm Equipment Available
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access quality farm machinery from verified owners. Rent tractors, harvesters, and more.
          </p>
        </div>

        {/* Location Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-2">
            <MapPin className="w-5 h-5 text-primary ml-2" />
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-[200px] border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {KENYA_COUNTIES.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCounty && selectedCounty !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCounty("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : equipment && equipment.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {equipment.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image_urls?.[0] || getDefaultImage(item.category)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getDefaultImage(item.category);
                    }}
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground capitalize">
                    {item.category}
                  </Badge>
                  {item.is_verified && (
                    <Badge className="absolute top-3 right-3 bg-success/90 text-white">
                      Verified
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground truncate mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.county}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      {formatPrice(item.rental_rate, item.rental_period)}
                    </span>
                    {item.rating_average && item.rating_average > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{item.rating_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl mb-8">
            <Tractor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No equipment available at the moment</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/machinery">
            <Button variant="hero" size="lg" className="group shadow-glow-primary hover:scale-105 transition-all duration-300">
              <span>View All Equipment</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
