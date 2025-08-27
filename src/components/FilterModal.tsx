import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, MapPin, Calendar, DollarSign, Package, X } from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  location: string;
  maxDistance: number;
  freshness: string;
  minQuantity: number;
  categories: string[];
}

interface FilterModalProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCategories: Array<{ name: string; value: string }>;
  availableLocations: string[];
}

const FRESHNESS_OPTIONS = [
  { value: "all", label: "All Products" },
  { value: "fresh", label: "Fresh (7+ days)" },
  { value: "soon", label: "Use Soon (3-7 days)" },
  { value: "urgent", label: "Urgent (1-3 days)" }
];

export const FilterModal = ({ 
  filters, 
  onFiltersChange, 
  availableCategories, 
  availableLocations 
}: FilterModalProps) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 10000],
      location: "",
      maxDistance: 50,
      freshness: "all",
      minQuantity: 0,
      categories: []
    };
    setTempFilters(resetFilters);
  };

  const toggleCategory = (categoryValue: string) => {
    setTempFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryValue)
        ? prev.categories.filter(c => c !== categoryValue)
        : [...prev.categories, categoryValue]
    }));
  };

  const hasActiveFilters = () => {
    return (
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 10000 ||
      filters.location !== "" ||
      filters.maxDistance < 50 ||
      filters.freshness !== "all" ||
      filters.minQuantity > 0 ||
      filters.categories.length > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters() && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-accent text-accent-foreground">
              !
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Filter className="w-5 h-5" />
            Filter Products
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-foreground">
              <DollarSign className="w-4 h-4" />
              Price Range (KSh)
            </Label>
            <div className="px-4">
              <Slider
                value={tempFilters.priceRange}
                onValueChange={(value) => 
                  setTempFilters(prev => ({ ...prev, priceRange: value as [number, number] }))
                }
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>KSh {tempFilters.priceRange[0].toLocaleString()}</span>
                <span>KSh {tempFilters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Select
              value={tempFilters.location}
              onValueChange={(value) => 
                setTempFilters(prev => ({ ...prev, location: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {availableLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <Label className="text-foreground">
              Maximum Distance: {tempFilters.maxDistance} km
            </Label>
            <Slider
              value={[tempFilters.maxDistance]}
              onValueChange={(value) => 
                setTempFilters(prev => ({ ...prev, maxDistance: value[0] }))
              }
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          {/* Freshness */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4" />
              Freshness
            </Label>
            <Select
              value={tempFilters.freshness}
              onValueChange={(value) => 
                setTempFilters(prev => ({ ...prev, freshness: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FRESHNESS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Quantity */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-foreground">
              <Package className="w-4 h-4" />
              Minimum Quantity
            </Label>
            <Input
              type="number"
              value={tempFilters.minQuantity}
              onChange={(e) => 
                setTempFilters(prev => ({ ...prev, minQuantity: parseInt(e.target.value) || 0 }))
              }
              placeholder="Minimum quantity required"
            />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-foreground">Categories</Label>
            <div className="flex flex-wrap gap-2">
              {availableCategories
                .filter(cat => cat.value !== "all")
                .map((category) => (
                  <Badge
                    key={category.value}
                    variant={tempFilters.categories.includes(category.value) ? "default" : "outline"}
                    className={`cursor-pointer transition-smooth ${
                      tempFilters.categories.includes(category.value)
                        ? "bg-gradient-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleCategory(category.value)}
                  >
                    {category.name}
                    {tempFilters.categories.includes(category.value) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex-1"
          >
            Reset All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-gradient-primary hover:shadow-glow-primary transition-smooth"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};