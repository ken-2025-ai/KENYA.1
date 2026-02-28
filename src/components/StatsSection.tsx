import { TrendingUp, Users, MapPin, DollarSign } from "lucide-react";
import { ScrollReveal, useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState } from "react";

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Active Farmers", description: "Connected to markets" },
  { icon: MapPin, value: 47, suffix: "", label: "Counties", description: "Across Kenya" },
  { icon: DollarSign, value: 2.5, suffix: "M", prefix: "KSh ", label: "Daily Transactions", description: "Fair trade value", decimals: 1 },
  { icon: TrendingUp, value: 85, suffix: "%", label: "Income Increase", description: "Average farmer growth" },
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
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5" ref={ref}>
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transforming Agriculture Across Kenya
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real impact, real numbers, real change in Kenyan agriculture
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.15} direction="scale">
                <div className="text-center group">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:shadow-glow-primary group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} decimals={stat.decimals || 0} isVisible={isVisible} />
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
