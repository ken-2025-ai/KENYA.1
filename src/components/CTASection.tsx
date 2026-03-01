import { Button } from "@/components/ui/button";
import { Smartphone, Users, ArrowRight, Sparkles } from "lucide-react";
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

  const openAuthModal = (defaultTab: "login" | "signup") => {
    setAuthModal({ isOpen: true, defaultTab });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, defaultTab: "signup" });
  };

  const handleJoinAsFarmer = () => {
    if (user) navigate("/dashboard");
    else openAuthModal("signup");
  };

  const handleFindSuppliers = () => {
    if (user) navigate("/dashboard");
    else openAuthModal("login");
  };

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Immersive background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--accent)/0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--accent)/0.1),_transparent_50%)]" />
      
      {/* Animated orbs */}
      <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-drift" />
      <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] bg-primary-glow/20 rounded-full blur-[80px] animate-drift" style={{ animationDelay: '-5s' }} />
      
      {/* Grain */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-5 py-2.5 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Join the Movement</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Join 50,000+ Farmers Building{" "}
              <span className="bg-gradient-to-r from-accent via-accent-glow to-accent bg-clip-text text-transparent">
                Kenya's Future
              </span>
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect directly to markets, get fair prices, access agricultural insights, and transform your farming business today.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                variant="accent" 
                size="lg" 
                className="group min-h-[56px] text-base font-bold hover:scale-[1.03] transition-all duration-300 shadow-glow-accent relative overflow-hidden"
                onClick={handleJoinAsFarmer}
              >
                <span className="relative z-10 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {user ? "Go to Dashboard" : "Join as Farmer"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="min-h-[56px] text-base bg-white/5 text-white border-white/20 hover:bg-white/15 hover:border-white/40 backdrop-blur-sm group transition-all duration-300"
                onClick={handleFindSuppliers}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                {user ? "View Suppliers" : "Find Suppliers"}
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </div>
          </ScrollReveal>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: "Free", desc: "No signup fees" },
              { value: "24/7", desc: "Market access" },
              { value: "100%", desc: "Mobile money secure" },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={0.3 + i * 0.1} direction="scale">
                <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover-lift">
                  <div className="text-3xl font-black text-white mb-1">{item.value}</div>
                  <div className="text-white/60 text-sm font-medium">{item.desc}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
