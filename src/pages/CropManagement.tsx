import { Navigation } from "@/components/Navigation";
import { FarmingAssistant } from "@/components/FarmingAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Calendar, Droplets, TrendingUp, AlertTriangle, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CropManagement() {
  const navigate = useNavigate();

  const topics = [
    {
      icon: Calendar,
      title: "Crop Planning & Rotation",
      description: "Learn optimal planting schedules and crop rotation strategies for better soil health and yields.",
      tips: ["Plan 2-3 seasons ahead", "Rotate legumes with cereals", "Consider market demand"]
    },
    {
      icon: Sprout,
      title: "Seed Selection & Planting",
      description: "Choose the right seeds and master planting techniques for your region and season.",
      tips: ["Use certified seeds", "Test germination rates", "Follow spacing guidelines"]
    },
    {
      icon: Droplets,
      title: "Irrigation & Water Management",
      description: "Optimize water usage and implement efficient irrigation systems for your crops.",
      tips: ["Water early morning/evening", "Monitor soil moisture", "Use drip irrigation"]
    },
    {
      icon: TrendingUp,
      title: "Growth Monitoring",
      description: "Track crop development and identify growth stage issues early for better intervention.",
      tips: ["Regular field scouting", "Document observations", "Monitor nutrient deficiencies"]
    },
    {
      icon: AlertTriangle,
      title: "Harvest Management",
      description: "Determine optimal harvest time and implement proper post-harvest handling.",
      tips: ["Harvest at right maturity", "Proper drying techniques", "Clean storage facilities"]
    },
    {
      icon: BookOpen,
      title: "Record Keeping",
      description: "Maintain detailed farm records for better decision-making and profitability analysis.",
      tips: ["Track input costs", "Record yields per plot", "Document weather events"]
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
          <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
            <Sprout className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Crop Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master modern farming techniques to maximize your crop yields and profitability
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Learning Content - 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Essential Topics
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {topics.map((topic, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
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
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Best Practices */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Best Practices for Kenyan Farmers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-500 flex-shrink-0">Season</Badge>
                  <p className="text-sm">Plan for both long rains (March-May) and short rains (October-December) seasons</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 flex-shrink-0">Soil</Badge>
                  <p className="text-sm">Test your soil before planting and adjust fertilizer based on results</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-500 flex-shrink-0">Records</Badge>
                  <p className="text-sm">Keep detailed records using mobile apps or simple notebooks for better planning</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-500 flex-shrink-0">Market</Badge>
                  <p className="text-sm">Research market prices before planting to choose profitable crops</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant - 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <FarmingAssistant 
                topic="crop-management"
                topicTitle="Crop Management"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}