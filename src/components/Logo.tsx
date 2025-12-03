import { Leaf, TrendingUp } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizes = {
    small: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-lg" },
    default: { container: "w-10 h-10", icon: "w-5 h-5", text: "text-xl" },
    large: { container: "w-14 h-14", icon: "w-7 h-7", text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3 group">
      <div className={`${s.container} relative`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-accent to-success opacity-50 blur-md group-hover:opacity-80 transition-all duration-500 animate-pulse" />
        
        {/* Main logo container */}
        <div className={`${s.container} relative bg-gradient-to-br from-primary via-primary-glow to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-primary transition-all duration-300 group-hover:scale-110`}>
          {/* Inner gradient overlay */}
          <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-br from-white/20 to-transparent" />
          
          {/* Icons */}
          <div className="relative flex items-center justify-center">
            <Leaf className={`${s.icon} text-white absolute transform -rotate-12 -translate-x-0.5 translate-y-0.5 opacity-70`} />
            <TrendingUp className={`${s.icon} text-white relative z-10`} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className={`${s.text} font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight`}>
          Kenya Pulse
        </span>
        <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
          Connect
        </span>
      </div>
    </div>
  );
};
