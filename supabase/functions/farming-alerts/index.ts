import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FarmingAlert {
  type: 'planting' | 'harvest' | 'irrigation' | 'weather' | 'market';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timing: string;
  action?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, latitude, longitude } = await req.json();
    
    if (!location) {
      throw new Error('Location is required');
    }

    console.log(`Generating farming alerts for: ${location} (${latitude}, ${longitude})`);

    // Get weather data
    const weatherApiKey = Deno.env.get('WEATHERAPI_KEY');
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured');
    }

    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=yes`
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    const alerts: FarmingAlert[] = [];

    // Current weather analysis
    const current = weatherData.current;
    const forecast = weatherData.forecast.forecastday;
    
    // Get current month for seasonal recommendations
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // Seasonal planting recommendations for Kenya
    const plantingSeasons = {
      longRains: [3, 4, 5], // March-May
      shortRains: [10, 11, 12], // October-December
    };

    const harvestSeasons = {
      longRainsHarvest: [7, 8, 9], // July-September (after long rains)
      shortRainsHarvest: [1, 2], // January-February (after short rains)
    };

    // Check planting season
    if (plantingSeasons.longRains.includes(currentMonth)) {
      alerts.push({
        type: 'planting',
        title: '🌱 Long Rains Planting Season',
        message: `This is the ideal time for planting maize, beans, and vegetables in ${location}. The long rains provide excellent conditions for crop establishment.`,
        priority: 'high',
        timing: 'Next 2-4 weeks',
        action: 'Prepare your fields and start planting'
      });
    } else if (plantingSeasons.shortRains.includes(currentMonth)) {
      alerts.push({
        type: 'planting',
        title: '🌱 Short Rains Planting Season',
        message: `Short rains season is here in ${location}. Good time for planting quick-maturing crops like beans, peas, and vegetables.`,
        priority: 'high',
        timing: 'Next 2-3 weeks',
        action: 'Start planting short-season crops'
      });
    }

    // Check harvest season
    if (harvestSeasons.longRainsHarvest.includes(currentMonth)) {
      alerts.push({
        type: 'harvest',
        title: '🌾 Harvest Season Approaching',
        message: `Long rains crops should be ready for harvest in ${location}. Monitor maize moisture content and prepare storage facilities.`,
        priority: 'high',
        timing: 'Next 2-4 weeks',
        action: 'Prepare harvesting equipment and storage'
      });
    } else if (harvestSeasons.shortRainsHarvest.includes(currentMonth)) {
      alerts.push({
        type: 'harvest',
        title: '🌾 Harvest Time',
        message: `Short rains crops are ready for harvest in ${location}. Ensure proper drying and storage to prevent post-harvest losses.`,
        priority: 'high',
        timing: 'Now',
        action: 'Begin harvesting operations'
      });
    }

    // Drought warning (if low rainfall expected)
    let totalRainfall = 0;
    forecast.forEach((day: any) => {
      totalRainfall += day.day.totalprecip_mm;
    });

    if (totalRainfall < 10) { // Less than 10mm in next 7 days
      alerts.push({
        type: 'weather',
        title: '☀️ Drought Alert - Irrigation Needed',
        message: `Low rainfall expected in ${location} for the next week (${totalRainfall.toFixed(1)}mm total). Your crops will need irrigation to survive.`,
        priority: 'high',
        timing: 'Immediate action required',
        action: 'Prepare irrigation systems'
      });
    }

    // Heavy rain warning
    forecast.forEach((day: any, index: number) => {
      if (day.day.totalprecip_mm > 30) {
        alerts.push({
          type: 'weather',
          title: '🌧️ Heavy Rain Warning',
          message: `Heavy rainfall expected in ${location} on ${day.date} (${day.day.totalprecip_mm.toFixed(1)}mm). Ensure proper drainage to prevent waterlogging.`,
          priority: 'high',
          timing: index === 0 ? 'Today' : `In ${index} day${index > 1 ? 's' : ''}`,
          action: 'Check and clear drainage channels'
        });
      }
    });

    // Temperature-based alerts
    const highTemp = Math.max(...forecast.map((d: any) => d.day.maxtemp_c));
    const lowTemp = Math.min(...forecast.map((d: any) => d.day.mintemp_c));

    if (highTemp > 35) {
      alerts.push({
        type: 'weather',
        title: '🌡️ High Temperature Alert',
        message: `Very high temperatures expected in ${location} (up to ${highTemp}°C). Increase watering frequency and provide shade for sensitive crops.`,
        priority: 'medium',
        timing: 'Next 7 days',
        action: 'Adjust irrigation schedule'
      });
    }

    if (lowTemp < 10) {
      alerts.push({
        type: 'weather',
        title: '❄️ Cold Weather Alert',
        message: `Cold temperatures expected in ${location} (down to ${lowTemp}°C). Protect sensitive crops from frost damage.`,
        priority: 'medium',
        timing: 'Next 7 days',
        action: 'Cover sensitive plants'
      });
    }

    // Market timing advice based on harvest predictions
    const isHarvestSeason = [...harvestSeasons.longRainsHarvest, ...harvestSeasons.shortRainsHarvest].includes(currentMonth);
    if (isHarvestSeason) {
      alerts.push({
        type: 'market',
        title: '📊 Market Timing Advice',
        message: `Harvest season in ${location} may lead to lower prices due to increased supply. Consider storage or value addition to get better prices.`,
        priority: 'medium',
        timing: 'Consider for this season',
        action: 'Plan your marketing strategy'
      });
    }

    // Pest and disease warning (based on humidity and temperature)
    const avgHumidity = forecast.reduce((sum: number, d: any) => sum + d.day.avghumidity, 0) / forecast.length;
    const avgTemp = forecast.reduce((sum: number, d: any) => sum + d.day.avgtemp_c, 0) / forecast.length;

    if (avgHumidity > 70 && avgTemp > 20 && avgTemp < 30) {
      alerts.push({
        type: 'weather',
        title: '🐛 Pest & Disease Risk',
        message: `High humidity (${avgHumidity.toFixed(0)}%) and moderate temperatures in ${location} create favorable conditions for pests and diseases. Monitor your crops closely.`,
        priority: 'medium',
        timing: 'Next 7 days',
        action: 'Inspect crops and prepare pest control measures'
      });
    }

    // Weather API alerts
    if (weatherData.alerts && weatherData.alerts.alert && weatherData.alerts.alert.length > 0) {
      weatherData.alerts.alert.forEach((alert: any) => {
        alerts.push({
          type: 'weather',
          title: `⚠️ ${alert.event}`,
          message: alert.desc || alert.headline,
          priority: 'high',
          timing: 'Check forecast',
          action: 'Take necessary precautions'
        });
      });
    }

    return new Response(
      JSON.stringify({
        location,
        alerts,
        weatherSummary: {
          current: {
            temp: current.temp_c,
            condition: current.condition.text,
            humidity: current.humidity,
            rainfall: current.precip_mm
          },
          forecast: forecast.map((d: any) => ({
            date: d.date,
            maxTemp: d.day.maxtemp_c,
            minTemp: d.day.mintemp_c,
            rainfall: d.day.totalprecip_mm,
            condition: d.day.condition.text
          }))
        },
        generatedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating farming alerts:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        alerts: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
