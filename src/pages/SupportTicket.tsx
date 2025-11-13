import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const ticketSchema = z.object({
  ticket_type: z.string().min(1, "Please select an issue type"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number must be less than 20 characters").optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const SupportTicket = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    ticket_type: "",
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = ticketSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TicketFormData, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof TicketFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user?.id || null,
        ticket_type: formData.ticket_type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        description: formData.description,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Ticket Submitted Successfully!",
        description: "We'll respond within 72 hours",
      });

      // Reset form
      setFormData({
        ticket_type: "",
        name: "",
        email: "",
        phone: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-success/20 shadow-glow-primary">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <CardTitle className="text-3xl">Ticket Submitted Successfully!</CardTitle>
                <CardDescription className="text-lg">
                  Thank you for reaching out. Our support team will review your issue and respond within 72 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">What happens next?</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>You'll receive a confirmation email shortly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Our team will review your ticket</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>We'll respond within 72 hours via email</span>
                    </li>
                  </ul>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => navigate("/support")} variant="outline" className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Support
                  </Button>
                  <Button onClick={() => setIsSuccess(false)} variant="default" className="flex-1">
                    Submit Another Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/support")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Button>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-3xl">Submit Issue or Complaint</CardTitle>
              <CardDescription>
                Please provide detailed information about your issue. Our support team will get back to you within 72 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ticket_type">Issue Type *</Label>
                  <Select
                    value={formData.ticket_type}
                    onValueChange={(value) => setFormData({ ...formData, ticket_type: value })}
                  >
                    <SelectTrigger className={errors.ticket_type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Payment</SelectItem>
                      <SelectItem value="marketplace">Marketplace Problem</SelectItem>
                      <SelectItem value="account">Account & Profile</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="complaint">General Complaint</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ticket_type && (
                    <p className="text-sm text-destructive">{errors.ticket_type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Issue Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or relevant information..."
                    rows={8}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/2000 characters
                  </p>
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">
                    Our support team typically responds within <span className="font-semibold text-foreground">72 hours</span>. 
                    For urgent issues, please call our support hotline.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportTicket;
