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
      {/* Subtle background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,_hsl(var(--primary)/0.03),_transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero - Full viewport cinematic */}
        <HeroSection onOpenAuth={openAuthModal} />

        {/* Section divider */}
        <div className="section-divider mx-auto max-w-4xl" />

        {/* Features - Core value proposition */}
        <FeaturesGrid />

        {/* Marketplace - Show real products */}
        <section className="py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
          <div className="relative">
            <Marketplace />
          </div>
        </section>

        {/* Equipment Preview */}
        <EquipmentPreview />

        {/* Section divider */}
        <div className="section-divider mx-auto max-w-4xl my-4" />

        {/* AI Market Intelligence */}
        <section id="prices" className="py-12">
          <AIMarketBoard />
        </section>

        {/* Education - Value add */}
        <EducationSection />

        {/* Social Proof */}
        <StatsSection />
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
