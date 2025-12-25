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
  Plus,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import AddMachineryModal from "@/components/machinery/AddMachineryModal";
import { format } from "date-fns";

const MyMachinery = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch my listings
  const { data: myListings, isLoading: listingsLoading } = useQuery({
    queryKey: ["my-machinery", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("machinery_listings")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch booking requests for my equipment
  const { data: bookingRequests, isLoading: bookingsLoading } = useQuery({
    queryKey: ["machinery-booking-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("machinery_bookings")
        .select(`
          *,
          machinery:machinery_listings(title, category),
          farmer:profiles!machinery_bookings_farmer_id_fkey(full_name, phone)
        `)
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Toggle availability mutation
  const toggleAvailability = useMutation({
    mutationFn: async ({ id, is_available }: { id: string; is_available: boolean }) => {
      const { error } = await supabase
        .from("machinery_listings")
        .update({ is_available: !is_available })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-machinery"] });
      toast({ title: "Availability updated" });
    },
  });

  // Delete listing mutation
  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("machinery_listings")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-machinery"] });
      toast({ title: "Listing deleted" });
    },
  });

  // Update booking status mutation
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" | "in_progress" | "completed" | "cancelled" }) => {
      const { error } = await supabase
        .from("machinery_bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machinery-booking-requests"] });
      toast({ title: "Booking status updated" });
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

  const pendingBookings = bookingRequests?.filter((b) => b.status === "pending") || [];
  const activeBookings = bookingRequests?.filter((b) => ["approved", "in_progress"].includes(b.status)) || [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/20 text-warning",
      approved: "bg-success/20 text-success",
      rejected: "bg-destructive/20 text-destructive",
      in_progress: "bg-primary/20 text-primary",
      completed: "bg-muted text-muted-foreground",
      cancelled: "bg-muted text-muted-foreground",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Settings className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Owner Dashboard
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">My Equipment</h1>
              <p className="text-white/70 mt-1">
                Manage your listings and booking requests
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Total Listings</p>
              <p className="text-2xl font-bold">{myListings?.length || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold">{pendingBookings.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Active Bookings</p>
              <p className="text-2xl font-bold">{activeBookings.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="listings" className="gap-2">
                <Tractor className="h-4 w-4" />
                My Listings
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2">
                <Clock className="h-4 w-4" />
                Booking Requests
                {pendingBookings.length > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 justify-center bg-destructive">
                    {pendingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Listings Tab */}
            <TabsContent value="listings">
              {listingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : myListings && myListings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="relative h-40 bg-muted">
                        <img
                          src={listing.image_urls?.[0] || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${
                            listing.is_available
                              ? "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {listing.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" />
                          {listing.county}
                        </p>
                        <p className="font-medium text-primary mb-4">
                          KES {listing.rental_rate.toLocaleString()}/{listing.rental_period}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              toggleAvailability.mutate({
                                id: listing.id,
                                is_available: listing.is_available,
                              })
                            }
                          >
                            {listing.is_available ? (
                              <ToggleRight className="h-4 w-4 mr-1 text-success" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 mr-1" />
                            )}
                            {listing.is_available ? "Pause" : "Activate"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove this equipment listing.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteListing.mutate(listing.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Tractor className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      List your farm equipment and start earning
                    </p>
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Equipment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Booking Requests Tab */}
            <TabsContent value="requests">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookingRequests && bookingRequests.length > 0 ? (
                <div className="space-y-4">
                  {bookingRequests.map((booking: any) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {booking.machinery?.title || "Equipment"}
                              </h3>
                              <Badge className={getStatusBadge(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {booking.farmer?.full_name || "Farmer"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.start_date), "MMM d")} -{" "}
                                {format(new Date(booking.end_date), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                KES {booking.total_amount.toLocaleString()}
                              </span>
                            </div>
                            {booking.farmer_notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                "{booking.farmer_notes}"
                              </p>
                            )}
                          </div>

                          {booking.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-success hover:bg-success/90"
                                onClick={() =>
                                  updateBookingStatus.mutate({
                                    id: booking.id,
                                    status: "approved",
                                  })
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive"
                                onClick={() =>
                                  updateBookingStatus.mutate({
                                    id: booking.id,
                                    status: "rejected",
                                  })
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {booking.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateBookingStatus.mutate({
                                  id: booking.id,
                                  status: "in_progress",
                                })
                              }
                            >
                              Mark In Progress
                            </Button>
                          )}

                          {booking.status === "in_progress" && (
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              onClick={() =>
                                updateBookingStatus.mutate({
                                  id: booking.id,
                                  status: "completed",
                                })
                              }
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No booking requests</h3>
                    <p className="text-muted-foreground text-center">
                      Booking requests will appear here when farmers book your equipment
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add Modal */}
      <AddMachineryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          queryClient.invalidateQueries({ queryKey: ["my-machinery"] });
        }}
      />
    </div>
  );
};

export default MyMachinery;