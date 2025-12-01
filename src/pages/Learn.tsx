import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePWA } from "@/hooks/usePWA";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  CloudRain, 
  Sprout, 
  Bug, 
  Tractor, 
  TrendingUp,
  Clock,
  Users,
  Play,
  Download,
  Star,
  Smartphone,
  Zap,
  Beef,
  Wheat,
  ExternalLink,
  ArrowRight,
  Award,
  ChevronRight,
  Activity,
  Map
} from "lucide-react";

const learningCategories = [
  {
    icon: Sprout,
    title: "Crop Management",
    description: "Learn modern farming techniques for better yields",
    courses: 12,
    color: "bg-green-500/10 text-green-600",
    link: "/learn/crop-management"
  },
  {
    icon: CloudRain,
    title: "Weather & Climate",
    description: "Understanding weather patterns for optimal farming",
    courses: 8,
    color: "bg-blue-500/10 text-blue-600",
    link: "/learn/weather-climate"
  },
  {
    icon: Bug,
    title: "Pest Control",
    description: "Sustainable pest and disease management",
    courses: 15,
    color: "bg-orange-500/10 text-orange-600",
    link: "/learn/pest-control"
  },
  {
    icon: Tractor,
    title: "Farm Equipment",
    description: "Modern tools and machinery for efficiency",
    courses: 6,
    color: "bg-purple-500/10 text-purple-600",
    link: "/learn/farm-equipment"
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Understanding market trends and pricing",
    courses: 10,
    color: "bg-primary/10 text-primary",
    link: "/learn/market-intelligence"
  }
];

const featuredCourses = [
  {
    title: "Maize Farming in Kenya",
    description: "Complete guide to growing maize from planting to harvest",
    duration: "2 hours",
    students: 1200,
    rating: 4.8,
    image: "🌽",
    level: "Beginner",
    category: "Crop Management",
    videoId: "asscF9W9tqQ",
    summary: "Learn expert techniques for high-yield maize farming in Kenya. This comprehensive course covers soil preparation, seed selection, planting density, fertilizer application, and pest management. Discover proven methods to maximize your maize harvest and profitability through modern farming practices adapted to Kenyan conditions.",
    keyPoints: [
      "Optimal planting techniques and spacing",
      "Fertilizer application timing and rates",
      "Pest and disease management strategies",
      "Harvesting and post-harvest handling"
    ]
  },
  {
    title: "Coffee Production Mastery",
    description: "Advanced techniques for premium coffee farming",
    duration: "3 hours",
    students: 800,
    rating: 4.9,
    image: "☕",
    level: "Advanced",
    category: "Crop Management",
    videoId: "EANPhNtjD_Q",
    summary: "Master the art of coffee farming with expert tips tailored for Kenyan farmers. This course explores pruning techniques, disease control, quality improvement, and sustainable practices. Learn how to produce premium coffee beans that command higher market prices and build lasting relationships with buyers.",
    keyPoints: [
      "Pruning and canopy management",
      "Coffee Berry Disease (CBD) control",
      "Quality processing and grading",
      "Sustainable farming certifications"
    ]
  },
  {
    title: "Sustainable Farming Practices",
    description: "Eco-friendly farming methods for long-term success",
    duration: "1.5 hours",
    students: 950,
    rating: 4.7,
    image: "🌱",
    level: "Intermediate",
    category: "Best Practices",
    videoId: "AFjd6DrlwsQ",
    summary: "Discover sustainable agriculture methods that protect the environment while boosting productivity. Learn about integrated farming systems, soil conservation, water management, and organic practices. This course shows you how to build resilient farms that remain productive for generations while reducing costs and environmental impact.",
    keyPoints: [
      "Soil health and conservation techniques",
      "Water harvesting and efficient irrigation",
      "Integrated pest management (IPM)",
      "Crop rotation and diversification"
    ]
  },
  {
    title: "M-Pesa for Farmers",
    description: "Digital payments and financial management",
    duration: "45 minutes",
    students: 2100,
    rating: 4.6,
    image: "📱",
    level: "Beginner",
    category: "Digital Skills",
    videoId: "bL-_Rvst_ew",
    summary: "Unlock the power of digital finance with M-Pesa for agricultural transactions. Learn how to use mobile money for buying inputs, selling produce, accessing credit, and managing farm finances. Discover how M-Pesa is revolutionizing agriculture in Kenya by enabling instant payments, reducing transaction costs, and connecting farmers to broader markets.",
    keyPoints: [
      "Sending and receiving payments safely",
      "Accessing agricultural loans via mobile",
      "Digital record-keeping for farm finances",
      "Connecting to digital marketplaces"
    ]
  }
];

const Learn = () => {
  const isMobile = useIsMobile();
  const { canInstall, installApp } = usePWA();
  const navigate = useNavigate();

  const handleDownloadApp = async () => {
    // Simulate app download or redirect to app store
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
    // Try PWA install first, fallback to app store
    if (canInstall) {
      const installed = await installApp();
      if (!installed) {
        window.open('https://play.google.com/store', '_blank');
      }
    } else {
      window.open('https://play.google.com/store', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh-bg pointer-events-none" />
      
      <div className="relative z-10">
        <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto text-primary-foreground">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-accent-glow animate-pulse" />
            </div>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-accent-glow to-white bg-clip-text text-transparent">
              Learn Modern Farming
            </h1>
            <p className="text-lg md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              Access expert agricultural knowledge, weather insights, and farming best practices 
              to maximize your harvest and profits.
            </p>
            <div className="flex flex-col gap-4 justify-center max-w-md mx-auto md:max-w-none md:flex-row">
              <Button 
                variant="accent" 
                size={isMobile ? "default" : "lg"} 
                className="w-full md:w-auto shadow-glow-accent font-bold hover:scale-105 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              
              {/* Enhanced Mobile App Download Button */}
              <Button 
                variant="premium" 
                size={isMobile ? "default" : "lg"}
                className="w-full md:w-auto relative overflow-hidden group bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-primary-foreground hover:from-white/30 hover:to-white/20 hover:scale-105 transition-all duration-300"
                onClick={handleDownloadApp}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Smartphone className="w-5 h-5 mr-2 animate-bounce" />
                <span className="relative z-10 font-semibold">
                  {canInstall 
                    ? (isMobile ? "Install App" : "Install App") 
                    : (isMobile ? "Get Mobile App" : "Download Mobile App")
                  }
                </span>
                <Zap className="w-4 h-4 ml-2 text-accent-glow animate-pulse" />
              </Button>
            </div>
            
            {/* Mobile App Features Preview */}
            {isMobile && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-sm font-semibold mb-3 text-primary-foreground">
                  📱 Mobile App Features
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-primary-foreground/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Offline Learning
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Weather Alerts
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Market Prices
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Expert Chat
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specialized Management Systems */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
              Specialized Management Systems
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Access our dedicated platforms for comprehensive farm management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Animal Husbandry Button */}
            <Card className="group relative overflow-hidden hover:shadow-glow-primary transition-all duration-500 border-2 border-primary/20 hover:border-primary/40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Beef className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Animal Husbandry
                </CardTitle>
                <CardDescription className="text-base">
                  Complete livestock management system for cattle, goats, sheep, and poultry. Track health, breeding, feeding schedules, and profitability.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    Livestock Health Records
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    Breeding & Genetics Tracking
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    Feed Management & Costs
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    Production Analytics
                  </div>
                </div>
                
                <Button 
                  variant="hero"
                  size="lg"
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 min-h-[52px]"
                  onClick={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(100);
                    }
                    window.open('https://farmsite-manager-kendagor.netlify.app/', '_blank');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <Beef className="w-5 h-5 mr-3" />
                  <span className="relative z-10 font-bold">
                    Manage Livestock
                  </span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>

            {/* Crop Management Button */}
            <Card className="group relative overflow-hidden hover:shadow-glow-accent transition-all duration-500 border-2 border-accent/20 hover:border-accent/40">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-accent" />
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Wheat className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                  Crop Management
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced crop planning and management system for maize, coffee, vegetables, and other crops. Optimize yields and maximize profits.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Planting & Harvest Planning
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Pest & Disease Management
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Irrigation & Weather Integration
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Yield & Profit Analytics
                  </div>
                </div>
                
                <Button 
                  variant="hero"
                  size="lg"
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 min-h-[52px]"
                  onClick={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(100);
                    }
                    window.open('https://riftvalley-cropmanager-kendagor.netlify.app/', '_blank');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <Wheat className="w-5 h-5 mr-3" />
                  <span className="relative z-10 font-bold">
                    Manage Crops
                  </span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>

            {/* Agricultural Health Center Button */}
            <Card className="group relative overflow-hidden hover:shadow-glow-accent transition-all duration-500 border-2 border-blue-500/20 hover:border-blue-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Agricultural Health Center
                </CardTitle>
                <CardDescription className="text-base">
                  AI-powered diagnosis for plant diseases and animal health issues. Upload photos for instant analysis, treatment recommendations, and prevention tips.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Plant Disease Diagnosis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Animal Health Analysis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Treatment Recommendations
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Prevention & Care Tips
                  </div>
                </div>
                
                <Button 
                  variant="hero"
                  size="lg"
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 min-h-[52px]"
                  onClick={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(100);
                    }
                    navigate('/learn/health-center');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <Activity className="w-5 h-5 mr-3" />
                  <span className="relative z-10 font-bold">
                    Diagnose Health
                  </span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>

            {/* Regional Crop Planner Button */}
            <Card className="group relative overflow-hidden hover:shadow-glow-accent transition-all duration-500 border-2 border-purple-500/20 hover:border-purple-500/40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-purple-500" />
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Map className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-purple-500 transition-colors duration-300">
                  Regional Crop Planner
                </CardTitle>
                <CardDescription className="text-base">
                  Get personalized crop recommendations, planting calendars, and complete farming guides tailored to your county's climate and soil conditions.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    Top 10 Crops for Your Region
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    Seed Varieties & Suppliers
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    Planting Calendar & Guides
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    Pest Control & Chemicals
                  </div>
                </div>
                
                <Button 
                  variant="hero"
                  size="lg"
                  className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 min-h-[52px]"
                  onClick={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(100);
                    }
                    navigate('/learn/crop-planner');
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <Map className="w-5 h-5 mr-3" />
                  <span className="relative z-10 font-bold">
                    Plan My Crops
                  </span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mb-4">
              Learning Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Choose from our comprehensive learning paths designed specifically for Kenyan farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {learningCategories.map((category, index) => (
              <Card 
                key={index} 
                className="glass-card hover:shadow-glow-primary transition-smooth cursor-pointer group border-2 border-transparent hover:border-primary/20" 
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => category.link && navigate(category.link)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce shadow-soft`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{category.title}</CardTitle>
                  <CardDescription className="font-medium">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {category.courses} courses
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-semibold group-hover:text-primary"
                      disabled={!category.link}
                    >
                      {category.link ? 'Explore →' : 'Coming Soon'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Popular courses that are helping farmers across Kenya succeed
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="glass-card hover:shadow-glow-accent transition-smooth group overflow-hidden border-2 border-transparent hover:border-accent/20" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl">{course.image}</div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-muted-foreground">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-sm mb-3">{course.description}</CardDescription>
                  
                  {/* YouTube Video Embed */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 shadow-lg group-hover:shadow-glow-primary transition-all duration-300">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${course.videoId}?controls=1&rel=0&modestbranding=1`}
                      title={course.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Summary */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-foreground mb-2">📋 Course Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {course.summary}
                    </p>
                  </div>
                  
                  {/* Key Points */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-foreground mb-2">✨ What You'll Learn</h4>
                    <ul className="space-y-1.5">
                      {course.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Stats and CTA */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="hero" 
                    size="lg"
                    className="w-full group-hover:scale-105 transition-all duration-300 hover:shadow-glow-primary active:scale-95 touch-manipulation min-h-[48px] relative overflow-hidden"
                    onClick={() => {
                      if ('vibrate' in navigator) {
                        navigator.vibrate(50);
                      }
                      // Open YouTube video in new tab
                      window.open(`https://www.youtube.com/watch?v=${course.videoId}`, '_blank');
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/0 to-primary-glow/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <Play className="w-5 h-5 mr-2" />
                    <span className="relative z-10 font-bold">
                      Watch Full Course
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Farming Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">🌱</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Sustainable Farming Practices
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn eco-friendly farming methods that protect our environment while maximizing yields and profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "♻️",
                title: "Organic Farming",
                description: "Master chemical-free farming techniques for healthier crops and better market prices",
                topics: ["Natural pesticides", "Composting", "Soil health", "Certification"]
              },
              {
                icon: "💧",
                title: "Water Conservation",
                description: "Smart irrigation methods to save water while maintaining optimal crop growth",
                topics: ["Drip irrigation", "Rainwater harvesting", "Water-efficient crops", "Moisture monitoring"]
              },
              {
                icon: "🌾",
                title: "Soil Management",
                description: "Build and maintain fertile soil for sustainable long-term productivity",
                topics: ["Crop rotation", "Cover crops", "No-till farming", "Soil testing"]
              },
              {
                icon: "🐝",
                title: "Biodiversity",
                description: "Create balanced ecosystems that support pollinators and natural pest control",
                topics: ["Pollinator habitats", "Companion planting", "Hedge rows", "Native species"]
              },
              {
                icon: "🌳",
                title: "Agroforestry",
                description: "Integrate trees with crops for improved yields and environmental benefits",
                topics: ["Shade systems", "Wind breaks", "Carbon sequestration", "Multi-cropping"]
              },
              {
                icon: "⚡",
                title: "Carbon Credits",
                description: "Earn additional income by participating in carbon offset programs",
                topics: ["Carbon farming", "Credit markets", "Verification", "Best practices"]
              }
            ].map((topic, index) => (
              <Card 
                key={index}
                className="group cursor-pointer transition-smooth hover:shadow-large hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-smooth">{topic.icon}</div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-smooth">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground mb-2">What you'll learn:</p>
                    <ul className="space-y-1">
                      {topic.topics.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    size="sm"
                  >
                    Start Learning
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none shadow-large">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">🏆 Get Certified</h3>
                <p className="mb-6 opacity-90">
                  Complete our sustainable farming courses and earn certificates recognized across Kenya. 
                  Gain access to premium markets and better prices for your certified sustainable produce.
                </p>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="shadow-glow-accent"
                >
                  View Certification Programs
                  <Award className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto text-primary-foreground glass-card p-8 md:p-12 rounded-2xl backdrop-blur-xl border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-accent-glow to-white bg-clip-text text-transparent">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 font-medium leading-relaxed">
              Join thousands of Kenyan farmers who are already using our platform to increase their yields and profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" className="font-bold shadow-glow-accent hover:scale-105 transition-all duration-300">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 font-semibold hover:scale-105 transition-all duration-300">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Learn;