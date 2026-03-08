import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Download, Zap, ShieldCheck, Smartphone, DollarSign, Leaf } from "lucide-react";
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
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          poster="/placeholder.svg"
        >
          <source src="/hero-agriculture.mp4" type="video/mp4" />
        </video>
        {/* Deep cinematic overlays — warm earth tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[hsl(145,65%,18%,0.55)] to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-[hsl(28,92%,50%,0.12)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(42,90%,55%,0.08),_transparent_60%)]" />
      </div>

      {/* Organic floating shapes */}
      <div className="absolute top-16 right-[8%] w-[350px] h-[350px] organic-blob bg-[hsl(28,92%,50%,0.08)] blur-[80px]" />
      <div className="absolute bottom-20 left-[3%] w-[500px] h-[500px] organic-blob bg-[hsl(145,50%,38%,0.1)] blur-[100px]" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-[45%] left-[55%] w-[200px] h-[200px] rounded-full bg-[hsl(42,90%,55%,0.06)] blur-[60px] animate-drift" />

      {/* Grain texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Text — 7 cols for asymmetric layout */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div 
                className={`inline-flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] px-5 py-2.5 rounded-full mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <Leaf className="w-4 h-4 text-[hsl(var(--accent))]" />
                <span className="text-sm font-semibold text-white/85 tracking-wide">Kenya's Premier Agricultural Marketplace</span>
              </div>

              {/* Headline — staggered kinetic typography */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black mb-8 leading-[1.02] tracking-[-0.03em]">
                <span 
                  className={`block text-white/95 transition-all duration-700 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-14'}`}
                >
                  Farm Smarter.
                </span>
                <span 
                  className={`block text-white/95 transition-all duration-700 delay-[350ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-14'}`}
                >
                  Sell Directly.
                </span>
                <span 
                  className={`block transition-all duration-700 delay-[550ms] ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-14 scale-95'}`}
                >
                  <span className="text-gradient-warm inline-block" style={{
                    background: 'linear-gradient(135deg, hsl(28 92% 55%), hsl(42 90% 58%), hsl(28 92% 50%))',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Grow Together.
                  </span>
                </span>
              </h1>

              {/* Subtext */}
              <p 
                className={`text-lg sm:text-xl text-white/65 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light transition-all duration-700 delay-[750ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                Empowering <strong className="text-white font-semibold">50,000+</strong> Kenyan farmers with direct market access, 
                real-time prices, weather insights, and secure M-Pesa payments.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 transition-all duration-700 delay-[950ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="group min-h-[56px] text-base font-bold shadow-[0_0_40px_hsl(28,92%,50%,0.35)] hover:shadow-[0_0_60px_hsl(28,92%,50%,0.5)] hover:scale-[1.03] transition-all duration-300 relative overflow-hidden"
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
                  className="min-h-[56px] text-base bg-white/[0.04] text-white border-white/15 hover:bg-white/[0.1] hover:border-white/30 backdrop-blur-sm group transition-all duration-300"
                  onClick={handleInstall}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get Mobile App
                  <Zap className="w-4 h-4 ml-2 text-[hsl(var(--accent))] animate-pulse" />
                </Button>
              </div>

              {/* Trust badges — horizontal strip */}
              <div className={`flex flex-wrap justify-center lg:justify-start gap-3 transition-all duration-700 delay-[1150ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {[
                  { icon: ShieldCheck, label: "Verified Farmers" },
                  { icon: Smartphone, label: "Works Offline" },
                  { icon: DollarSign, label: "M-Pesa Ready" },
                ].map((badge, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] px-4 py-2 rounded-full text-sm text-white/70 hover:bg-white/[0.1] hover:text-white/90 transition-all duration-300"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                    <span className="font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating dashboard — 5 cols */}
            <div className={`hidden lg:block lg:col-span-5 transition-all duration-1000 delay-[600ms] ${loaded ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-16 translate-y-12'}`}>
              <div className="relative">
                {/* Floating stat cards */}
                <div className="absolute -top-8 -left-8 z-20 animate-float-rotate">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-elevated border border-white/60">
                    <div className="text-3xl font-black text-[hsl(var(--primary))] tracking-tight">50K+</div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Farmers</div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-4 z-20 animate-float-rotate" style={{ animationDelay: '2s' }}>
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-elevated border border-white/60">
                    <div className="text-3xl font-black text-[hsl(var(--accent))] tracking-tight">+85%</div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Income</div>
                  </div>
                </div>

                {/* Main dashboard glass card */}
                <div className="bg-white/[0.06] backdrop-blur-2xl rounded-3xl p-7 border border-white/[0.1] shadow-[0_40px_100px_rgba(0,0,0,0.25)] animate-tilt-3d">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Today's Volume</span>
                        <div className="text-[hsl(var(--accent))] font-black text-2xl tracking-tight">KSh 2.5M</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent),0.15)] flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-[hsl(var(--accent))]" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--gold))] rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
                      {[
                        { val: "47", label: "Counties" },
                        { val: "24/7", label: "Access" },
                        { val: "4.9★", label: "Rating" },
                      ].map((s, i) => (
                        <div key={i} className="text-center">
                          <div className="text-xl font-black text-white">{s.val}</div>
                          <div className="text-[11px] text-white/45 font-medium">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Mini chart */}
                    <div className="flex items-end gap-1.5 h-14 pt-3 border-t border-white/[0.06]">
                      {[35, 55, 40, 75, 50, 85, 65, 80, 55, 90, 70, 82].map((h, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-sm transition-all duration-700 ${loaded ? '' : 'h-0'}`}
                          style={{ 
                            height: loaded ? `${h}%` : '0%',
                            background: `linear-gradient(to top, hsl(28 92% 50% / 0.5), hsl(42 90% 55% / 0.8))`,
                            transitionDelay: `${1200 + i * 70}ms` 
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

      {/* Bottom organic wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 82C1200 84 1320 78 1380 75L1440 72V120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};
