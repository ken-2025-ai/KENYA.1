import { Smartphone, TrendingUp, Users, DollarSign, ShieldCheck, Tractor, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Access markets from any device. Works seamlessly offline across all of Kenya.",
    gradient: "from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]",
    tag: null,
  },
  {
    icon: TrendingUp,
    title: "Live Prices",
    description: "Real-time pricing from major Kenyan markets. Make smarter selling decisions.",
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--gold))]",
    tag: null,
  },
  {
    icon: Users,
    title: "Direct Access",
    description: "Connect directly with buyers. No middlemen — better prices guaranteed.",
    gradient: "from-[hsl(var(--success))] to-[hsl(var(--primary-glow))]",
    tag: null,
  },
  {
    icon: Tractor,
    title: "Equipment Leasing",
    description: "Rent tractors & machinery from verified owners near you. Pay what you need.",
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--warning))]",
    tag: "New",
    link: "/machinery",
  },
  {
    icon: DollarSign,
    title: "M-Pesa Ready",
    description: "Secure mobile money payments. Instant, trusted transactions for every trade.",
    gradient: "from-[hsl(var(--success))] to-[hsl(var(--primary))]",
    tag: null,
  },
  {
    icon: ShieldCheck,
    title: "Verified Partners",
    description: "Rated farmers and buyers with trust scores ensure reliable trading.",
    gradient: "from-[hsl(var(--primary-glow))] to-[hsl(var(--accent))]",
    tag: null,
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-28 md:py-36 relative overflow-hidden section-warm">
      {/* Background orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] organic-blob bg-[hsl(var(--primary)/0.04)] blur-[120px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] organic-blob bg-[hsl(var(--accent)/0.04)] blur-[100px]" style={{ animationDelay: '-5s' }} />

      <div className="container mx-auto px-4 relative">
        {/* Section header — asymmetric */}
        <div className="max-w-7xl mx-auto mb-20">
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
                From market intelligence to equipment leasing — we provide the complete 
                toolkit for modern Kenyan agriculture.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Features — 3-column with alternating sizes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHighlighted = index === 3; // Equipment leasing

            const inner = (
              <div className={`group relative h-full rounded-3xl overflow-hidden transition-all duration-500 ${
                isHighlighted 
                  ? 'bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-white shadow-strong' 
                  : 'bg-card border border-border/60 hover:border-[hsl(var(--accent)/0.3)] hover:shadow-strong'
              }`}>
                {/* Shimmer */}
                <div className="shimmer-overlay h-full">
                  <div className="p-8 relative h-full flex flex-col">
                    {/* Corner accent */}
                    {!isHighlighted && (
                      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[hsl(var(--accent)/0.04)] to-transparent rounded-bl-[80px]" />
                    )}

                    {/* Tag */}
                    {feature.tag && (
                      <div className="absolute top-6 right-6">
                        <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest ${
                          isHighlighted ? 'bg-white/20 text-white' : 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                        }`}>
                          {feature.tag}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                        isHighlighted 
                          ? 'bg-white/15 shadow-lg' 
                          : `bg-gradient-to-br ${feature.gradient} shadow-lg`
                      }`}>
                        <Icon className={`w-7 h-7 ${isHighlighted ? 'text-white' : 'text-white'}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-bold mb-3 ${
                      isHighlighted ? 'text-white' : 'text-foreground group-hover:text-[hsl(var(--primary))]'
                    } transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed flex-1 ${
                      isHighlighted ? 'text-white/75' : 'text-muted-foreground'
                    }`}>
                      {feature.description}
                    </p>

                    {/* Arrow */}
                    <div className={`mt-5 flex items-center font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-3 group-hover:translate-y-0 ${
                      isHighlighted ? 'text-white/90' : 'text-[hsl(var(--primary))]'
                    }`}>
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <ScrollReveal key={index} delay={index * 0.08} direction="up">
                {feature.link ? (
                  <Link to={feature.link} className="block h-full">{inner}</Link>
                ) : (
                  <div className="h-full cursor-pointer">{inner}</div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
