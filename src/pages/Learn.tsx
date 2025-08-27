import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { useIsMobile } from "@/hooks/use-mobile";
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
  Zap
} from "lucide-react";

const learningCategories = [
  {
    icon: Sprout,
    title: "Crop Management",
    description: "Learn modern farming techniques for better yields",
    courses: 12,
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: CloudRain,
    title: "Weather & Climate",
    description: "Understanding weather patterns for optimal farming",
    courses: 8,
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: Bug,
    title: "Pest Control",
    description: "Sustainable pest and disease management",
    courses: 15,
    color: "bg-orange-500/10 text-orange-600"
  },
  {
    icon: Tractor,
    title: "Farm Equipment",
    description: "Modern tools and machinery for efficiency",
    courses: 6,
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Understanding market trends and pricing",
    courses: 10,
    color: "bg-primary/10 text-primary"
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
    category: "Crop Management"
  },
  {
    title: "Coffee Production Mastery",
    description: "Advanced techniques for premium coffee farming",
    duration: "3 hours",
    students: 800,
    rating: 4.9,
    image: "☕",
    level: "Advanced",
    category: "Crop Management"
  },
  {
    title: "Sustainable Farming Practices",
    description: "Eco-friendly farming methods for long-term success",
    duration: "1.5 hours",
    students: 950,
    rating: 4.7,
    image: "🌱",
    level: "Intermediate",
    category: "Best Practices"
  },
  {
    title: "M-Pesa for Farmers",
    description: "Digital payments and financial management",
    duration: "45 minutes",
    students: 2100,
    rating: 4.6,
    image: "📱",
    level: "Beginner",
    category: "Digital Skills"
  }
];

const Learn = () => {
  const isMobile = useIsMobile();

  const handleDownloadApp = () => {
    // Simulate app download or redirect to app store
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    // In a real app, this would redirect to Google Play Store or Apple App Store
    window.open('https://play.google.com/store', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-primary-foreground">
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 text-accent-glow animate-pulse" />
            <h1 className="text-3xl md:text-6xl font-bold mb-6">
              Learn Modern Farming
            </h1>
            <p className="text-lg md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Access expert agricultural knowledge, weather insights, and farming best practices 
              to maximize your harvest and profits.
            </p>
            <div className="flex flex-col gap-4 justify-center max-w-md mx-auto md:max-w-none md:flex-row">
              <Button 
                variant="accent" 
                size={isMobile ? "default" : "lg"} 
                className="w-full md:w-auto shadow-glow-accent"
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
                  {isMobile ? "Get Mobile App" : "Download Mobile App"}
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

      {/* Learning Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Learning Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive learning paths designed specifically for Kenyan farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {learningCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-medium transition-smooth cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.courses} courses
                    </span>
                    <Button variant="ghost" size="sm">
                      Explore →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Popular courses that are helping farmers across Kenya succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="hover:shadow-medium transition-smooth cursor-pointer group overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-2">{course.image}</div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                  <CardDescription className="text-sm">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                  </div>
                  <Button 
                    variant="hero" 
                    size={isMobile ? "default" : "sm"} 
                    className="w-full group-hover:scale-105 transition-all duration-300 hover:shadow-glow-primary active:scale-95 touch-manipulation min-h-[44px] relative overflow-hidden"
                    onClick={() => {
                      if ('vibrate' in navigator) {
                        navigator.vibrate(50);
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/0 to-primary-glow/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <Play className="w-4 h-4 mr-2" />
                    <span className="relative z-10 font-semibold">
                      {isMobile ? "Start Now" : "Start Course"}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of Kenyan farmers who are already using our platform to increase their yields and profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;