import { Navigation } from "@/components/Navigation";
import { FarmingAssistant } from "@/components/FarmingAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Wind, Thermometer, Droplets, AlertCircle, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function WeatherClimate() {
  const navigate = useNavigate();

  const topics = [
    {
      icon: CloudRain,
      title: "Rainfall Patterns",
      description: "Understand Kenya's bi-modal rainfall and plan your farming calendar accordingly.",
      tips: ["Long rains: March-May", "Short rains: Oct-Dec", "Monitor forecasts weekly"]
    },
    {
      icon: Sun,
      title: "Seasonal Planning",
      description: "Align your planting and harvesting with seasonal changes for optimal results.",
      tips: ["Plant before rains", "Prepare land early", "Stagger planting dates"]
    },
    {
      icon: Thermometer,
      title: "Temperature Management",
      description: "Learn how temperature affects crop growth and implement protective measures.",
      tips: ["Mulch to regulate soil temp", "Shade young plants", "Choose heat-tolerant varieties"]
    },
    {
      icon: Droplets,
      title: "Drought Preparedness",
      description: "Implement strategies to survive and thrive during dry spells.",
      tips: ["Water harvesting systems", "Drought-resistant crops", "Moisture retention techniques"]
    },
    {
      icon: Wind,
      title: "Climate Adaptation",
      description: "Adapt to changing climate patterns with resilient farming practices.",
      tips: ["Diversify crop selection", "Invest in irrigation", "Use climate forecasts"]
    },
    {
      icon: AlertCircle,
      title: "Weather Alerts",
      description: "Stay informed about extreme weather events and protect your crops.",
      tips: ["Subscribe to SMS alerts", "Monitor local forecasts", "Have emergency plans"]
    }
  ];

  const kenyanSeasons = [
    {
      name: "Long Rains",
      period: "March - May",
      color: "bg-blue-500",
      crops: "Maize, Beans, Vegetables",
      tips: "Main growing season, prepare land in February"
    },
    {
      name: "Dry Season",
      period: "June - September",
      color: "bg-orange-500",
      crops: "Irrigation crops, Harvesting",
      tips: "Focus on irrigation, harvest and store produce"
    },
    {
      name: "Short Rains",
      period: "October - December",
      color: "bg-teal-500",
      crops: "Quick-maturing varieties",
      tips: "Plant fast-maturing crops, supplement with irrigation"
    },
    {
      name: "Dry Season",
      period: "January - February",
      color: "bg-yellow-600",
      crops: "Irrigated farming",
      tips: "Prepare for long rains, focus on soil preparation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/learn')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learn
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4">
            <CloudRain className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Weather & Climate
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master weather patterns and climate adaptation for successful farming in Kenya
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kenyan Seasons Overview */}
            <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  Kenya's Farming Seasons
                </CardTitle>
                <CardDescription>
                  Understanding our unique bi-modal rainfall pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {kenyanSeasons.map((season, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${season.color}`} />
                        <h4 className="font-semibold">{season.name}</h4>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 space-y-2 text-sm">
                        <p><span className="font-medium">Period:</span> {season.period}</p>
                        <p><span className="font-medium">Crops:</span> {season.crops}</p>
                        <p className="text-muted-foreground">{season.tips}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Topics Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Essential Topics
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {topics.map((topic, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                        <topic.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Key Tips:</p>
                        {topic.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Climate Change Tips */}
            <Card className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border-2 border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Climate Change Adaptation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-500 flex-shrink-0">Water</Badge>
                  <p className="text-sm">Install rainwater harvesting systems to capture rainfall during wet seasons</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-500 flex-shrink-0">Crops</Badge>
                  <p className="text-sm">Plant drought-resistant crop varieties suited for unpredictable rainfall</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 flex-shrink-0">Soil</Badge>
                  <p className="text-sm">Add organic matter to improve soil water retention capacity</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-500 flex-shrink-0">Tech</Badge>
                  <p className="text-sm">Use mobile weather apps for accurate local forecasts and alerts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <FarmingAssistant 
                topic="weather-climate"
                topicTitle="Weather & Climate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}