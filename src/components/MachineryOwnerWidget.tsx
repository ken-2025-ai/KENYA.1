import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tractor, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

interface MachineryStats {
  totalListings: number;
  activeListings: number;
  pendingBookings: number;
  approvedBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

interface RecentBooking {
  id: string;
  machinery_title: string;
  farmer_name: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
}

export const MachineryOwnerWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MachineryStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMachineryData();
    }
  }, [user]);

  const fetchMachineryData = async () => {
    try {
      // Check if user has any machinery listings
      const { data: listings, error: listingsError } = await supabase
        .from("machinery_listings")
        .select("id, title, rental_rate")
        .eq("owner_id", user?.id);

      if (listingsError) throw listingsError;

      if (!listings || listings.length === 0) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      setIsOwner(true);

      // Fetch bookings for owner's machinery
      const { data: bookings, error: bookingsError } = await supabase
        .from("machinery_bookings")
        .select(`
          id,
          machinery_id,
          start_date,
          end_date,
          status,
          total_amount,
          farmer_id
        `)
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;

      // Calculate stats
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const approvedBookings = bookings?.filter(b => b.status === 'approved').length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const totalRevenue = bookings?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

      setStats({
        totalListings: listings.length,
        activeListings: listings.length, // All fetched are active per RLS
        pendingBookings,
        approvedBookings,
        completedBookings,
        totalRevenue
      });

      // Get recent bookings with machinery titles
      const recentBookingsData: RecentBooking[] = [];
      for (const booking of (bookings || []).slice(0, 3)) {
        const machinery = listings.find(l => l.id === booking.machinery_id);
        
        // Fetch farmer profile
        const { data: farmerProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", booking.farmer_id)
          .maybeSingle();

        recentBookingsData.push({
          id: booking.id,
          machinery_title: machinery?.title || 'Unknown Equipment',
          farmer_name: farmerProfile?.full_name || 'Unknown Farmer',
          start_date: booking.start_date,
          end_date: booking.end_date,
          status: booking.status,
          total_amount: Number(booking.total_amount)
        });
      }

      setRecentBookings(recentBookingsData);
    } catch (error) {
      console.error('Error fetching machinery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-primary/10 text-primary border-primary/20"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'in_progress':
        return <Badge className="bg-accent/10 text-accent border-accent/20"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/20"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><AlertCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Don't show widget if user is not an equipment owner
  if (!isOwner) {
    return null;
  }

  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tractor className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Equipment Dashboard</CardTitle>
              <CardDescription>Your machinery rental overview</CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/my-machinery')}
            className="text-primary hover:bg-primary/10"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{stats?.totalListings || 0}</p>
            <p className="text-xs text-muted-foreground">Equipment</p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-warning">{stats?.pendingBookings || 0}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-success">{stats?.approvedBookings || 0}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">KSh {(stats?.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recent Bookings
            </p>
            <div className="space-y-2">
              {recentBookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="p-3 bg-muted/30 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{booking.machinery_title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {booking.farmer_name} • {new Date(booking.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      KSh {booking.total_amount.toLocaleString()}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentBookings.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No bookings yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
