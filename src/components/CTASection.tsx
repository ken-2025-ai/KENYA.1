import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Sparkles, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { ScrollReveal } from "@/hooks/useScrollReveal";

export const CTASection = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; defaultTab: "login" | "signup" }>({
    isOpen: false,
    defaultTab: "signup"
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const openAuthModal = (defaultTab: "login" | "signup") => setAuthModal({ isOpen: true, defaultTab });
  const closeAuthModal = () => setAuthModal({ isOpen: false, defaultTab: "signup" });

  const handleJoinAsFarmer = () => {
    if (user) navigate("/dashboard");
    else openAuthModal("signup");
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Rich earth-tone gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(145,55%,28%)] to-[hsl(150,40%,18%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_hsl(28,92%,50%,0.12),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,_hsl(42,90%,55%,0.08),_transparent_50%)]" />
      
      {/* Organic orbs */}
      <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] organic-blob bg-[hsl(var(--accent)/0.08)] blur-[100px]" />
      <div className="absolute bottom-[10%] left-[8%] w-[300px] h-[300px] organic-blob bg-[hsl(var(--primary-glow)/0.12)] blur-[80px]" style={{ animationDelay: '-4s' }} />
      
      {/* Grain */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] px-5 py-2.5 rounded-full mb-8">
              <Leaf className="w-4 h-4 text-[hsl(var(--accent))]" />
              <span className="text-sm font-semibold text-white/80 tracking-wide">Join the Movement</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.08] tracking-tight">
              Ready to transform{" "}
              <span style={{
                background: 'linear-gradient(135deg, hsl(28 92% 55%), hsl(42 90% 58%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                your harvest?
              </span>
            </h2>
            
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Join 50,000+ farmers connecting to markets, getting fair prices, and growing their businesses.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <Button 
              variant="accent" 
              size="lg" 
              className="group min-h-[60px] text-lg font-bold shadow-[0_0_50px_hsl(28,92%,50%,0.4)] hover:shadow-[0_0_70px_hsl(28,92%,50%,0.55)] hover:scale-[1.03] transition-all duration-300"
              onClick={handleJoinAsFarmer}
            >
              <span className="relative z-10 flex items-center">
                <Users className="w-5 h-5 mr-2.5" />
                {user ? "Go to Dashboard" : "Get Started — It's Free"}
                <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </ScrollReveal>

          {/* Minimal stats */}
          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-8 mt-14">
              {[
                { value: "Free", desc: "No signup fees" },
                { value: "24/7", desc: "Market access" },
                { value: "100%", desc: "Secure payments" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-white mb-0.5">{item.value}</div>
                  <div className="text-white/40 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
      
      {!user && (
        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={closeAuthModal} 
          defaultTab={authModal.defaultTab}
        />
      )}
    </section>
  );
};
