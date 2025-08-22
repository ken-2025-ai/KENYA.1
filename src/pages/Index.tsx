import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { useNavigate } from "react-router-dom";
import { FeatureCard } from "@/components/FeatureCard";
import { StatsSection } from "@/components/StatsSection";
import { PriceBoard } from "@/components/PriceBoard";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import heroImage from "@/assets/hero-agriculture-kenya.jpg";
import { 
  Smartphone, 
  TrendingUp, 
  Users, 
  MapPin, 
  CloudRain, 
  BookOpen, 
  ShieldCheck, 
  DollarSign, 
  Truck, 
  ArrowRight,
  Play
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First Platform",
    description: "Access markets, prices, and agricultural insights directly from your phone. Works on any device, anywhere in Kenya."
  },
  {
    icon: TrendingUp,
    title: "Real-Time Market Prices",
    description: "Get live pricing data from major markets across Kenya. Make informed selling decisions with accurate, up-to-date information."
  },
  {
    icon: Users,
    title: "Direct Market Access",
    description: "Connect directly with buyers and sellers. Eliminate middlemen and get fair prices for your produce."
  },
  {
    icon: CloudRain,
    title: "Weather & Farming Tips",
    description: "Receive localized weather forecasts, seasonal planting guides, and expert agricultural advice for better yields.",
    highlight: true
  },
  {
    icon: DollarSign,
    title: "M-Pesa Integration",
    description: "Secure payments through M-Pesa and other mobile money platforms. Fast, safe transactions for all your trades."
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Verified farmers and buyers. Rating system ensures quality produce and reliable trading partners."
  }
];

const Index = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; defaultTab: "login" | "signup" }>({
    isOpen: false,
    defaultTab: "signup"
  });
  const navigate = useNavigate();

  const openAuthModal = (defaultTab: "login" | "signup") => {
    setAuthModal({ isOpen: true, defaultTab });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, defaultTab: "signup" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Connect. Trade. 
              <span className="text-accent-glow">Prosper.</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Kenya's premier agricultural marketplace connecting farmers directly to markets. 
              Get fair prices, real-time market data, and expert farming insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Button 
                variant="accent" 
                size="lg" 
                className="group"
                onClick={() => openAuthModal("signup")}
              >
                <Users className="w-5 h-5 mr-2" />
                Start Selling Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-smooth" />
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Verified Farmers
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile-First
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                M-Pesa Integrated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything Farmers Need in One Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From market access to agricultural insights, we provide comprehensive tools 
              to help Kenyan farmers succeed in the digital age.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                highlight={feature.highlight}
              />
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Market Prices Section */}
      <section id="prices">
        <PriceBoard />
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gradient-to-br from-muted/30 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Learn Modern Farming
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Access expert agricultural knowledge, weather forecasts, and farming best practices 
              to maximize your harvest and profits.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/learn")}
            >
              Explore Learning Resources
            </Button>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <CTASection />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-bold text-lg">Kenya Pulse Connect</span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Empowering Kenyan farmers with direct market access and agricultural insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#" className="hover:text-accent transition-smooth">For Farmers</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">For Buyers</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Market Prices</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#" className="hover:text-accent transition-smooth">Farming Guides</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Weather Reports</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Success Stories</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>📧 hello@kenyapulse.co.ke</li>
                <li>📱 +254 700 000 000</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; 2024 Kenya Pulse Connect. Building the future of Kenyan agriculture.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={closeAuthModal}
        defaultTab={authModal.defaultTab}
      />
    </div>
  );
};

export default Index;