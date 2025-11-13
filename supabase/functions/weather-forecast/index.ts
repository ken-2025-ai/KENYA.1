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
    const weatherApiKey = Deno.env.get('WEATHERAPI_KEY');

    if (!weatherApiKey) {
      throw new Error('WEATHERAPI_KEY not configured');
    }

    console.log(`Fetching weather for location: ${location}`);

    // Get current weather and 5-day forecast in one call
    const weatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=yes`;
    console.log(`WeatherAPI URL: ${weatherUrl.replace(weatherApiKey, 'HIDDEN')}`);
    
    const apiResponse = await fetch(weatherUrl);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`WeatherAPI error: ${apiResponse.status} - ${errorText}`);
      throw new Error(`Weather API error: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    
    const weatherData = await apiResponse.json();
    console.log(`Weather data received for: ${weatherData.location.name}, ${weatherData.location.country}`);

    // Map weather condition to simple strings
    const mapCondition = (conditionText: string): string => {
      const text = conditionText.toLowerCase();
      if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) return 'rainy';
      if (text.includes('snow') || text.includes('sleet') || text.includes('blizzard')) return 'snowy';
      if (text.includes('cloud') || text.includes('overcast')) return 'cloudy';
      if (text.includes('clear') || text.includes('sunny')) return 'sunny';
      if (text.includes('partly')) return 'partly-cloudy';
      return 'sunny';
    };

    // Process forecast data
    const forecast = weatherData.forecast.forecastday.map((day: any, index: number) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const displayDay = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayName;
      
      return {
        day: displayDay,
        high: Math.round(day.day.maxtemp_c),
        low: Math.round(day.day.mintemp_c),
        condition: mapCondition(day.day.condition.text),
        rain: Math.round(day.day.daily_chance_of_rain)
      };
    });

    // Generate farming tips based on weather
    const farmingTips: string[] = [];
    const currentTemp = Math.round(weatherData.current.temp_c);
    const humidity = weatherData.current.humidity;
    const windSpeed = Math.round(weatherData.current.wind_kph);

    if (currentTemp > 15 && currentTemp < 25 && humidity > 50) {
      farmingTips.push("Perfect weather for maize planting - soil moisture is ideal");
    }
    
    const upcomingRain = forecast.some((day: any) => day.rain > 60);
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
    
    const heavyRain = forecast.find((day: any) => day.rain > 70);
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

    // Add any weather alerts from the API
    if (weatherData.alerts && weatherData.alerts.alert && weatherData.alerts.alert.length > 0) {
      weatherData.alerts.alert.forEach((alert: any) => {
        alerts.push({
          type: "warning",
          message: alert.headline || alert.event
        });
      });
    }

    const weatherResponse: WeatherResponse = {
      location: `${weatherData.location.name}, ${weatherData.location.country}`,
      temperature: currentTemp,
      condition: mapCondition(weatherData.current.condition.text),
      humidity,
      windSpeed,
      visibility: Math.round(weatherData.current.vis_km),
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
