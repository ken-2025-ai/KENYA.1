import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, TrendingUp, Users, DollarSign, ShieldCheck, Tractor, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First Platform",
    description: "Access markets and insights from any device, anywhere in Kenya. Works offline too.",
    color: "from-primary to-primary-glow",
    accent: "group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)]",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Prices",
    description: "Live pricing data from major markets. Make informed selling decisions instantly.",
    color: "from-accent to-accent-glow",
    accent: "group-hover:shadow-[0_0_40px_hsl(var(--accent)/0.3)]",
  },
  {
    icon: Users,
    title: "Direct Market Access",
    description: "Connect directly with buyers. No middlemen means better prices for you.",
    color: "from-success to-primary-glow",
    accent: "group-hover:shadow-[0_0_40px_hsl(var(--success)/0.3)]",
  },
  {
    icon: Tractor,
    title: "Equipment Leasing",
    description: "Rent tractors and machinery from owners near you. Pay only for what you need.",
    color: "from-accent to-warning",
    highlight: true,
    link: "/machinery",
    accent: "group-hover:shadow-[0_0_40px_hsl(var(--accent)/0.3)]",
  },
  {
    icon: DollarSign,
    title: "M-Pesa Integration",
    description: "Secure mobile money payments. Fast, safe transactions for all trades.",
    color: "from-success to-primary",
    accent: "group-hover:shadow-[0_0_40px_hsl(var(--success)/0.3)]",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Verified farmers and buyers with ratings ensure reliable trading partners.",
    color: "from-primary-glow to-accent",
    accent: "group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)]",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-drift" />
      <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-drift" style={{ animationDelay: '-4s' }} />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Platform Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
            Everything Farmers Need{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>
              in One Platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From market access to agricultural insights, we provide comprehensive tools 
            to help Kenyan farmers thrive in the digital economy.
          </p>
        </ScrollReveal>

        {/* Features grid with 3D perspective */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-container">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            const cardContent = (
              <div className={`premium-card h-full rounded-2xl bg-card border border-border/50 overflow-hidden ${feature.accent} ${feature.highlight ? 'border-accent/30' : ''}`}>
                {/* Shimmer overlay */}
                <div className="shimmer-overlay h-full">
                  <div className="p-7 relative">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[60px]" />
                    
                    {/* Icon with glow ring */}
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                      {feature.highlight && (
                        <span className="ml-2 text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
                          New
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-5">
                      {feature.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-3 group-hover:translate-y-0">
                      <span className="text-sm">Explore</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <ScrollReveal key={index} delay={index * 0.1} direction="up">
                {feature.link ? (
                  <Link to={feature.link} className="group block h-full">
                    {cardContent}
                  </Link>
                ) : (
                  <div className="group h-full cursor-pointer">
                    {cardContent}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
