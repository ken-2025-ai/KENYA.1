import { Button } from "@/components/ui/button";
import { Menu, Smartphone, TrendingUp, BookOpen, Users } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Kenya Pulse</h1>
              <p className="text-xs text-muted-foreground -mt-1">Connect</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Features</a>
            <a href="#prices" className="text-muted-foreground hover:text-primary transition-smooth">Market Prices</a>
            <a href="#education" className="text-muted-foreground hover:text-primary transition-smooth">Learn</a>
            <a href="#community" className="text-muted-foreground hover:text-primary transition-smooth">Community</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex">Sign In</Button>
            <Button variant="hero">Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};