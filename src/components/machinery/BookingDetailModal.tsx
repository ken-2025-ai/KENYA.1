import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  MapPin,
  Calendar,
  CalendarDays,
  User,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  Star,
  DollarSign,
  FileText,
  Send,
} from "lucide-react";

interface BookingDetailModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  userRole: "farmer" | "owner";
  onStatusChange?: () => void;
}

const BookingDetailModal = ({
  booking,
  isOpen,
  onClose,
  userRole,
  onStatusChange,
}: BookingDetailModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ownerNotes, setOwnerNotes] = useState(booking.owner_notes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const duration = differenceInDays(new Date(booking.end_date), new Date(booking.start_date)) + 1;

  // Update booking status
  const updateStatus = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      const updateData: any = { status };
      if (notes !== undefined) {
        updateData.owner_notes = notes;
      }
      const { error } = await supabase
        .from("machinery_bookings")
        .update(updateData)
        .eq("id", booking.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machinery-booking-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      onStatusChange?.();
      toast({ title: "Booking updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit review
  const submitReview = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("machinery_reviews").insert({
        machinery_id: booking.machinery_id,
        booking_id: booking.id,
        reviewer_id: user!.id,
        rating: reviewRating,
        comment: reviewComment || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Review submitted successfully" });
      setShowReviewForm(false);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    updateStatus.mutate({ status: "approved", notes: ownerNotes });
  };

  const handleReject = () => {
    updateStatus.mutate({ status: "rejected", notes: ownerNotes });
  };

  const handleStartProgress = () => {
    updateStatus.mutate({ status: "in_progress" });
  };

  const handleComplete = () => {
    updateStatus.mutate({ status: "completed" });
  };

  const handleCancel = () => {
    updateStatus.mutate({ status: "cancelled" });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { className: string; icon: React.ReactNode; label: string; description: string }> = {
      pending: { 
        className: "bg-warning/20 text-warning border-warning/30", 
        icon: <Clock className="h-4 w-4" />, 
        label: "Pending Approval",
        description: "Waiting for the equipment owner to review this request"
      },
      approved: { 
        className: "bg-success/20 text-success border-success/30", 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: "Approved",
        description: "Booking confirmed! Equipment is reserved for your dates"
      },
      rejected: { 
        className: "bg-destructive/20 text-destructive border-destructive/30", 
        icon: <XCircle className="h-4 w-4" />, 
        label: "Rejected",
        description: "This booking request was declined by the owner"
      },
      in_progress: { 
        className: "bg-primary/20 text-primary border-primary/30", 
        icon: <PlayCircle className="h-4 w-4" />, 
        label: "In Progress",
        description: "Equipment is currently being used"
      },
      completed: { 
        className: "bg-muted text-foreground", 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: "Completed",
        description: "This rental has been successfully completed"
      },
      cancelled: { 
        className: "bg-muted text-muted-foreground", 
        icon: <XCircle className="h-4 w-4" />, 
        label: "Cancelled",
        description: "This booking was cancelled"
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tractor className="h-5 w-5 text-primary" />
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border ${statusConfig.className}`}>
            <div className="flex items-center gap-2 mb-1">
              {statusConfig.icon}
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
            <p className="text-sm opacity-80">{statusConfig.description}</p>
          </div>

          {/* Equipment Info */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
              <img
                src={booking.machinery?.image_urls?.[0] || "/placeholder.svg"}
                alt={booking.machinery?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{booking.machinery?.title || "Equipment"}</h3>
              {booking.machinery?.brand && (
                <p className="text-sm text-muted-foreground">
                  {booking.machinery.brand} {booking.machinery.model && `• ${booking.machinery.model}`}
                </p>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                {booking.machinery?.town ? `${booking.machinery.town}, ` : ""}{booking.machinery?.county}
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Start Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{format(new Date(booking.start_date), "MMMM d, yyyy")}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">End Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{format(new Date(booking.end_date), "MMMM d, yyyy")}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Duration</Label>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="font-medium">{duration} day{duration > 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Total Amount</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium text-lg text-primary">KES {booking.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">
              {userRole === "farmer" ? "Equipment Owner" : "Farmer"}
            </Label>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {userRole === "farmer" 
                      ? booking.owner?.full_name || "Equipment Owner"
                      : booking.farmer?.full_name || "Farmer"
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userRole === "farmer" 
                      ? booking.owner?.location
                      : booking.farmer?.location
                    }
                  </p>
                </div>
              </div>
              {(userRole === "farmer" ? booking.owner?.phone : booking.farmer?.phone) && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${userRole === "farmer" ? booking.owner?.phone : booking.farmer?.phone}`}>
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {(booking.farmer_notes || booking.owner_notes) && (
            <>
              <Separator />
              <div className="space-y-3">
                {booking.farmer_notes && (
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Farmer's Notes</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-xl">
                      <p className="text-sm">{booking.farmer_notes}</p>
                    </div>
                  </div>
                )}
                {booking.owner_notes && (
                  <div>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Owner's Response</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-xl">
                      <p className="text-sm">{booking.owner_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Owner Actions */}
          {userRole === "owner" && booking.status === "pending" && (
            <>
              <Separator />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="owner-notes">Add a note (optional)</Label>
                  <Textarea
                    id="owner-notes"
                    placeholder="Add any notes or instructions for the farmer..."
                    value={ownerNotes}
                    onChange={(e) => setOwnerNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={handleApprove}
                    disabled={updateStatus.isPending}
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve Booking
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                    onClick={handleReject}
                    disabled={updateStatus.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Progress Actions for Owner */}
          {userRole === "owner" && booking.status === "approved" && (
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleStartProgress} disabled={updateStatus.isPending}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Mark as In Progress
              </Button>
            </div>
          )}

          {userRole === "owner" && booking.status === "in_progress" && (
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-success hover:bg-success/90" 
                onClick={handleComplete} 
                disabled={updateStatus.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}

          {/* Farmer Cancel Action */}
          {userRole === "farmer" && booking.status === "pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking Request
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
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Review Form for Completed Bookings */}
          {userRole === "farmer" && booking.status === "completed" && !showReviewForm && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowReviewForm(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Leave a Review
            </Button>
          )}

          {showReviewForm && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Rate Your Experience</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= reviewRating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground hover:text-warning"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div>
                  <Label htmlFor="review-comment">Your Review (optional)</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Share your experience with this equipment..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => submitReview.mutate()}
                    disabled={submitReview.isPending}
                  >
                    {submitReview.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Booking Timeline */}
          <Separator />
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wide">Booking Timeline</Label>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Created: {format(new Date(booking.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
              {booking.updated_at !== booking.created_at && (
                <p>Last Updated: {format(new Date(booking.updated_at), "MMMM d, yyyy 'at' h:mm a")}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
