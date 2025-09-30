import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  MapPin,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    rain: number;
  }>;
  farmingTips: string[];
  alerts: Array<{
    type: "warning" | "info";
    message: string;
  }>;
}

export const WeatherWidget = ({ userLocation }: { userLocation?: string }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);
      console.log('Fetching weather for:', location);
      
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: { location }
      });

      if (error) throw error;

      setWeather(data);
      setLastUpdated(new Date());
      console.log('Weather data received:', data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: "Weather Fetch Failed",
        description: "Could not retrieve weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const location = userLocation || "Eldoret, Kenya";
    fetchWeather(location);
  }, [userLocation]);

  const refreshWeather = () => {
    const location = userLocation || weather?.location || "Eldoret, Kenya";
    fetchWeather(location);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return <Sun className="w-8 h-8 text-yellow-500" />;
      case "partly-cloudy": return <Cloud className="w-8 h-8 text-blue-400" />;
      case "rainy": return <CloudRain className="w-8 h-8 text-blue-600" />;
      case "cloudy": return <Cloud className="w-8 h-8 text-gray-500" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "sunny": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "partly-cloudy": return "bg-blue-100 text-blue-800 border-blue-200";
      case "rainy": return "bg-blue-200 text-blue-900 border-blue-300";
      case "cloudy": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!weather) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      <Card className="glass-card border-primary/20 hover:shadow-glow-primary transition-smooth animate-bounce-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                Weather Forecast
              </CardTitle>
              <p className="text-sm text-muted-foreground">{weather.location}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshWeather}
              disabled={loading}
              className="text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="text-4xl font-bold text-primary">
                  {weather.temperature}°C
                </div>
                <Badge className={`${getConditionColor(weather.condition)} mt-2`}>
                  {weather.condition.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <span>{weather.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wind className="w-4 h-4" />
                <span>{weather.windSpeed} km/h wind</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{weather.visibility} km visibility</span>
              </div>
            </div>
          </div>

          {/* Weather Alerts */}
          {weather.alerts.length > 0 && (
            <div className="space-y-2">
              {weather.alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    alert.type === 'warning' 
                      ? 'bg-warning/10 text-warning border border-warning/20' 
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* 5-Day Forecast */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day, index) => (
                <div 
                  key={index}
                  className="text-center p-3 rounded-lg bg-gradient-card hover:bg-gradient-glass transition-smooth animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    {day.day}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-destructive" />
                      <span className="font-semibold">{day.high}°</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <TrendingDown className="w-3 h-3 text-primary" />
                      <span>{day.low}°</span>
                    </div>
                    {day.rain > 0 && (
                      <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                        <Droplets className="w-3 h-3" />
                        <span>{day.rain}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farming Tips Card */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Thermometer className="w-5 h-5" />
            Smart Farming Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weather.farmingTips.map((tip, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-success/10 border border-success/20 hover:bg-gradient-success/20 transition-smooth"
              >
                <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Last updated: {lastUpdated.toLocaleTimeString('en-KE')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};