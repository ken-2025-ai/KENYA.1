import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  TrendingDown,
  Activity
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
}

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalRevenue: number;
  avgPrice: number;
  totalViews: number;
  conversionRate: number;
  rating: number;
  completedSales: number;
}

const EnhancedDashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    totalRevenue: 0,
    avgPrice: 0,
    totalViews: 0,
    conversionRate: 0,
    rating: 4.8,
    completedSales: 0
  });
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

      const listings = listingsData || [];
      setListings(listings);

      // Calculate stats
      const totalListings = listings.length;
      const activeListings = listings.filter(l => l.is_active && !l.sold_at).length;
      const soldListings = listings.filter(l => l.sold_at).length;
      const totalRevenue = listings
        .filter(l => l.sold_at)
        .reduce((sum, l) => sum + (l.price_per_unit * l.quantity_available), 0);
      const avgPrice = totalListings > 0 
        ? listings.reduce((sum, l) => sum + l.price_per_unit, 0) / totalListings 
        : 0;

      setStats({
        totalListings,
        activeListings,
        totalRevenue,
        avgPrice,
        totalViews: Math.floor(Math.random() * 500) + 100, // Mock data
        conversionRate: totalListings > 0 ? (soldListings / totalListings) * 100 : 0,
        rating: 4.8,
        completedSales: soldListings
      });

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

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your enhanced dashboard...</p>
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
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div className="glass-card p-6 rounded-xl flex-1 mr-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  Welcome back, {profile?.full_name || user?.email?.split('@')[0]}! 🌱
                </h1>
                <p className="text-muted-foreground">
                  {profile?.location ? `Farming in ${profile.location}` : 'Complete your profile to get started'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Farmer
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Star className="w-3 h-3 mr-1" />
                    {stats.rating} Rating
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="hero" 
            className="gap-2 shadow-glow-primary hover:scale-105 transition-spring animate-glow-pulse"
          >
            <Plus className="w-5 h-5" />
            New Listing
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Card className="glass-card hover:shadow-glow-primary transition-smooth group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold text-primary">KSh {stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +12% this month
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-primary rounded-full group-hover:scale-110 transition-smooth">
                      <DollarSign className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-glow-accent transition-smooth group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                      <p className="text-2xl font-bold text-accent">{stats.activeListings}</p>
                      <p className="text-xs text-muted-foreground">of {stats.totalListings} total</p>
                    </div>
                    <div className="p-3 bg-gradient-accent rounded-full group-hover:scale-110 transition-smooth">
                      <Package className="w-5 h-5 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-glow-success transition-smooth group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                      <p className="text-2xl font-bold text-success">{stats.totalViews}</p>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <Eye className="w-3 h-3" />
                        +25 today
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-success rounded-full group-hover:scale-110 transition-smooth">
                      <Users className="w-5 h-5 text-success-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-medium transition-smooth group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion</p>
                      <p className="text-2xl font-bold text-primary">{stats.conversionRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">sales rate</p>
                    </div>
                    <div className="p-3 bg-muted rounded-full group-hover:scale-110 transition-smooth">
                      <Target className="w-5 h-5 text-muted-foreground" />
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

                  <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Optimal Posting Time</p>
                        <p className="text-sm text-muted-foreground">6-8 AM gets 40% more views</p>
                      </div>
                    </div>
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      Tip
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Customer Satisfaction</p>
                        <p className="text-sm text-muted-foreground">4.8/5 stars from 23 reviews</p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Excellent
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock activity data */}
                  <div className="flex items-center gap-3 p-3 hover:bg-gradient-card rounded-lg transition-smooth">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">New order for Fresh Tomatoes</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                    <Badge variant="outline" className="text-xs">KSh 850</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 hover:bg-gradient-card rounded-lg transition-smooth">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Price alert triggered for Maize</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="outline" className="text-xs">+15%</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 hover:bg-gradient-card rounded-lg transition-smooth">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">New message from Grace Wanjiku</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Reply</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <WeatherWidget />
            </div>

            {/* Quick Actions */}
            <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gradient-primary/10">
                  <Plus className="w-4 h-4" />
                  Create New Listing
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gradient-accent/10">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gradient-success/10">
                  <MessageCircle className="w-4 h-4" />
                  Check Messages
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gradient-card">
                  <User className="w-4 h-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;