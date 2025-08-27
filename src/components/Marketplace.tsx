import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, Package, Search, Star, ChevronRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ContactFarmerModal } from "./ContactFarmerModal";
import { FilterModal } from "./FilterModal";

interface MarketListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  quantity_available: number;
  unit: string;
  location: string;
  harvest_date: string;
  expiry_date: string;
  image_url: string;
  created_at: string;
  user_id: string;
  sold_at: string | null;
}

const categories = [
  { name: "All", value: "all", color: "bg-gradient-primary" },
  { name: "Vegetables", value: "vegetables", color: "bg-green-500" },
  { name: "Fruits", value: "fruits", color: "bg-orange-500" },
  { name: "Grains", value: "grains", color: "bg-yellow-500" },
  { name: "Legumes", value: "legumes", color: "bg-red-500" },
  { name: "Dairy", value: "dairy", color: "bg-blue-500" },
  { name: "Livestock", value: "livestock", color: "bg-purple-500" }
];

interface FilterState {
  priceRange: [number, number];
  location: string;
  maxDistance: number;
  freshness: string;
  minQuantity: number;
  categories: string[];
}

export const Marketplace = () => {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    location: "all",
    maxDistance: 50,
    freshness: "all",
    minQuantity: 0,
    categories: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, selectedCategory, searchQuery, filters]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch marketplace listings",
          variant: "destructive"
        });
        return;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Category filter (existing)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(listing => 
        listing.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Advanced category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(listing =>
        filters.categories.includes(listing.category.toLowerCase())
      );
    }

    // Search filter (existing)
    if (searchQuery.trim()) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(listing =>
      listing.price_per_unit >= filters.priceRange[0] &&
      listing.price_per_unit <= filters.priceRange[1]
    );

    // Location filter
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter(listing =>
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Freshness filter
    if (filters.freshness !== "all") {
      filtered = filtered.filter(listing => {
        const days = getDaysUntilExpiry(listing.expiry_date);
        switch (filters.freshness) {
          case "fresh":
            return days >= 7;
          case "soon":
            return days >= 3 && days < 7;
          case "urgent":
            return days >= 1 && days < 3;
          default:
            return true;
        }
      });
    }

    // Minimum quantity filter
    if (filters.minQuantity > 0) {
      filtered = filtered.filter(listing =>
        listing.quantity_available >= filters.minQuantity
      );
    }

    setFilteredListings(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days <= 0) return { status: "expired", color: "destructive" };
    if (days <= 3) return { status: "urgent", color: "destructive" };
    if (days <= 7) return { status: "soon", color: "secondary" };
    return { status: "fresh", color: "default" };
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Fresh Marketplace
            </h2>
            <p className="text-xl text-muted-foreground">
              Loading fresh produce from farmers across Kenya...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Fresh Marketplace
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover fresh produce directly from verified farmers across Kenya. 
            Quality guaranteed, fair prices, direct connections.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products, locations, or farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/80 border-border/50 focus:bg-background transition-smooth"
              />
            </div>
            <FilterModal 
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={categories.filter(cat => cat.value !== "all")}
              availableLocations={[...new Set(listings.map(listing => listing.location))]}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`group transition-smooth animate-slide-up hover:shadow-medium ${
                  selectedCategory === category.value 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow-primary' 
                    : 'hover:bg-gradient-primary/10'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category.name}
                {selectedCategory === category.value && (
                  <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-smooth" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-primary">{filteredListings.length}</span> fresh products
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredListings.map((listing, index) => {
              const expiryStatus = getExpiryStatus(listing.expiry_date);
              return (
                <Card 
                  key={listing.id} 
                  className="group cursor-pointer transition-smooth hover:shadow-large hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-border/50 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {listing.category}
                        </Badge>
                        {listing.sold_at && (
                          <Badge variant="destructive" className="text-xs">
                            SOLD
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        variant={expiryStatus.color as "default" | "secondary" | "destructive"}
                        className="text-xs"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {getDaysUntilExpiry(listing.expiry_date)} days
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
                      {listing.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{listing.location}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {listing.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          KSh {listing.price_per_unit.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per {listing.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {listing.quantity_available} {listing.unit}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          available
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Harvested {formatDate(listing.harvest_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>

                    <Button 
                      className="w-full group bg-gradient-primary hover:shadow-glow-primary transition-smooth"
                      size="sm"
                      onClick={() => {
                        setSelectedListing(listing);
                        setContactModalOpen(true);
                      }}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Contact Farmer
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter to find more products.
            </p>
          </div>
        )}

        {/* View All Button */}
        {filteredListings.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="group"
              onClick={() => {
                toast({
                  title: "All Products",
                  description: "Showing all available products in the marketplace!",
                });
              }}
            >
              View All Products
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
            </Button>
          </div>
        )}

        {/* Contact Farmer Modal */}
        <ContactFarmerModal 
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          listing={selectedListing}
        />
      </div>
    </section>
  );
};