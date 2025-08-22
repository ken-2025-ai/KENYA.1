import { Button } from "@/components/ui/button";
import { Smartphone, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

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
    if (user) {
      navigate("/dashboard");
    } else {
      openAuthModal("signup");
    }
  };

  const handleFindSuppliers = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      openAuthModal("login");
    }
  };
  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join 50,000+ Farmers Building Kenya's Future
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Connect directly to markets, get fair prices, access agricultural insights, and transform your farming business today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="accent" 
              size="lg" 
              className="group relative overflow-hidden"
              onClick={handleJoinAsFarmer}
            >
              <Users className="w-5 h-5 mr-2" />
              {user ? "Go to Dashboard" : "Join as Farmer"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 group relative overflow-hidden"
              onClick={handleFindSuppliers}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              {user ? "View Suppliers" : "Find Suppliers"}
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-smooth" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-float">
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-primary-foreground/80">No signup fees</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Market access</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "2s" }}>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80">Mobile money secure</div>
            </div>
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