import { Navigation } from "@/components/Navigation";
import { FarmingAssistant } from "@/components/FarmingAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, Shield, Leaf, AlertTriangle, Eye, Beaker, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PestControl() {
  const navigate = useNavigate();

  const topics = [
    {
      icon: Eye,
      title: "Pest Identification",
      description: "Learn to identify common pests and diseases affecting crops in Kenya.",
      tips: ["Regular field scouting", "Check leaf undersides", "Document with photos"]
    },
    {
      icon: Shield,
      title: "Integrated Pest Management",
      description: "Combine multiple control methods for sustainable pest management.",
      tips: ["Use biological controls", "Crop rotation", "Resistant varieties"]
    },
    {
      icon: Leaf,
      title: "Organic Control Methods",
      description: "Natural and eco-friendly solutions for pest and disease control.",
      tips: ["Neem oil sprays", "Companion planting", "Natural predators"]
    },
    {
      icon: Beaker,
      title: "Chemical Control",
      description: "Safe and effective use of pesticides when necessary.",
      tips: ["Read label instructions", "Use protective equipment", "Observe waiting periods"]
    },
    {
      icon: AlertTriangle,
      title: "Disease Prevention",
      description: "Proactive measures to prevent crop diseases before they start.",
      tips: ["Proper spacing", "Clean tools", "Remove infected plants"]
    },
    {
      icon: Bug,
      title: "Common Kenyan Pests",
      description: "Specific pests affecting maize, beans, coffee, and vegetables.",
      tips: ["Fall armyworm control", "Coffee berry borer", "Bean beetle management"]
    }
  ];

  const commonPests = [
    {
      name: "Fall Armyworm",
      crops: "Maize, Sorghum",
      identification: "Gray/brown caterpillars with distinctive Y-shaped mark on head",
      control: "Early detection, bio-pesticides, mechanical removal"
    },
    {
      name: "Coffee Berry Borer",
      crops: "Coffee",
      identification: "Small black beetles boring into coffee berries",
      control: "Regular harvesting, trapping, sanitation"
    },
    {
      name: "Bean Beetle",
      crops: "Beans, Cowpeas",
      identification: "Orange beetles with black spots",
      control: "Early planting, neem oil, resistant varieties"
    },
    {
      name: "Aphids",
      crops: "Most vegetables",
      identification: "Small soft-bodied insects on new growth",
      control: "Water spray, soap solution, beneficial insects"
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
          <div className="inline-block p-4 bg-orange-500/10 rounded-full mb-4">
            <Bug className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Pest Control
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Protect your crops with sustainable and effective pest management strategies
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Common Pests in Kenya */}
            <Card className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border-2 border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-orange-600" />
                  Common Pests in Kenya
                </CardTitle>
                <CardDescription>
                  Know your enemy - identify and control major crop pests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonPests.map((pest, index) => (
                    <div key={index} className="bg-background/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{pest.name}</h4>
                        <Badge variant="outline">{pest.crops}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium text-muted-foreground">Identification:</span> {pest.identification}</p>
                        <p><span className="font-medium text-green-600">Control:</span> {pest.control}</p>
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
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3">
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
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Safety Guidelines */}
            <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-2 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Pesticide Safety Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-red-500 flex-shrink-0">PPE</Badge>
                  <p className="text-sm">Always wear protective equipment: gloves, mask, boots, and long clothing</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-500 flex-shrink-0">Storage</Badge>
                  <p className="text-sm">Store pesticides in locked cabinets away from food, water, and children</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-yellow-600 flex-shrink-0">Timing</Badge>
                  <p className="text-sm">Spray early morning or late evening to minimize bee exposure and drift</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-500 flex-shrink-0">Wait</Badge>
                  <p className="text-sm">Observe pre-harvest intervals before harvesting sprayed crops</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 flex-shrink-0">Disposal</Badge>
                  <p className="text-sm">Never reuse pesticide containers and dispose according to label instructions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <FarmingAssistant 
                topic="pest-control"
                topicTitle="Pest Control"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}