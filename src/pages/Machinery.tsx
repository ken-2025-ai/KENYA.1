import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tractor,
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  Plus,
  Loader2,
  Shield,
  ChevronRight,
} from "lucide-react";
import MachineryCard from "@/components/machinery/MachineryCard";
import MachineryDetailModal from "@/components/machinery/MachineryDetailModal";
import AddMachineryModal from "@/components/machinery/AddMachineryModal";

const KENYA_COUNTIES = [
  "All Counties",
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu",
  "Kiambu", "Machakos", "Kajiado", "Nyeri", "Meru",
  "Kakamega", "Bungoma", "Trans Nzoia", "Nandi", "Kericho",
  "Bomet", "Narok", "Laikipia", "Nyandarua", "Muranga",
];

const MACHINERY_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "tractor", label: "Tractors" },
  { value: "harvester", label: "Harvesters" },
  { value: "plough", label: "Ploughs" },
  { value: "sprayer", label: "Sprayers" },
  { value: "pump", label: "Pumps" },
  { value: "seeder", label: "Seeders" },
  { value: "thresher", label: "Threshers" },
  { value: "trailer", label: "Trailers" },
  { value: "other", label: "Other" },
];

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
  owner_id: string;
}

const Machinery = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: machineryList, isLoading, refetch } = useQuery({
    queryKey: ["machinery", selectedCounty, selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("machinery_listings")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (selectedCounty !== "All Counties") {
        query = query.eq("county", selectedCounty);
      }

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as "tractor" | "harvester" | "plough" | "sprayer" | "pump" | "seeder" | "thresher" | "trailer" | "other");
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Machinery[];
    },
  });

  const getCategoryIcon = (category: string) => {
    return <Tractor className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Tractor className="h-8 w-8" />
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Farm Machinery Leasing
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lease Farm Equipment
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            Connect with equipment owners across Kenya. Find tractors, harvesters, 
            and more for your farming needs at affordable rates.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm">Verified Owners</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="text-sm">47 Counties</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <Star className="h-5 w-5 text-accent" />
              <span className="text-sm">Rated & Reviewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-lg border-b py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search machinery by name, brand, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full md:w-48">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                {KENYA_COUNTIES.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {MACHINERY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {user && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-accent hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Equipment
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Machinery Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading machinery...</span>
            </div>
          ) : machineryList && machineryList.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {machineryList.length} equipment{machineryList.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machineryList.map((machinery) => (
                  <MachineryCard
                    key={machinery.id}
                    machinery={machinery}
                    onClick={() => setSelectedMachinery(machinery)}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Tractor className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No machinery found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || selectedCounty !== "All Counties" || selectedCategory !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Be the first to list your farm equipment!"}
                </p>
                {user && (
                  <Button onClick={() => setShowAddModal(true)} className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your Equipment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedMachinery && (
        <MachineryDetailModal
          machinery={selectedMachinery}
          isOpen={!!selectedMachinery}
          onClose={() => setSelectedMachinery(null)}
        />
      )}

      {/* Add Machinery Modal */}
      <AddMachineryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />
    </div>
  );
};

export default Machinery;