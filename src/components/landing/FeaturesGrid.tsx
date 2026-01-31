import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, TrendingUp, Users, DollarSign, ShieldCheck, Tractor, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First Platform",
    description: "Access markets and insights from any device, anywhere in Kenya. Works offline too.",
    color: "from-primary to-primary-glow",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Prices",
    description: "Live pricing data from major markets. Make informed selling decisions instantly.",
    color: "from-accent to-accent-glow",
  },
  {
    icon: Users,
    title: "Direct Market Access",
    description: "Connect directly with buyers. No middlemen means better prices for you.",
    color: "from-success to-primary-glow",
  },
  {
    icon: Tractor,
    title: "Equipment Leasing",
    description: "Rent tractors and machinery from owners near you. Pay only for what you need.",
    color: "from-accent to-warning",
    highlight: true,
    link: "/machinery",
  },
  {
    icon: DollarSign,
    title: "M-Pesa Integration",
    description: "Secure mobile money payments. Fast, safe transactions for all trades.",
    color: "from-success to-primary",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Verified farmers and buyers with ratings ensure reliable trading partners.",
    color: "from-primary-glow to-accent",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(var(--primary)/0.03)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(var(--accent)/0.03)_0%,_transparent_50%)]" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold text-primary">Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Everything Farmers Need{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              in One Platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From market access to agricultural insights, we provide comprehensive tools 
            to help Kenyan farmers thrive in the digital economy.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            const cardContent = (
              <Card className={`h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer border-2 ${feature.highlight ? 'border-accent/30 bg-gradient-to-br from-accent/5 to-transparent' : 'border-transparent hover:border-primary/20'}`}>
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                      {feature.highlight && (
                        <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
                          NEW
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );

            return feature.link ? (
              <Link key={index} to={feature.link} className="group">
                {cardContent}
              </Link>
            ) : (
              <div key={index} className="group">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
