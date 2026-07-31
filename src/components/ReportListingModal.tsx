import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flag, Loader2, ShieldAlert } from "lucide-react";

export type ReportTargetType = "market_listing" | "machinery_listing" | "user";

type ReportReason =
  | "scam"
  | "fake_listing"
  | "misleading_price"
  | "spam"
  | "inappropriate"
  | "no_response"
  | "counterfeit"
  | "other";

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: "scam", label: "Scam or fraud", hint: "Asked for money and never delivered" },
  { value: "fake_listing", label: "Fake listing", hint: "Product or equipment does not exist" },
  { value: "misleading_price", label: "Misleading price", hint: "Price shown is not the real price" },
  { value: "counterfeit", label: "Poor or counterfeit quality", hint: "Not what was advertised" },
  { value: "spam", label: "Spam or duplicate", hint: "Posted many times or irrelevant" },
  { value: "inappropriate", label: "Abusive or inappropriate", hint: "Offensive language or behaviour" },
  { value: "no_response", label: "Farmer never responds", hint: "Contact details do not work" },
  { value: "other", label: "Other", hint: "Describe the issue below" },
];

interface ReportListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string | null;
  reportedUserId?: string | null;
}

export const ReportListingModal = ({
  open,
  onOpenChange,
  targetType,
  targetId,
  targetTitle,
  reportedUserId,
}: ReportListingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setReason("");
    setDetails("");
    setEmail("");
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: "Choose a reason", description: "Please select why you are reporting this.", variant: "destructive" });
      return;
    }
    if (details.trim().length > 1000) {
      toast({ title: "Too long", description: "Keep details under 1000 characters.", variant: "destructive" });
      return;
    }
    if (reason === "other" && details.trim().length < 10) {
      toast({ title: "Add more detail", description: "Please describe the issue (at least 10 characters).", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("listing_reports").insert({
      reporter_id: user?.id ?? null,
      target_type: targetType,
      target_id: targetId,
      reported_user_id: reportedUserId ?? null,
      target_title: targetTitle ?? null,
      reason,
      details: details.trim() || null,
      contact_email: email.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Could not send report", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Report submitted",
      description: "Thank you. Our team will review this listing shortly.",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Report {targetType === "user" ? "farmer" : "listing"}
          </DialogTitle>
          <DialogDescription>
            {targetTitle ? `"${targetTitle}" — ` : ""}
            Tell us what is wrong. Reports are confidential and help keep the marketplace safe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)} className="space-y-1">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  htmlFor={`reason-${r.value}`}
                  className="flex items-start gap-3 rounded-lg border border-border p-2.5 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <RadioGroupItem value={r.value} id={`reason-${r.value}`} className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">{r.label}</span>
                    <span className="block text-xs text-muted-foreground">{r.hint}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-details">What happened? (optional)</Label>
            <Textarea
              id="report-details"
              placeholder="Share any details, dates or amounts that help us investigate..."
              value={details}
              maxLength={1000}
              rows={4}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="report-email">Your email (optional)</Label>
              <Input
                id="report-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
              ) : (
                <><Flag className="h-4 w-4 mr-2" /> Submit report</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportListingModal;
