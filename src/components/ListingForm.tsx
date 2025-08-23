import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Package } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const listingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price_per_unit: z.number().min(0.01, "Price must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  quantity_available: z.number().min(1, "Quantity must be at least 1"),
  location: z.string().min(1, "Location is required"),
  harvest_date: z.date().optional(),
  expiry_date: z.date().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editListing?: {
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
  };
  isEditing?: boolean;
}

const categories = [
  "Fruits",
  "Vegetables", 
  "Grains",
  "Legumes",
  "Dairy",
  "Livestock",
  "Other"
];

const units = ["kg", "tons", "pieces", "bags", "liters"];

export const ListingForm = ({ isOpen, onClose, onSuccess, editListing, isEditing = false }: ListingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: editListing?.title || "",
      description: editListing?.description || "",
      category: editListing?.category || "",
      price_per_unit: editListing?.price_per_unit || 0,
      unit: editListing?.unit || "kg",
      quantity_available: editListing?.quantity_available || 1,
      location: editListing?.location || "",
      harvest_date: editListing?.harvest_date ? new Date(editListing.harvest_date) : undefined,
      expiry_date: editListing?.expiry_date ? new Date(editListing.expiry_date) : undefined,
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (isEditing && editListing) {
        const { error } = await supabase
          .from("market_listings")
          .update({
            title: data.title,
            description: data.description || null,
            category: data.category,
            price_per_unit: data.price_per_unit,
            unit: data.unit,
            quantity_available: data.quantity_available,
            location: data.location,
            harvest_date: data.harvest_date ? data.harvest_date.toISOString().split('T')[0] : null,
            expiry_date: data.expiry_date ? data.expiry_date.toISOString().split('T')[0] : null,
          })
          .eq('id', editListing.id);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your listing has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("market_listings")
          .insert({
            title: data.title,
            description: data.description || null,
            category: data.category,
            price_per_unit: data.price_per_unit,
            unit: data.unit,
            quantity_available: data.quantity_available,
            location: data.location,
            harvest_date: data.harvest_date ? data.harvest_date.toISOString().split('T')[0] : null,
            expiry_date: data.expiry_date ? data.expiry_date.toISOString().split('T')[0] : null,
            user_id: user.id,
            is_active: true,
          });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your listing has been created successfully.",
        });
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: isEditing ? "Error updating listing" : "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {isEditing ? "Edit Listing" : "Create New Listing"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fresh Tomatoes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Unit (KSh)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity_available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Available</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nairobi, Kenya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="harvest_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harvest Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your produce, quality, farming methods, etc."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isSubmitting}>
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Listing" : "Create Listing")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};