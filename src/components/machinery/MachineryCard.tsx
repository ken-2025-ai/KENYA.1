import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tractor,
  MapPin,
  Star,
  Clock,
  Shield,
  ChevronRight,
  Gauge,
} from "lucide-react";

interface Machinery {
  id: string;
  title: string;
  description: string | null;
  category: string;
  brand: string | null;
  model: string | null;
  horsepower: number | null;
  rental_rate: number;
  rental_period: string;
  county: string;
  town: string | null;
  image_urls: string[];
  is_available: boolean;
  is_verified: boolean;
  rating_average: number;
  review_count: number;
}

interface MachineryCardProps {
  machinery: Machinery;
  onClick: () => void;
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    tractor: "Tractor",
    harvester: "Harvester",
    plough: "Plough",
    sprayer: "Sprayer",
    pump: "Pump",
    seeder: "Seeder",
    thresher: "Thresher",
    trailer: "Trailer",
    other: "Other",
  };
  return labels[category] || category;
};

const getRentalPeriodLabel = (period: string) => {
  const labels: Record<string, string> = {
    hourly: "/hr",
    daily: "/day",
    weekly: "/week",
    per_acre: "/acre",
  };
  return labels[period] || period;
};

const MachineryCard = ({ machinery, onClick }: MachineryCardProps) => {
  const imageUrl = machinery.image_urls?.[0] || "/placeholder.svg";

  return (
    <Card
      className="group cursor-pointer overflow-hidden border hover:border-primary/50 hover:shadow-medium transition-all duration-300"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={machinery.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary/90 text-primary-foreground">
            {getCategoryLabel(machinery.category)}
          </Badge>
          {machinery.is_verified && (
            <Badge className="bg-success/90 text-success-foreground">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
            <span className="text-lg font-bold text-primary">
              KES {machinery.rental_rate.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              {getRentalPeriodLabel(machinery.rental_period)}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title & Brand */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {machinery.title}
        </h3>
        {machinery.brand && (
          <p className="text-sm text-muted-foreground mb-3">
            {machinery.brand} {machinery.model && `• ${machinery.model}`}
          </p>
        )}

        {/* Specs Row */}
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          {machinery.horsepower && (
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{machinery.horsepower} HP</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {machinery.town ? `${machinery.town}, ` : ""}
              {machinery.county}
            </span>
          </div>
        </div>

        {/* Rating & Action */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">
              {machinery.rating_average > 0
                ? machinery.rating_average.toFixed(1)
                : "New"}
            </span>
            {machinery.review_count > 0 && (
              <span className="text-muted-foreground text-sm">
                ({machinery.review_count})
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineryCard;