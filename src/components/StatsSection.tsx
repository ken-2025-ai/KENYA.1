import { TrendingUp, Users, MapPin, DollarSign } from "lucide-react";
import { ScrollReveal, useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState } from "react";

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Active Farmers", description: "Connected to markets", color: "from-primary to-primary-glow" },
  { icon: MapPin, value: 47, suffix: "", label: "Counties", description: "Across Kenya", color: "from-accent to-accent-glow" },
  { icon: DollarSign, value: 2.5, suffix: "M", prefix: "KSh ", label: "Daily Transactions", description: "Fair trade value", decimals: 1, color: "from-success to-primary" },
  { icon: TrendingUp, value: 85, suffix: "%", label: "Income Increase", description: "Average farmer growth", color: "from-accent to-warning" },
];

const AnimatedCounter = ({ target, suffix = "", prefix = "", decimals = 0, isVisible }: { target: number; suffix?: string; prefix?: string; decimals?: number; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span>{prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}</span>;
};

export const StatsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-accent/[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-[150px] animate-pulse" />
      
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Real Impact</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight">
            Transforming Agriculture{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Across Kenya
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real impact, real numbers, real change in Kenyan agriculture
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.15} direction="scale">
                <div className="group text-center relative">
                  {/* Glow background on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 lg:p-8 hover-lift">
                    {/* Icon */}
                    <div className={`mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-primary-foreground" />
                    </div>
                    
                    {/* Counter */}
                    <div className="text-3xl lg:text-4xl font-black text-foreground mb-2 animate-count-glow tracking-tight">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} decimals={stat.decimals || 0} isVisible={isVisible} />
                    </div>
                    <div className="text-base lg:text-lg font-bold text-foreground mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
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
