import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Calendar,
  Package,
  Search,
  Star,
  ChevronRight,
  Clock,
  Sparkles,
  Navigation as NavigationIcon,
  Loader2,
  Flag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ContactFarmerModal } from "./ContactFarmerModal";
import { FilterModal } from "./FilterModal";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useBuyerPreferences } from "@/hooks/useBuyerPreferences";
import { distanceToListing } from "@/lib/kenyaGeo";
import { ReportListingModal } from "./ReportListingModal";

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

type ScoredListing = MarketListing & {
  distanceKm: number | null;
  aiScore?: number;
  aiReason?: string;
};

const categories = [
  { name: "All", value: "all", color: "bg-gradient-primary" },
  { name: "Vegetables", value: "vegetables", color: "bg-green-500" },
  { name: "Fruits", value: "fruits", color: "bg-orange-500" },
  { name: "Grains", value: "grains", color: "bg-yellow-500" },
  { name: "Legumes", value: "legumes", color: "bg-red-500" },
  { name: "Dairy", value: "dairy", color: "bg-blue-500" },
  { name: "Livestock", value: "livestock", color: "bg-purple-500" },
];

interface FilterState {
  priceRange: [number, number];
  location: string;
  maxDistance: number;
  freshness: string;
  minQuantity: number;
  categories: string[];
}

const getDaysUntilExpiry = (expiryDate: string) => {
  if (!expiryDate) return null;
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const Marketplace = () => {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string; userId: string } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [aiRecs, setAiRecs] = useState<{ id: string; score: number; reason: string }[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    location: "all",
    maxDistance: 50,
    freshness: "all",
    minQuantity: 0,
    categories: [],
  });
  const { toast } = useToast();
  const { latitude, longitude, location: geoLocation, requestLocation } = useGeolocation();
  const { profile, track } = useBuyerPreferences();

  const buyerPos = useMemo(
    () => (latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null),
    [latitude, longitude],
  );

  const fetchListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("market_listings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch marketplace listings",
          variant: "destructive",
        });
        return;
      }
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchListings();
    const channel = supabase
      .channel("marketplace-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "market_listings" },
        () => fetchListings(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchListings]);

  /** Filtered + distance-aware ordering. Nearby listings always come first. */
  const filteredListings: ScoredListing[] = useMemo(() => {
    let filtered = listings.map((l) => ({
      ...l,
      distanceKm: distanceToListing(buyerPos, l.location),
    }));

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (l) => l.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter((l) => filters.categories.includes(l.category.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q),
      );
    }
    filtered = filtered.filter(
      (l) =>
        l.price_per_unit >= filters.priceRange[0] && l.price_per_unit <= filters.priceRange[1],
    );
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((l) =>
        l.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }
    if (filters.freshness !== "all") {
      filtered = filtered.filter((l) => {
        const days = getDaysUntilExpiry(l.expiry_date) ?? 999;
        if (filters.freshness === "fresh") return days >= 7;
        if (filters.freshness === "soon") return days >= 3 && days < 7;
        if (filters.freshness === "urgent") return days >= 1 && days < 3;
        return true;
      });
    }
    if (filters.minQuantity > 0) {
      filtered = filtered.filter((l) => l.quantity_available >= filters.minQuantity);
    }

    // Radius prioritization: inside-radius first, then by distance, then newest.
    return filtered.sort((a, b) => {
      const aIn = a.distanceKm != null && a.distanceKm <= radiusKm ? 0 : 1;
      const bIn = b.distanceKm != null && b.distanceKm <= radiusKm ? 0 : 1;
      if (aIn !== bIn) return aIn - bIn;
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [listings, selectedCategory, searchQuery, filters, buyerPos, radiusKm]);

  const nearbyCount = filteredListings.filter(
    (l) => l.distanceKm != null && l.distanceKm <= radiusKm,
  ).length;

  /** Ask the AI recommender to rank the nearest candidates for this buyer. */
  useEffect(() => {
    if (loading || filteredListings.length === 0) return;
    let cancelled = false;

    const run = async () => {
      setRecsLoading(true);
      try {
        const candidates = filteredListings.slice(0, 40).map((l) => ({
          id: l.id,
          title: l.title,
          category: l.category,
          price_per_unit: l.price_per_unit,
          unit: l.unit,
          location: l.location,
          quantity_available: l.quantity_available,
          distance_km: l.distanceKm,
          days_to_expiry: getDaysUntilExpiry(l.expiry_date),
        }));

        const { data, error } = await supabase.functions.invoke("market-recommendations", {
          body: {
            candidates,
            topCategories: profile.topCategories,
            recentTitles: profile.events
              .filter((e) => e.type !== "search")
              .slice(0, 8)
              .map((e) => e.title),
            avgPrice: profile.avgPrice,
            buyerLocation: geoLocation || "Kenya",
            radiusKm,
          },
        });

        if (error) throw error;
        if (!cancelled) setAiRecs(data?.recommendations ?? []);
      } catch (e) {
        console.error("Recommendation error:", e);
        if (!cancelled) setAiRecs([]);
      } finally {
        if (!cancelled) setRecsLoading(false);
      }
    };

    const timer = setTimeout(run, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Re-rank when the catalogue, buyer taste, radius or location changes.
  }, [loading, listings.length, profile.topCategories.join(","), profile.avgPrice, radiusKm, geoLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  const recommended: ScoredListing[] = useMemo(() => {
    if (aiRecs.length === 0) return [];
    const byId = new Map(filteredListings.map((l) => [l.id, l]));
    return aiRecs
      .map((r) => {
        const listing = byId.get(r.id);
        return listing ? { ...listing, aiScore: r.score, aiReason: r.reason } : null;
      })
      .filter(Boolean)
      .slice(0, 4) as ScoredListing[];
  }, [aiRecs, filteredListings]);

  const formatDate = (dateString: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days == null) return { status: "fresh", color: "default" };
    if (days <= 0) return { status: "expired", color: "destructive" };
    if (days <= 3) return { status: "urgent", color: "destructive" };
    if (days <= 7) return { status: "soon", color: "secondary" };
    return { status: "fresh", color: "default" };
  };

  const openListing = (listing: ScoredListing) => {
    track({
      id: listing.id,
      title: listing.title,
      category: listing.category,
      location: listing.location,
      price: listing.price_per_unit,
      type: "contact",
    });
    setSelectedListing(listing);
    setContactModalOpen(true);
  };

  const renderCard = (listing: ScoredListing, index: number) => {
    const expiryStatus = getExpiryStatus(listing.expiry_date);
    const days = getDaysUntilExpiry(listing.expiry_date);
    return (
      <Card
        key={listing.id}
        onMouseEnter={() =>
          track({
            id: listing.id,
            title: listing.title,
            category: listing.category,
            location: listing.location,
            price: listing.price_per_unit,
            type: "view",
          })
        }
        className="group cursor-pointer transition-smooth hover:shadow-large hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50 animate-slide-up overflow-hidden"
        style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
      >
        {listing.image_url && (
          <div className="w-full h-44 overflow-hidden relative">
            <img
              src={listing.image_url}
              alt={listing.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-300"
            />
            {listing.aiReason && (
              <Badge className="absolute top-2 left-2 bg-gradient-primary text-primary-foreground border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {listing.aiScore}% match
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {listing.category}
              </Badge>
              {listing.sold_at && (
                <Badge variant="destructive" className="text-xs">
                  SOLD
                </Badge>
              )}
            </div>
            {days != null && (
              <Badge
                variant={expiryStatus.color as "default" | "secondary" | "destructive"}
                className="text-xs flex-shrink-0"
              >
                <Clock className="w-3 h-3 mr-1" />
                {days}d
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
            {listing.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3" />
              {listing.location}
            </span>
            {listing.distanceKm != null && (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  listing.distanceKm <= radiusKm ? "border-primary text-primary" : ""
                }`}
              >
                {listing.distanceKm} km away
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {listing.aiReason && (
            <p className="text-xs text-primary flex items-start gap-1">
              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {listing.aiReason}
            </p>
          )}
          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                KSh {listing.price_per_unit.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">per {listing.unit}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {listing.quantity_available} {listing.unit}
              </div>
              <div className="text-xs text-muted-foreground">available</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Harvested {formatDate(listing.harvest_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>

          <Button
            className="w-full group bg-gradient-primary hover:shadow-glow-primary transition-smooth"
            size="sm"
            onClick={() => openListing(listing)}
          >
            <Package className="w-4 h-4 mr-2" />
            Contact Farmer
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-destructive"
            onClick={() => setReportTarget({ id: listing.id, title: listing.title, userId: listing.user_id })}
          >
            <Flag className="w-3 h-3 mr-1.5" />
            Report this listing or farmer
          </Button>
        </CardContent>
      </Card>
    );
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
    <section className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Fresh Marketplace</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Produce from verified farmers near you — picked for you by AI.
          </p>
        </div>

        {/* Search, radius and filters */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products, locations, or farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() =>
                  searchQuery.trim() &&
                  track({
                    id: "search",
                    title: searchQuery.trim(),
                    category: selectedCategory,
                    location: geoLocation || "",
                    price: 0,
                    type: "search",
                  })
                }
                className="pl-10 bg-background/80 border-border/50 focus:bg-background transition-smooth"
              />
            </div>
            <FilterModal
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={categories.filter((cat) => cat.value !== "all")}
              availableLocations={[...new Set(listings.map((listing) => listing.location))]}
            />
          </div>

          {/* Radius control */}
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <NavigationIcon className="w-4 h-4 text-primary" />
                Show produce within {radiusKm} km
              </div>
              {buyerPos ? (
                <span className="text-xs text-muted-foreground">
                  {nearbyCount} nearby · from {geoLocation || "your location"}
                </span>
              ) : (
                <Button variant="outline" size="sm" onClick={requestLocation}>
                  <MapPin className="w-3 h-3 mr-1" />
                  Use my location
                </Button>
              )}
            </div>
            <Slider
              value={[radiusKm]}
              min={5}
              max={300}
              step={5}
              onValueChange={(v) => setRadiusKm(v[0])}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>5 km</span>
              <span>300 km</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`transition-smooth ${
                  selectedCategory === category.value
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                    : "hover:bg-gradient-primary/10"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* AI recommendations */}
        {(recommended.length > 0 || recsLoading) && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Recommended for you</h3>
              {recsLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              <Badge variant="outline" className="ml-auto text-xs">
                Based on what you browse and buy
              </Badge>
            </div>
            {recommended.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommended.map((listing, index) => renderCard(listing, index))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Analysing nearby produce for your preferences...
              </p>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-primary">{filteredListings.length}</span> products
            {buyerPos && ` · ${nearbyCount} within ${radiusKm} km`}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredListings.map((listing, index) => renderCard(listing, index))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try widening your radius or clearing filters to see more produce.
            </p>
          </div>
        )}

        <ContactFarmerModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          listing={selectedListing}
        />

        <ReportListingModal
          open={!!reportTarget}
          onOpenChange={(o) => !o && setReportTarget(null)}
          targetType="market_listing"
          targetId={reportTarget?.id ?? ""}
          targetTitle={reportTarget?.title}
          reportedUserId={reportTarget?.userId}
        />
      </div>
    </section>
  );
};
