import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { useNavigate, Link } from "react-router-dom";
import { FeatureCard } from "@/components/FeatureCard";
import { StatsSection } from "@/components/StatsSection";
import { PriceBoard } from "@/components/PriceBoard";
import { Marketplace } from "@/components/Marketplace";
import { AIMarketBoard } from "@/components/AIMarketBoard";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePWA } from "@/hooks/usePWA";
import { InstallPrompt } from "@/components/InstallPrompt";
import { MainMarktButton } from "@/components/MainMarktButton";
import { EquipmentPreview } from "@/components/EquipmentPreview";
import heroImage from "@/assets/hero-agriculture-kenya.jpg";
import { Smartphone, TrendingUp, Users, BookOpen, ShieldCheck, DollarSign, ArrowRight, Play, Download, Zap, Leaf, Tractor } from "lucide-react";
const features = [{
  icon: Smartphone,
  title: "Mobile-First Platform",
  description: "Access markets, prices, and agricultural insights directly from your phone. Works on any device, anywhere in Kenya."
}, {
  icon: TrendingUp,
  title: "Real-Time Market Prices",
  description: "Get live pricing data from major markets across Kenya. Make informed selling decisions with accurate, up-to-date information."
}, {
  icon: Users,
  title: "Direct Market Access",
  description: "Connect directly with buyers and sellers. Eliminate middlemen and get fair prices for your produce."
}, {
  icon: Tractor,
  title: "Equipment Leasing",
  description: "Access tractors, harvesters, and farm machinery from owners near you. Rent what you need, when you need it.",
  highlight: true
}, {
  icon: DollarSign,
  title: "M-Pesa Integration",
  description: "Secure payments through M-Pesa and other mobile money platforms. Fast, safe transactions for all your trades."
}, {
  icon: ShieldCheck,
  title: "Quality Assurance",
  description: "Verified farmers and buyers. Rating system ensures quality produce and reliable trading partners."
}];
const Index = () => {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    defaultTab: "login" | "signup";
  }>({
    isOpen: false,
    defaultTab: "signup"
  });
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    canInstall,
    installApp,
    registerServiceWorker
  } = usePWA();
  useEffect(() => {
    // Register service worker on component mount
    registerServiceWorker();
  }, [registerServiceWorker]);
  const openAuthModal = (defaultTab: "login" | "signup") => {
    setAuthModal({
      isOpen: true,
      defaultTab
    });
  };
  const closeAuthModal = () => {
    setAuthModal({
      isOpen: false,
      defaultTab: "signup"
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh-bg pointer-events-none" />
      
      <div className="relative z-10">
        <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url(${heroImage})`
        }} />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-slide-up leading-tight">
              Connect. Trade. 
              <span className="text-accent-glow block sm:inline">Prosper.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{
              animationDelay: "0.2s"
            }}>
              Kenya's premier agricultural marketplace connecting farmers directly to markets. 
              Get fair prices, real-time market data, and expert farming insights.
            </p>
            
            <div className="flex flex-col gap-4 justify-center items-center mb-8 animate-slide-up max-w-md mx-auto sm:max-w-none sm:flex-row" style={{
              animationDelay: "0.4s"
            }}>
              <Button variant="accent" size={isMobile ? "default" : "lg"} className="group w-full sm:w-auto min-h-[48px] touch-manipulation shadow-glow-accent hover:scale-105 transition-all duration-300" onClick={() => {
                if ('vibrate' in navigator) {
                  navigator.vibrate(100);
                }
                openAuthModal("signup");
              }}>
                <Users className="w-5 h-5 mr-2" />
                <span className="font-semibold">Start Selling Now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
              </Button>
              
              {/* Enhanced Mobile App Download Button */}
              <Button variant="premium" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto min-h-[48px] touch-manipulation relative overflow-hidden group bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 text-primary-foreground hover:from-white/30 hover:to-white/20 hover:scale-105 transition-all duration-300" onClick={async () => {
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
              }}>
                
                <Download className="w-5 h-5 mr-2 animate-bounce" />
                
                <Zap className="w-4 h-4 ml-2 text-accent-glow animate-pulse" />
              </Button>
              
              <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto min-h-[48px] touch-manipulation bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 group hidden sm:flex">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-smooth" />
                Watch Demo
              </Button>
            </div>
            
            {/* Mobile App Features Preview */}
            {isMobile && <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-sm mx-auto">
                <h3 className="text-sm font-semibold mb-3 text-primary-foreground">
                  📱 Mobile Features
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-primary-foreground/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Offline Access
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Push Notifications
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    GPS Location
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" />
                    Camera Scanner
                  </div>
                </div>
              </div>}

            {/* MainMarkt Button - Prominent Position */}
            <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <MainMarktButton />
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-primary-foreground/80 mt-12">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Verified Farmers</span>
                <span className="sm:hidden">Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile-First</span>
                <span className="sm:hidden">Mobile</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">M-Pesa Integrated</span>
                <span className="sm:hidden">M-Pesa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
              Everything Farmers Need in One Platform
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              From market access to agricultural insights, we provide comprehensive tools 
              to help Kenyan farmers succeed in the digital age.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} highlight={feature.highlight} />)}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <Marketplace />

      <StatsSection />

      {/* AI Market Board Section */}
      <AIMarketBoard />

      {/* Market Prices Section */}
      <section id="prices">
        <PriceBoard />
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-2xl shadow-glow-primary">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 leading-tight">
                Learn Modern Farming
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
                Access expert agricultural knowledge, weather forecasts, and farming best practices 
                to maximize your harvest and profits.
              </p>
              <Button variant="hero" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto min-h-[48px] touch-manipulation shadow-glow-primary hover:scale-105 transition-all duration-300 font-bold" onClick={() => {
                if ('vibrate' in navigator) {
                  navigator.vibrate(50);
                }
                navigate("/learn");
              }}>
                <BookOpen className="w-5 h-5 mr-2" />
                <span className="font-semibold">Explore Learning Resources</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Preview Section */}
      <EquipmentPreview />

      <TestimonialsSection />

      <CTASection />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent via-success to-accent opacity-50 blur-sm" />
                  <div className="w-10 h-10 relative bg-gradient-to-br from-accent via-success to-primary-glow rounded-xl flex items-center justify-center shadow-lg">
                    <div className="relative flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white absolute transform -rotate-12 -translate-x-0.5 translate-y-0.5 opacity-70" />
                      <TrendingUp className="w-5 h-5 text-white relative z-10" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-primary-foreground">Kenya Pulse</span>
                  <span className="text-xs text-primary-foreground/60 font-medium tracking-wider uppercase">Connect</span>
                </div>
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
                <li><Link to="/machinery" className="hover:text-accent transition-smooth">Equipment Leasing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#" className="hover:text-accent transition-smooth">Farming Guides</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Weather Reports</a></li>
                <li><a href="#" className="hover:text-accent transition-smooth">Success Stories</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }} className="hover:text-accent transition-smooth cursor-pointer">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>📧 kenkendagor3@gmail.com</li>
                <li>📱 +254768731991</li>
                <li>📍 Eldoret, Kenya</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; 2024 Kenya Pulse Connect. Building the future of Kenyan agriculture.</p>
          </div>
        </div>
      </footer>

      <InstallPrompt />
      
        <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} defaultTab={authModal.defaultTab} />
      </div>
    </div>;
};
export default Index;