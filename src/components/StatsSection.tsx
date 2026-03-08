import { TrendingUp, Users, MapPin, DollarSign } from "lucide-react";
import { ScrollReveal, useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState } from "react";

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Active Farmers", color: "from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]", glow: "hsl(var(--primary) / 0.15)" },
  { icon: MapPin, value: 47, suffix: "", label: "Counties Covered", color: "from-[hsl(var(--accent))] to-[hsl(var(--gold))]", glow: "hsl(var(--accent) / 0.15)" },
  { icon: DollarSign, value: 2.5, suffix: "M", prefix: "KSh ", label: "Daily Trades", decimals: 1, color: "from-[hsl(var(--success))] to-[hsl(var(--primary))]", glow: "hsl(var(--success) / 0.15)" },
  { icon: TrendingUp, value: 85, suffix: "%", label: "Income Growth", color: "from-[hsl(var(--accent))] to-[hsl(var(--warning))]", glow: "hsl(var(--accent) / 0.15)" },
];

const AnimatedCounter = ({ target, suffix = "", prefix = "", decimals = 0, isVisible }: { target: number; suffix?: string; prefix?: string; decimals?: number; isVisible: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const duration = 2200;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return <span>{prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}</span>;
};

export const StatsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-14 md:py-20 relative overflow-hidden" ref={ref}>
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(38,30%,96%)] to-background" />
      
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight">
            Real Impact,{" "}
            <span className="text-gradient-earth animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>Real Numbers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Transforming agriculture across every corner of Kenya
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.12} direction="scale">
                <div className="group text-center relative">
                  <div className="relative bg-card border border-border/50 rounded-3xl p-6 lg:p-8 hover-lift overflow-hidden">
                    {/* Subtle glow on hover */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                      style={{ background: stat.glow }}
                    />
                    
                    <div className="relative">
                      <div className={`mx-auto w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                      </div>
                      
                      <div className="text-3xl lg:text-4xl font-black text-foreground mb-1.5 tracking-tight">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} decimals={stat.decimals || 0} isVisible={isVisible} />
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
