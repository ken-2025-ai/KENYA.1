import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Upload, X, Tractor } from "lucide-react";

interface AddMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu",
  "Kiambu", "Machakos", "Kajiado", "Nyeri", "Meru",
  "Kakamega", "Bungoma", "Trans Nzoia", "Nandi", "Kericho",
  "Bomet", "Narok", "Laikipia", "Nyandarua", "Muranga",
  "Kirinyaga", "Embu", "Tharaka Nithi", "Isiolo", "Marsabit",
  "Samburu", "Turkana", "West Pokot", "Elgeyo Marakwet", "Baringo",
  "Kitui", "Makueni", "Taita Taveta", "Kwale", "Kilifi",
  "Tana River", "Lamu", "Garissa", "Wajir", "Mandera",
  "Siaya", "Kisii", "Nyamira", "Migori", "Homa Bay", "Vihiga", "Busia",
];

const MACHINERY_CATEGORIES = [
  { value: "tractor", label: "Tractor" },
  { value: "harvester", label: "Harvester" },
  { value: "plough", label: "Plough" },
  { value: "sprayer", label: "Sprayer" },
  { value: "pump", label: "Pump" },
  { value: "seeder", label: "Seeder" },
  { value: "thresher", label: "Thresher" },
  { value: "trailer", label: "Trailer" },
  { value: "other", label: "Other" },
];

const RENTAL_PERIODS = [
  { value: "hourly", label: "Per Hour" },
  { value: "daily", label: "Per Day" },
  { value: "weekly", label: "Per Week" },
  { value: "per_acre", label: "Per Acre" },
];

const AddMachineryModal = ({ isOpen, onClose, onSuccess }: AddMachineryModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tractor",
    brand: "",
    model: "",
    year_manufactured: "",
    horsepower: "",
    capacity: "",
    rental_rate: "",
    rental_period: "daily",
    county: "",
    town: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls((prev) => [...prev, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to list equipment",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.county || !formData.rental_rate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("machinery_listings").insert({
        owner_id: user.id,
        title: formData.title,
        description: formData.description || null,
        category: formData.category as any,
        brand: formData.brand || null,
        model: formData.model || null,
        year_manufactured: formData.year_manufactured ? parseInt(formData.year_manufactured) : null,
        horsepower: formData.horsepower ? parseInt(formData.horsepower) : null,
        capacity: formData.capacity || null,
        rental_rate: parseFloat(formData.rental_rate),
        rental_period: formData.rental_period as any,
        county: formData.county,
        town: formData.town || null,
        image_urls: imageUrls,
      });

      if (error) throw error;

      // Update profile to mark as equipment owner
      await supabase
        .from("profiles")
        .update({ is_equipment_owner: true })
        .eq("user_id", user.id);

      toast({
        title: "Equipment Listed!",
        description: "Your machinery is now visible to farmers.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "tractor",
        brand: "",
        model: "",
        year_manufactured: "",
        horsepower: "",
        capacity: "",
        rental_rate: "",
        rental_period: "daily",
        county: "",
        town: "",
      });
      setImageUrls([]);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Listing Failed",
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tractor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>List Your Equipment</DialogTitle>
              <DialogDescription>
                Add your farm machinery for farmers to rent
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Equipment Name *</Label>
              <Input
                id="title"
                placeholder="e.g., John Deere 5055E Tractor"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MACHINERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., John Deere"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., 5055E"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2020"
                  value={formData.year_manufactured}
                  onChange={(e) => handleInputChange("year_manufactured", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horsepower">Horsepower</Label>
                <Input
                  id="horsepower"
                  type="number"
                  placeholder="55"
                  value={formData.horsepower}
                  onChange={(e) => handleInputChange("horsepower", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the equipment condition, features, and any additional services included..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h4 className="font-medium">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rental_rate">Rental Rate (KES) *</Label>
                <Input
                  id="rental_rate"
                  type="number"
                  placeholder="5000"
                  value={formData.rental_rate}
                  onChange={(e) => handleInputChange("rental_rate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rental_period">Rental Period *</Label>
                <Select
                  value={formData.rental_period}
                  onValueChange={(value) => handleInputChange("rental_period", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RENTAL_PERIODS.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-medium">Location</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="county">County *</Label>
                <Select
                  value={formData.county}
                  onValueChange={(value) => handleInputChange("county", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {KENYA_COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="town">Town</Label>
                <Input
                  id="town"
                  placeholder="e.g., Eldoret"
                  value={formData.town}
                  onChange={(e) => handleInputChange("town", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h4 className="font-medium">Images</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Paste image URL..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Equipment ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Listing...
                </>
              ) : (
                "List Equipment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMachineryModal;