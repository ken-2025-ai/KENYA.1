import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { usePWA } from "@/hooks/usePWA";
import { InstallPrompt } from "@/components/InstallPrompt";

// Landing page sections
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { EducationSection } from "@/components/landing/EducationSection";
import { Footer } from "@/components/landing/Footer";

// Existing components
import { Marketplace } from "@/components/Marketplace";
import { AIMarketBoard } from "@/components/AIMarketBoard";
import { EquipmentPreview } from "@/components/EquipmentPreview";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";

const Index = () => {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    defaultTab: "login" | "signup";
  }>({
    isOpen: false,
    defaultTab: "signup"
  });

  const { registerServiceWorker } = usePWA();

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  const openAuthModal = (defaultTab: "login" | "signup") => {
    setAuthModal({ isOpen: true, defaultTab });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, defaultTab: "signup" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero — Full cinematic viewport */}
        <HeroSection onOpenAuth={openAuthModal} />

        {/* Features */}
        <FeaturesGrid />

        {/* Marketplace */}
        <section className="py-8 relative">
          <Marketplace />
        </section>

        {/* Section divider */}
        <div className="section-divider mx-auto max-w-4xl my-4" />

        {/* Equipment */}
        <EquipmentPreview />

        {/* AI Market Intelligence */}
        <section id="prices" className="py-12">
          <AIMarketBoard />
        </section>

        {/* Section divider */}
        <div className="section-divider mx-auto max-w-4xl my-4" />

        {/* Stats — Social proof numbers */}
        <StatsSection />

        {/* Education */}
        <EducationSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <CTASection />

        {/* Footer */}
        <Footer />

        {/* PWA Install Prompt */}
        <InstallPrompt />
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={closeAuthModal} 
          defaultTab={authModal.defaultTab} 
        />
      </div>
    </div>
  );
};

export default Index;
