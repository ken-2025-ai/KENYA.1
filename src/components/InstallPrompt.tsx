import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { usePWA } from "../hooks/usePWA";

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { canInstall, installApp } = usePWA();

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa-install-dismissed');
    
    if (canInstall && !hasDismissed && !dismissed) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [canInstall, dismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || !canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="glass-card border-primary/20 shadow-2xl animate-slide-up">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                <img 
                  src="/logo-192.png" 
                  alt="Kenya Pulse Connect" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Install Kenya Pulse Connect</h3>
                <p className="text-sm text-muted-foreground">Get quick access anytime</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Smartphone className="h-4 w-4" />
            <span>Works offline • Fast loading • Native feel</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              Not now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};