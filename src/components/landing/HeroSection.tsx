import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Download, Zap, ShieldCheck, Smartphone, DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePWA } from "@/hooks/usePWA";
import { MainMarktButton } from "@/components/MainMarktButton";
import { useRef, useEffect } from "react";

interface HeroSectionProps {
  onOpenAuth: (tab: "login" | "signup") => void;
}

export const HeroSection = ({ onOpenAuth }: HeroSectionProps) => {
  const isMobile = useIsMobile();
  const { canInstall, installApp } = usePWA();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mobile
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleInstall = async () => {
    if ('vibrate' in navigator) navigator.vibrate(100);
    if (canInstall) {
      const installed = await installApp();
      if (!installed) window.open('https://play.google.com/store', '_blank');
    } else {
      window.open('https://play.google.com/store', '_blank');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          poster="/placeholder.svg"
        >
          <source src="/hero-agriculture.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/55 to-primary-glow/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div className="text-primary-foreground text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-slide-up">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium">Kenya's #1 Agricultural Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-slide-up leading-[1.1]">
                Connect.{" "}
                <span className="relative">
                  Trade.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--accent))" strokeWidth="4" strokeLinecap="round" className="animate-shimmer" />
                  </svg>
                </span>{" "}
                <span className="bg-gradient-to-r from-accent via-accent-glow to-accent bg-clip-text text-transparent">
                  Prosper.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-primary-foreground/85 mb-8 animate-slide-up leading-relaxed max-w-xl mx-auto lg:mx-0" style={{ animationDelay: "0.15s" }}>
                Empowering Kenyan farmers with direct market access, real-time prices, and expert agricultural insights. Join 50,000+ farmers transforming their businesses.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="group min-h-[52px] text-base font-semibold shadow-glow-accent hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    if ('vibrate' in navigator) navigator.vibrate(100);
                    onOpenAuth("signup");
                  }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Start Selling Today
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="min-h-[52px] text-base bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 backdrop-blur-sm group"
                  onClick={handleInstall}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get Mobile App
                  <Zap className="w-4 h-4 ml-2 text-accent animate-pulse" />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-slide-up" style={{ animationDelay: "0.45s" }}>
                {[
                  { icon: ShieldCheck, label: "Verified Farmers" },
                  { icon: Smartphone, label: "Mobile-First" },
                  { icon: DollarSign, label: "M-Pesa Ready" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                    <badge.icon className="w-4 h-4" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stats/Visual card */}
            <div className="hidden lg:block animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="relative">
                {/* Floating stats cards */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-strong z-10 animate-float">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Farmers</div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-strong z-10 animate-float" style={{ animationDelay: "1s" }}>
                  <div className="text-3xl font-bold text-accent">85%</div>
                  <div className="text-sm text-muted-foreground">Income Growth</div>
                </div>

                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-foreground/80">Today's Trade Volume</span>
                      <span className="text-accent font-bold">KSh 2.5M</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-accent to-accent-glow rounded-full animate-shimmer" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                      <div>
                        <div className="text-2xl font-bold text-primary-foreground">47</div>
                        <div className="text-sm text-primary-foreground/70">Counties</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-foreground">24/7</div>
                        <div className="text-sm text-primary-foreground/70">Market Access</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MainMarkt Button */}
          <div className="mt-12 flex justify-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <MainMarktButton />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};
