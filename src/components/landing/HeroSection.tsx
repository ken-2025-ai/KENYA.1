import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Download, Zap, ShieldCheck, Smartphone, DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePWA } from "@/hooks/usePWA";
import { MainMarktButton } from "@/components/MainMarktButton";
import { useRef, useEffect, useState } from "react";

interface HeroSectionProps {
  onOpenAuth: (tab: "login" | "signup") => void;
}

export const HeroSection = ({ onOpenAuth }: HeroSectionProps) => {
  const isMobile = useIsMobile();
  const { canInstall, installApp } = usePWA();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    // Trigger entrance animations after mount
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with cinematic layers */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
          poster="/placeholder.svg"
        >
          <source src="/hero-agriculture.mp4" type="video/mp4" />
        </video>
        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-primary/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-primary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black/50_100%)]" />
      </div>

      {/* Animated orbs */}
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-drift" />
      <div className="absolute bottom-20 left-[5%] w-[500px] h-[500px] bg-primary-glow/15 rounded-full blur-[120px] animate-drift" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-accent-glow/10 rounded-full blur-[80px] animate-orb" />

      {/* Grain texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text content with staggered reveals */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div 
                className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <span className="text-sm font-semibold text-white/90 tracking-wide">Kenya's #1 Agricultural Marketplace</span>
              </div>

              {/* Headline with word-by-word reveal */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
                <span 
                  className={`block text-white transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                  Connect.
                </span>
                <span 
                  className={`block text-white relative transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                  Trade.
                  <svg className="absolute -bottom-2 left-0 w-[140px] lg:w-[180px]" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--accent))" strokeWidth="4" strokeLinecap="round" className={`transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
                  </svg>
                </span>
                <span 
                  className={`block bg-gradient-to-r from-accent via-accent-glow to-accent bg-clip-text text-transparent transition-all duration-700 delay-[600ms] ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                >
                  Prosper.
                </span>
              </h1>

              {/* Subtext */}
              <p 
                className={`text-lg sm:text-xl text-white/75 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-[800ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                Empowering Kenyan farmers with direct market access, real-time prices, and expert agricultural insights. Join <strong className="text-white font-semibold">50,000+</strong> farmers transforming their businesses.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 transition-all duration-700 delay-[1000ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="group min-h-[56px] text-base font-bold shadow-glow-accent hover:scale-[1.03] transition-all duration-300 relative overflow-hidden"
                  onClick={() => {
                    if ('vibrate' in navigator) navigator.vibrate(100);
                    onOpenAuth("signup");
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Start Selling Today
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="min-h-[56px] text-base bg-white/5 text-white border-white/20 hover:bg-white/15 hover:border-white/40 backdrop-blur-sm group transition-all duration-300"
                  onClick={handleInstall}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get Mobile App
                  <Zap className="w-4 h-4 ml-2 text-accent animate-pulse" />
                </Button>
              </div>

              {/* Trust badges */}
              <div className={`flex flex-wrap justify-center lg:justify-start gap-3 transition-all duration-700 delay-[1200ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {[
                  { icon: ShieldCheck, label: "Verified Farmers" },
                  { icon: Smartphone, label: "Mobile-First" },
                  { icon: DollarSign, label: "M-Pesa Ready" },
                ].map((badge, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <badge.icon className="w-4 h-4 text-accent" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium floating dashboard card */}
            <div className={`hidden lg:block transition-all duration-1000 delay-[600ms] ${loaded ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-12 translate-y-8'}`}>
              <div className="relative perspective-container">
                {/* Floating accent cards */}
                <div className="absolute -top-6 -left-6 z-20 animate-float-rotate">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-elevated border border-white/50">
                    <div className="text-4xl font-black text-primary tracking-tight">50K+</div>
                    <div className="text-sm text-muted-foreground font-medium">Active Farmers</div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 z-20 animate-float-rotate" style={{ animationDelay: '1.5s' }}>
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-elevated border border-white/50">
                    <div className="text-4xl font-black text-accent tracking-tight">85%</div>
                    <div className="text-sm text-muted-foreground font-medium">Income Growth</div>
                  </div>
                </div>

                {/* Main glass dashboard card */}
                <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.3)] animate-tilt-3d">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 font-medium">Today's Trade Volume</span>
                      <span className="text-accent font-black text-lg">KSh 2.5M</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-accent to-accent-glow rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                      <div>
                        <div className="text-3xl font-black text-white">47</div>
                        <div className="text-sm text-white/60">Counties</div>
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">24/7</div>
                        <div className="text-sm text-white/60">Market Access</div>
                      </div>
                    </div>
                    {/* Mini chart visualization */}
                    <div className="flex items-end gap-1.5 h-16 pt-4 border-t border-white/10">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-sm bg-gradient-to-t from-accent/60 to-accent transition-all duration-500 ${loaded ? '' : 'h-0'}`}
                          style={{ 
                            height: loaded ? `${h}%` : '0%',
                            transitionDelay: `${1200 + i * 80}ms` 
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MainMarkt Button */}
          <div className={`mt-16 flex justify-center transition-all duration-700 delay-[1400ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <MainMarktButton />
          </div>
        </div>
      </div>

      {/* Bottom cinematic wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 140" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 140L48 130C96 120 192 100 288 85C384 70 480 60 576 62.5C672 65 768 80 864 87.5C960 95 1056 95 1152 90C1248 85 1344 75 1392 70L1440 65V140H1392C1344 140 1248 140 1152 140C1056 140 960 140 864 140C768 140 672 140 576 140C480 140 384 140 288 140C192 140 96 140 48 140H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};
