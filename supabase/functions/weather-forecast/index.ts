import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherResponse {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');

    if (!openWeatherApiKey) {
      throw new Error('OPENWEATHER_API_KEY not configured');
    }

    console.log(`Fetching weather for location: ${location}`);

    // Get coordinates from location name
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${openWeatherApiKey}`;
    console.log(`Geocoding URL: ${geoUrl}`);
    
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      throw new Error(`Geocoding API error: ${geoResponse.status} ${geoResponse.statusText}`);
    }
    
    const geoData = await geoResponse.json();
    console.log(`Geocoding response:`, JSON.stringify(geoData));

    if (!geoData || !Array.isArray(geoData) || geoData.length === 0) {
      throw new Error(`Location "${location}" not found. Please try a different location or be more specific (e.g., "Nairobi, Kenya")`);
    }

    const { lat, lon, name, country } = geoData[0];
    console.log(`Found coordinates: ${lat}, ${lon} for ${name}, ${country}`);

    // Get current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();

    // Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Map weather condition codes to simple strings
    const mapCondition = (code: number): string => {
      if (code >= 200 && code < 300) return 'rainy';
      if (code >= 300 && code < 600) return 'rainy';
      if (code >= 600 && code < 700) return 'snowy';
      if (code >= 700 && code < 800) return 'cloudy';
      if (code === 800) return 'sunny';
      if (code > 800) return 'partly-cloudy';
      return 'sunny';
    };

    // Process forecast data - get one forecast per day
    const dailyForecasts: any = {};
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = {
          temps: [],
          conditions: [],
          rain: 0
        };
      }
      
      dailyForecasts[dayKey].temps.push(item.main.temp);
      dailyForecasts[dayKey].conditions.push(item.weather[0].id);
      if (item.rain) {
        dailyForecasts[dayKey].rain = Math.max(dailyForecasts[dayKey].rain, (item.pop || 0) * 100);
      }
    });

    // Get today and next 4 days
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const dayNames = Object.keys(dailyForecasts);
    const forecast = dayNames.slice(0, 5).map((day, index) => {
      const data = dailyForecasts[day];
      const displayDay = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day;
      
      return {
        day: displayDay,
        high: Math.round(Math.max(...data.temps)),
        low: Math.round(Math.min(...data.temps)),
        condition: mapCondition(Math.round(data.conditions.reduce((a: number, b: number) => a + b) / data.conditions.length)),
        rain: Math.round(data.rain)
      };
    });

    // Generate farming tips based on weather
    const farmingTips: string[] = [];
    const currentTemp = Math.round(currentData.main.temp);
    const humidity = currentData.main.humidity;
    const windSpeed = Math.round(currentData.wind.speed * 3.6); // Convert m/s to km/h

    if (currentTemp > 15 && currentTemp < 25 && humidity > 50) {
      farmingTips.push("Perfect weather for maize planting - soil moisture is ideal");
    }
    
    const upcomingRain = forecast.some(day => day.rain > 60);
    if (upcomingRain) {
      farmingTips.push("Consider harvesting mature vegetables before heavy rainfall");
    } else if (humidity < 40) {
      farmingTips.push("Low humidity detected - ensure adequate irrigation for crops");
    }

    if (currentTemp > 20 && currentTemp < 28) {
      farmingTips.push("Good time to apply organic fertilizer to leafy greens");
    }

    if (humidity > 70) {
      farmingTips.push("Monitor for pest activity with increasing humidity");
    }

    if (windSpeed < 15) {
      farmingTips.push("Calm conditions ideal for applying pesticides or fertilizers");
    }

    // Generate alerts based on weather
    const alerts: Array<{ type: "warning" | "info", message: string }> = [];
    
    const heavyRain = forecast.find(day => day.rain > 70);
    if (heavyRain) {
      alerts.push({
        type: "warning",
        message: `Heavy rainfall expected ${heavyRain.day.toLowerCase()} - protect young seedlings`
      });
    }

    if (currentTemp < 10) {
      alerts.push({
        type: "warning",
        message: "Low temperatures may affect crop growth - consider protective measures"
      });
    }

    if (currentTemp > 20 && currentTemp < 28 && humidity > 40 && humidity < 80 && !upcomingRain) {
      alerts.push({
        type: "info",
        message: "Optimal planting conditions for the next 48 hours"
      });
    }

    if (windSpeed > 30) {
      alerts.push({
        type: "warning",
        message: "High wind speeds detected - secure loose structures and greenhouses"
      });
    }

    const weatherResponse: WeatherResponse = {
      location: `${name}, ${country}`,
      temperature: currentTemp,
      condition: mapCondition(currentData.weather[0].id),
      humidity,
      windSpeed,
      visibility: Math.round(currentData.visibility / 1000),
      forecast,
      farmingTips,
      alerts
    };

    console.log('Weather data processed successfully');

    return new Response(
      JSON.stringify(weatherResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching weather:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch weather data' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
