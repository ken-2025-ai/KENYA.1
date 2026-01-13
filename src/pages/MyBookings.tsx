import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tractor,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Search,
  Filter,
  Star,
  MessageSquare,
  ArrowUpDown,
  CalendarDays,
  PlayCircle,
  History,
  AlertCircle,
} from "lucide-react";
import { format, differenceInDays, isAfter, isBefore, isToday } from "date-fns";
import BookingDetailModal from "@/components/machinery/BookingDetailModal";

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Fetch my bookings as a farmer
  const { data: myBookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("machinery_bookings")
        .select(`
          *,
          machinery:machinery_listings(
            id, title, category, brand, model, rental_rate, rental_period, 
            county, town, image_urls, owner_id
          )
        `)
        .eq("farmer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      // Fetch owner profiles separately
      const ownerIds = [...new Set(data.map(b => b.owner_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone, location")
        .in("user_id", ownerIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return data.map(booking => ({
        ...booking,
        owner: profileMap.get(booking.owner_id) || null
      }));
    },
    enabled: !!user,
  });

  // Cancel booking mutation
  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("machinery_bookings")
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast({ title: "Booking cancelled successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  // Filter and sort bookings
  const filteredBookings = myBookings
    ?.filter((booking) => {
      const matchesSearch =
        booking.machinery?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.owner?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "amount-high":
          return b.total_amount - a.total_amount;
        case "amount-low":
          return a.total_amount - b.total_amount;
        case "start-date":
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        default:
          return 0;
      }
    });

  // Group bookings by status
  const pendingBookings = filteredBookings?.filter((b) => b.status === "pending") || [];
  const activeBookings = filteredBookings?.filter((b) => ["approved", "in_progress"].includes(b.status)) || [];
  const completedBookings = filteredBookings?.filter((b) => b.status === "completed") || [];
  const cancelledBookings = filteredBookings?.filter((b) => ["cancelled", "rejected"].includes(b.status)) || [];

  // Calculate stats
  const totalSpent = myBookings?.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.total_amount, 0) || 0;
  const upcomingCount = myBookings?.filter((b) => {
    const startDate = new Date(b.start_date);
    return b.status === "approved" && isAfter(startDate, new Date());
  }).length || 0;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
      pending: { className: "bg-warning/20 text-warning border-warning/30", icon: <Clock className="h-3 w-3" />, label: "Pending" },
      approved: { className: "bg-success/20 text-success border-success/30", icon: <CheckCircle className="h-3 w-3" />, label: "Approved" },
      rejected: { className: "bg-destructive/20 text-destructive border-destructive/30", icon: <XCircle className="h-3 w-3" />, label: "Rejected" },
      in_progress: { className: "bg-primary/20 text-primary border-primary/30", icon: <PlayCircle className="h-3 w-3" />, label: "In Progress" },
      completed: { className: "bg-muted text-muted-foreground", icon: <CheckCircle className="h-3 w-3" />, label: "Completed" },
      cancelled: { className: "bg-muted text-muted-foreground", icon: <XCircle className="h-3 w-3" />, label: "Cancelled" },
    };
    const { className, icon, label } = config[status] || config.pending;
    return (
      <Badge variant="outline" className={className}>
        {icon}
        <span className="ml-1">{label}</span>
      </Badge>
    );
  };

  const getBookingUrgency = (booking: any) => {
    const startDate = new Date(booking.start_date);
    const daysUntilStart = differenceInDays(startDate, new Date());
    
    if (booking.status === "approved" && isToday(startDate)) {
      return { type: "today", message: "Starts today!" };
    }
    if (booking.status === "approved" && daysUntilStart > 0 && daysUntilStart <= 3) {
      return { type: "soon", message: `Starts in ${daysUntilStart} day${daysUntilStart > 1 ? "s" : ""}` };
    }
    if (booking.status === "pending" && daysUntilStart <= 2) {
      return { type: "urgent", message: "Pending - starts soon!" };
    }
    return null;
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const urgency = getBookingUrgency(booking);
    const duration = differenceInDays(new Date(booking.end_date), new Date(booking.start_date)) + 1;
    
    return (
      <Card 
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setSelectedBooking(booking)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-48 h-40 md:h-auto bg-muted shrink-0">
            <img
              src={booking.machinery?.image_urls?.[0] || "/placeholder.svg"}
              alt={booking.machinery?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {urgency && (
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
                urgency.type === "today" ? "bg-success text-success-foreground" :
                urgency.type === "soon" ? "bg-warning text-warning-foreground" :
                "bg-destructive text-destructive-foreground"
              }`}>
                <AlertCircle className="h-3 w-3 inline mr-1" />
                {urgency.message}
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{booking.machinery?.title || "Equipment"}</h3>
                  {getStatusBadge(booking.status)}
                </div>

                {booking.machinery?.brand && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {booking.machinery.brand} {booking.machinery.model && `• ${booking.machinery.model}`}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {booking.owner?.full_name || "Owner"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.machinery?.town ? `${booking.machinery.town}, ` : ""}{booking.machinery?.county}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(booking.start_date), "MMM d")} - {format(new Date(booking.end_date), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {duration} day{duration > 1 ? "s" : ""}
                  </span>
                </div>

                {booking.farmer_notes && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-2">
                    "{booking.farmer_notes}"
                  </p>
                )}

                {booking.owner_notes && (
                  <div className="mt-2 p-2 bg-muted/50 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3 inline mr-1" />
                      Owner's response: "{booking.owner_notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-xl font-bold text-primary">
                  KES {booking.total_amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Booked {format(new Date(booking.created_at), "MMM d, yyyy")}
                </p>

                <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  {booking.owner?.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${booking.owner.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                  )}

                  {booking.status === "pending" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking request? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelBooking.mutate(booking.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Tractor className="h-6 w-6" />
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Farmer Dashboard
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-white/70 mt-1">
            Track and manage your equipment rental bookings
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{myBookings?.length || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Pending</p>
              <p className="text-2xl font-bold">{pendingBookings.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingCount}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">KES {totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 px-4 border-b bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by equipment or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="start-date">Start Date</SelectItem>
              <SelectItem value="amount-high">Amount: High to Low</SelectItem>
              <SelectItem value="amount-low">Amount: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="flex-wrap">
                <TabsTrigger value="all" className="gap-2">
                  <Tractor className="h-4 w-4" />
                  All ({filteredBookings?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending
                  {pendingBookings.length > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 justify-center bg-warning text-warning-foreground">
                      {pendingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Active ({activeBookings.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed ({completedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="gap-2">
                  <History className="h-4 w-4" />
                  Cancelled/Rejected ({cancelledBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {filteredBookings && filteredBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="all" />
                )}
              </TabsContent>

              <TabsContent value="pending">
                {pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="pending" />
                )}
              </TabsContent>

              <TabsContent value="active">
                {activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    {activeBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="active" />
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {completedBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="completed" />
                )}
              </TabsContent>

              <TabsContent value="cancelled">
                {cancelledBookings.length > 0 ? (
                  <div className="space-y-4">
                    {cancelledBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type="cancelled" />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          userRole="farmer"
          onStatusChange={() => {
            queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
          }}
        />
      )}
    </div>
  );
};

const EmptyState = ({ type }: { type: string }) => {
  const content: Record<string, { icon: React.ReactNode; title: string; description: string }> = {
    all: {
      icon: <Tractor className="h-12 w-12 text-muted-foreground" />,
      title: "No bookings yet",
      description: "Browse available equipment and make your first booking",
    },
    pending: {
      icon: <Clock className="h-12 w-12 text-muted-foreground" />,
      title: "No pending bookings",
      description: "All your booking requests have been processed",
    },
    active: {
      icon: <PlayCircle className="h-12 w-12 text-muted-foreground" />,
      title: "No active bookings",
      description: "You don't have any ongoing equipment rentals",
    },
    completed: {
      icon: <CheckCircle className="h-12 w-12 text-muted-foreground" />,
      title: "No completed bookings",
      description: "Your completed rentals will appear here",
    },
    cancelled: {
      icon: <History className="h-12 w-12 text-muted-foreground" />,
      title: "No cancelled bookings",
      description: "Good news! You haven't cancelled any bookings",
    },
  };

  const { icon, title, description } = content[type] || content.all;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        {icon}
        <h3 className="text-lg font-semibold mb-2 mt-4">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md">{description}</p>
        {type === "all" && (
          <Button className="mt-4" onClick={() => window.location.href = "/machinery"}>
            <Tractor className="h-4 w-4 mr-2" />
            Browse Equipment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MyBookings;
