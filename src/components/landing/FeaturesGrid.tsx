import { Smartphone, TrendingUp, Users, DollarSign, ShieldCheck, Tractor, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Access markets from any device. Works seamlessly offline across all of Kenya.",
    gradient: "from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]",
  },
  {
    icon: TrendingUp,
    title: "Live Prices",
    description: "Real-time pricing from major Kenyan markets. Make smarter selling decisions.",
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--gold))]",
  },
  {
    icon: Users,
    title: "Direct Access",
    description: "Connect directly with buyers. No middlemen — better prices guaranteed.",
    gradient: "from-[hsl(var(--success))] to-[hsl(var(--primary-glow))]",
  },
  {
    icon: Tractor,
    title: "Equipment Leasing",
    description: "Rent tractors & machinery from verified owners near you.",
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--warning))]",
    tag: "New",
    link: "/machinery",
  },
  {
    icon: DollarSign,
    title: "M-Pesa Ready",
    description: "Secure mobile money payments. Instant, trusted transactions for every trade.",
    gradient: "from-[hsl(var(--success))] to-[hsl(var(--primary))]",
  },
  {
    icon: ShieldCheck,
    title: "Verified Partners",
    description: "Rated farmers and buyers with trust scores ensure reliable trading.",
    gradient: "from-[hsl(var(--primary-glow))] to-[hsl(var(--accent))]",
  },
];

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  const Icon = feature.icon;
  const inner = (
    <div className="group relative h-full w-[300px] sm:w-[320px] flex-shrink-0 rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-[hsl(var(--accent)/0.3)] hover:shadow-strong transition-all duration-500">
      <div className="shimmer-overlay h-full">
        <div className="p-7 relative h-full flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[hsl(var(--accent)/0.04)] to-transparent rounded-bl-[60px]" />
          
          {feature.tag && (
            <div className="absolute top-5 right-5">
              <span className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                {feature.tag}
              </span>
            </div>
          )}

          <div className="mb-5">
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            {feature.description}
          </p>

          <div className="mt-4 flex items-center font-semibold text-sm text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            Learn more
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );

  return feature.link ? (
    <Link to={feature.link} className="block h-full flex-shrink-0">{inner}</Link>
  ) : (
    <div className="h-full cursor-pointer flex-shrink-0">{inner}</div>
  );
};

export const FeaturesGrid = () => {
  // Duplicate features for seamless infinite loop
  const doubledFeatures = [...features, ...features];

  return (
    <section id="features" className="py-28 md:py-36 relative overflow-hidden section-warm">
      {/* Background orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] organic-blob bg-[hsl(var(--primary)/0.04)] blur-[120px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] organic-blob bg-[hsl(var(--accent)/0.04)] blur-[100px]" style={{ animationDelay: '-5s' }} />

      <div className="relative">
        {/* Section header */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <ScrollReveal direction="left">
                <div className="inline-flex items-center gap-2 bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.15)] px-4 py-2 rounded-full mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                  <span className="text-xs font-bold text-[hsl(var(--primary))] uppercase tracking-[0.15em]">Why Kenya Pulse</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight">
                  Everything you need,{" "}
                  <span className="text-gradient-earth animate-gradient-shift inline-block" style={{ backgroundSize: '200% auto' }}>
                    one platform
                  </span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.15}>
                <p className="text-lg text-muted-foreground leading-relaxed lg:text-right">
                  From market intelligence to equipment leasing — the complete 
                  toolkit for modern Kenyan agriculture.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Horizontal ticker marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling track */}
          <div 
            className="flex gap-6 py-2 hover:[animation-play-state:paused]"
            style={{
              animation: 'marquee 40s linear infinite',
              width: 'max-content',
            }}
          >
            {doubledFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
