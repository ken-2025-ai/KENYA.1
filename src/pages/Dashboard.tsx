import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Plus, 
  Package, 
  TrendingUp, 
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  farm_size: string | null;
  farming_type: string | null;
  bio: string | null;
}

interface MarketListing {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  location: string;
  harvest_date: string | null;
  is_active: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData);

      // Fetch user's market listings
      const { data: listingsData, error: listingsError } = await supabase
        .from("market_listings")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (listingsError) throw listingsError;

      setListings(listingsData || []);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const toggleListingStatus = async (listingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("market_listings")
        .update({ is_active: !currentStatus })
        .eq("id", listingId);

      if (error) throw error;

      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, is_active: !currentStatus }
            : listing
        )
      );

      toast({
        title: "Listing updated",
        description: `Listing ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating listing",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.full_name || user?.email}!
            </h1>
            <p className="text-muted-foreground">
              Manage your farm listings and connect with buyers
            </p>
          </div>
          <Button variant="hero" className="gap-2">
            <Plus className="w-4 h-4" />
            New Listing
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings.length}</div>
              <p className="text-xs text-muted-foreground">
                {listings.filter(l => l.is_active).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSh {listings.reduce((total, listing) => 
                  total + (listing.price_per_unit * listing.quantity_available), 0
                ).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total inventory value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.location && profile?.farming_type ? "Complete" : "Incomplete"}
              </div>
              <p className="text-xs text-muted-foreground">
                {profile?.location && profile?.farming_type 
                  ? "Ready to sell" 
                  : "Complete your profile"
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Your Market Listings
            </CardTitle>
            <CardDescription>
              Manage your produce listings and connect with buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start selling your produce by creating your first listing
                </p>
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-soft transition-smooth"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <Badge 
                          variant={listing.is_active ? "default" : "secondary"}
                        >
                          {listing.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{listing.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>KSh {listing.price_per_unit}/{listing.unit}</span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {listing.quantity_available} {listing.unit} available
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleListingStatus(listing.id, listing.is_active)}
                      >
                        {listing.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;