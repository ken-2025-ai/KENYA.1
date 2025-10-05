import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ListingForm } from "@/components/ListingForm";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ChatSystem } from "@/components/ChatSystem";
import { NotificationSystem } from "@/components/NotificationSystem";
import { 
  User, 
  Plus, 
  Package, 
  TrendingUp, 
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  BarChart3,
  DollarSign,
  Users,
  Star,
  Target,
  Clock,
  Zap,
  Award,
  Activity,
  MessageCircle
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
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
  sold_at: string | null;
  image_url: string | null;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<MarketListing | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Cleanup sold listings periodically
  useEffect(() => {
    const cleanupInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke('cleanup-sold-listings');
      } catch (error) {
        console.log('Cleanup function not available or failed:', error);
      }
    }, 30 * 60 * 1000); // Run every 30 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

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

  const markAsSold = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("market_listings")
        .update({ sold_at: new Date().toISOString() })
        .eq("id", listingId);

      if (error) throw error;

      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, sold_at: new Date().toISOString() }
            : listing
        )
      );

      toast({
        title: "Listing marked as sold",
        description: "The listing will be automatically removed in 2 hours.",
      });
    } catch (error: any) {
      toast({
        title: "Error marking as sold",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("market_listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== listingId));

      toast({
        title: "Listing deleted",
        description: "Your listing has been permanently removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting listing",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const viewListing = (listing: MarketListing) => {
    toast({
      title: listing.title,
      description: `${listing.description || 'No description'} - KSh ${listing.price_per_unit}/${listing.unit}`,
    });
  };

  const editListing = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setEditingListing(listing);
      setIsListingFormOpen(true);
    }
  };

  const handleCloseForm = () => {
    setIsListingFormOpen(false);
    setEditingListing(null);
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
    <div className="min-h-screen bg-background relative">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 gradient-mesh-bg pointer-events-none"></div>
      
      <Navigation />
      <NotificationSystem />
      <ChatSystem />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header - Mobile Responsive */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 animate-slide-up">
          <div className="glass-card p-4 md:p-6 rounded-xl flex-1">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1 truncate">
                  Welcome, {profile?.full_name || user?.email?.split('@')[0]}! 🌱
                </h1>
                <p className="text-sm md:text-base text-muted-foreground truncate">
                  {profile?.location ? `Farming in ${profile.location}` : 'Complete your profile'}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge className="bg-success/10 text-success border-success/20 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    4.8
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="hero" 
            className="gap-2 shadow-glow-primary hover:scale-105 transition-spring w-full md:w-auto"
            onClick={() => setIsListingFormOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Listing
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Stats Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Card className="glass-card hover:shadow-glow-primary transition-smooth group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Sales</p>
                      <p className="text-lg md:text-2xl font-bold text-primary truncate">
                        KSh {listings.filter(l => l.sold_at).reduce((total, listing) => 
                          total + (listing.price_per_unit * listing.quantity_available), 0
                        ).toLocaleString()}
                      </p>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +12%
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-gradient-primary rounded-full group-hover:scale-110 transition-smooth flex-shrink-0">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-glow-accent transition-smooth group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Active Listings</p>
                      <p className="text-lg md:text-2xl font-bold text-accent">{listings.filter(l => l.is_active).length}</p>
                      <p className="text-xs text-muted-foreground">of {listings.length} total</p>
                    </div>
                    <div className="p-2 md:p-3 bg-gradient-accent rounded-full group-hover:scale-110 transition-smooth flex-shrink-0">
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-glow-success transition-smooth group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Profile Views</p>
                      <p className="text-lg md:text-2xl font-bold text-success">{Math.floor(Math.random() * 500) + 100}</p>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <Eye className="w-3 h-3" />
                        +25
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-gradient-success rounded-full group-hover:scale-110 transition-smooth flex-shrink-0">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-success-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-medium transition-smooth group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Conversion</p>
                      <p className="text-lg md:text-2xl font-bold text-primary">
                        {listings.length > 0 ? ((listings.filter(l => l.sold_at).length / listings.length) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">sales rate</p>
                    </div>
                    <div className="p-2 md:p-3 bg-muted rounded-full group-hover:scale-110 transition-smooth flex-shrink-0">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Insights */}
            <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BarChart3 className="w-5 h-5" />
                  Performance Insights
                </CardTitle>
                <CardDescription>
                  Track your farming business growth and optimize your sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Top Performing Category</p>
                        <p className="text-sm text-muted-foreground">Vegetables - 65% of total sales</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      Best Seller
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <WeatherWidget userLocation={profile?.location} />
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <Card className="glass-card mt-8">
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
                <Button variant="hero" onClick={() => setIsListingFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:shadow-soft transition-smooth"
                  >
                    {/* Product Image */}
                    {listing.image_url && (
                      <div className="w-full md:w-24 h-40 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={listing.image_url} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-2 flex-wrap">
                         <h3 className="font-semibold text-base md:text-lg">{listing.title}</h3>
                         <Badge 
                           variant={listing.is_active ? "default" : "secondary"}
                           className="text-xs"
                         >
                           {listing.is_active ? "Active" : "Inactive"}
                         </Badge>
                         {listing.sold_at && (
                           <Badge variant="destructive" className="text-xs">
                             Sold
                           </Badge>
                         )}
                         <Badge variant="outline" className="text-xs">{listing.category}</Badge>
                       </div>
                      <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <span className="font-medium">KSh {listing.price_per_unit}/{listing.unit}</span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3 md:w-4 md:h-4" />
                          {listing.quantity_available} {listing.unit}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                          {listing.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex md:flex-col items-center gap-2 flex-wrap md:flex-nowrap">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewListing(listing)}
                        title="View listing details"
                        className="flex-1 md:flex-none"
                      >
                        <Eye className="w-4 h-4 md:mr-0" />
                        <span className="md:hidden ml-2">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => editListing(listing.id)}
                        title="Edit listing"
                        className="flex-1 md:flex-none"
                      >
                        <Edit className="w-4 h-4 md:mr-0" />
                        <span className="md:hidden ml-2">Edit</span>
                      </Button>
                      {!listing.sold_at && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleListingStatus(listing.id, listing.is_active)}
                            title={listing.is_active ? "Deactivate listing" : "Activate listing"}
                            className="flex-1 md:flex-none text-xs"
                          >
                            {listing.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsSold(listing.id)}
                            className="text-success hover:text-success flex-1 md:flex-none"
                            title="Mark as sold"
                          >
                            <CheckCircle className="w-4 h-4 md:mr-0" />
                            <span className="md:hidden ml-2">Sold</span>
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteListing(listing.id)}
                        title="Delete listing"
                        className="text-destructive hover:text-destructive flex-1 md:flex-none"
                      >
                        <Trash2 className="w-4 h-4 md:mr-0" />
                        <span className="md:hidden ml-2">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ListingForm 
        isOpen={isListingFormOpen}
        onClose={handleCloseForm}
        onSuccess={fetchUserData}
        editListing={editingListing || undefined}
        isEditing={!!editingListing}
      />
    </div>
  );
};

export default Dashboard;