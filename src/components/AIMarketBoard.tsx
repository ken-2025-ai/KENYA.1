import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, Bot, MapPin, Clock, Star, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketPrice {
  location: string;
  market: string;
  price: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: string;
  quality: string;
  availability: string;
}

interface MarketData {
  crop: string;
  prices: MarketPrice[];
  lastUpdated: string;
}

const crops = [
  { value: "maize", label: "Maize", emoji: "🌽" },
  { value: "beans", label: "Beans", emoji: "🫘" },
  { value: "rice", label: "Rice", emoji: "🌾" },
  { value: "wheat", label: "Wheat", emoji: "🌾" },
  { value: "tomatoes", label: "Tomatoes", emoji: "🍅" },
  { value: "onions", label: "Onions", emoji: "🧅" },
  { value: "potatoes", label: "Potatoes", emoji: "🥔" },
  { value: "cabbage", label: "Cabbage", emoji: "🥬" },
  { value: "carrots", label: "Carrots", emoji: "🥕" },
  { value: "bananas", label: "Bananas", emoji: "🍌" },
  { value: "mangoes", label: "Mangoes", emoji: "🥭" },
  { value: "avocados", label: "Avocados", emoji: "🥑" },
  { value: "coffee", label: "Coffee", emoji: "☕" },
  { value: "tea", label: "Tea", emoji: "🍃" },
  { value: "sugarcane", label: "Sugarcane", emoji: "🎋" }
];

const kenyanCities = [
  { value: "nairobi", label: "Nairobi" },
  { value: "mombasa", label: "Mombasa" },
  { value: "kisumu", label: "Kisumu" },
  { value: "nakuru", label: "Nakuru" },
  { value: "eldoret", label: "Eldoret" },
  { value: "thika", label: "Thika" },
  { value: "malindi", label: "Malindi" },
  { value: "kitale", label: "Kitale" },
  { value: "garissa", label: "Garissa" },
  { value: "kakamega", label: "Kakamega" },
  { value: "machakos", label: "Machakos" },
  { value: "meru", label: "Meru" }
];

export const AIMarketBoard = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMarketPrices = async (crop: string, city: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-market-prices', {
        body: { crop, city }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch market prices. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setMarketData(data);
      toast({
        title: "Market Prices Updated",
        description: `Successfully fetched ${crop} prices in ${city} from AI market analysis.`,
      });
    } catch (error) {
      console.error('Error fetching market prices:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop);
    if (selectedCity) {
      fetchMarketPrices(crop, selectedCity);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    if (selectedCrop) {
      fetchMarketPrices(selectedCrop, city);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityColor = (quality: string) => {
    switch(quality.toLowerCase()) {
      case 'grade a': return 'default';
      case 'grade b': return 'secondary';
      default: return 'outline';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch(availability.toLowerCase()) {
      case 'high': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'low': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Bot className="w-12 h-12 text-primary" />
              <Sparkles className="w-5 h-5 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              AI Market Intelligence
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get real-time crop prices powered by AI across all major Kenyan markets. 
            Select a crop to see current market rates and trends.
          </p>
        </div>

        {/* City and Crop Selectors */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Selector */}
            <div className="relative">
              <Select value={selectedCity} onValueChange={handleCitySelect}>
                <SelectTrigger className="h-14 text-lg bg-background/80 border-2 border-accent/20 hover:border-accent/40 transition-smooth">
                  <SelectValue placeholder="📍 Select City" />
                </SelectTrigger>
                <SelectContent className="bg-background border-2 border-accent/20">
                  {kenyanCities.map((city) => (
                    <SelectItem key={city.value} value={city.value} className="text-lg hover:bg-accent/5">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{city.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Crop Selector */}
            <div className="relative">
              <Select value={selectedCrop} onValueChange={handleCropSelect}>
                <SelectTrigger className="h-14 text-lg bg-background/80 border-2 border-primary/20 hover:border-primary/40 transition-smooth">
                  <SelectValue placeholder="🌾 Select Crop" />
                </SelectTrigger>
                <SelectContent className="bg-background border-2 border-primary/20">
                  {crops.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value} className="text-lg hover:bg-primary/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crop.emoji}</span>
                        <span>{crop.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                </div>
              )}
            </div>
          </div>
          
          {(!selectedCity || !selectedCrop) && (
            <div className="text-center text-sm text-muted-foreground animate-pulse">
              👆 Select both city and crop to view market prices
            </div>
          )}
        </div>

        {/* Market Data Display */}
        {marketData && (
          <div className="max-w-7xl mx-auto animate-slide-up">
            <Card className="mb-8 bg-gradient-primary text-primary-foreground shadow-large">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl flex items-center justify-center gap-3">
                  <span className="text-4xl">
                    {crops.find(c => c.value === selectedCrop)?.emoji}
                  </span>
                  {marketData.crop.charAt(0).toUpperCase() + marketData.crop.slice(1)} Market Prices
                </CardTitle>
                <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {formatLastUpdated(marketData.lastUpdated)}</span>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.prices.map((price, index) => (
                <Card 
                  key={`${price.location}-${index}`}
                  className="group cursor-pointer transition-smooth hover:shadow-large hover:-translate-y-1 bg-card/90 backdrop-blur-sm border-border/50 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">{price.location}</span>
                      </div>
                      <Badge 
                        variant={getQualityColor(price.quality) as "default" | "secondary" | "outline"}
                        className="text-xs"
                      >
                        {price.quality}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-muted-foreground font-medium">
                      {price.market}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">
                        KSh {price.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {price.unit}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(price.trend)}
                        <span className={`font-medium ${getTrendColor(price.trend)}`}>
                          {price.change}
                        </span>
                      </div>
                      <Badge 
                        className={`text-xs ${getAvailabilityColor(price.availability)}`}
                      >
                        {price.availability} Stock
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Star className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs text-primary hover:bg-primary/10"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Bot className="w-4 h-4" />
                <span>Prices generated by AI market analysis • Updated in real-time</span>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!marketData && !loading && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="relative mb-6">
              <Bot className="w-20 h-20 text-muted-foreground mx-auto" />
              <Sparkles className="w-6 h-6 text-accent absolute top-0 right-1/3 animate-pulse" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Ready to Analyze Markets
            </h3>
            <p className="text-muted-foreground mb-4">
              Select both a city and a crop above to get AI-powered market intelligence and real-time pricing data.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Choose Location</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌾</span>
                <span>Pick Crop</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};