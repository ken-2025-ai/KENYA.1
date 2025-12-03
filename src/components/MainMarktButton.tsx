import { ShoppingBag, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";

export const MainMarktButton = () => {
  const handleClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
    window.open('https://kenmarket254.netlify.app/', '_blank');
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      {/* Animated background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent via-primary to-success rounded-2xl blur-lg opacity-60 group-hover:opacity-100 animate-gradient-shift transition-all duration-500" />
      
      {/* Sparkle particles */}
      <div className="absolute -top-2 -right-2 w-4 h-4">
        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
      </div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3">
        <Sparkles className="w-3 h-3 text-primary-glow animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Main button */}
      <button className="relative px-8 py-5 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-2xl overflow-hidden transform group-hover:scale-105 transition-all duration-300 shadow-2xl group-hover:shadow-glow-primary">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
        
        {/* Floating icons background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <ShoppingBag className="absolute w-8 h-8 top-2 right-8 animate-float" style={{ animationDelay: '0s' }} />
          <Shield className="absolute w-6 h-6 bottom-3 left-6 animate-float" style={{ animationDelay: '0.3s' }} />
          <Zap className="absolute w-5 h-5 top-4 left-12 animate-float" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Content */}
        <div className="relative flex items-center gap-4">
          {/* Icon container with pulse */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
            <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex flex-col items-start">
            <span className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              mainMarkt
              <span className="text-xs bg-accent/80 text-accent-foreground px-2 py-0.5 rounded-full font-bold animate-pulse">
                NEW
              </span>
            </span>
            <span className="text-white/80 text-sm font-medium">
              All goods • Secure M-Pesa • Nationwide
            </span>
          </div>
          
          {/* Arrow */}
          <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
        </div>
        
        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-success to-accent animate-gradient-shift" />
      </button>
      
      {/* Trust badges */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-muted-foreground whitespace-nowrap">
        <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
          <Shield className="w-3 h-3 text-success" />
          <span>M-Pesa Secure</span>
        </div>
        <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
          <Zap className="w-3 h-3 text-accent" />
          <span>47 Counties</span>
        </div>
      </div>
    </div>
  );
};
