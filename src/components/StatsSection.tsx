import { TrendingUp, Users, MapPin, DollarSign } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Farmers",
    description: "Connected to markets"
  },
  {
    icon: MapPin,
    value: "47",
    label: "Counties",
    description: "Across Kenya"
  },
  {
    icon: DollarSign,
    value: "KSh 2.5M",
    label: "Daily Transactions",
    description: "Fair trade value"
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Income Increase",
    description: "Average farmer growth"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transforming Agriculture Across Kenya
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real impact, real numbers, real change in Kenyan agriculture
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 hover:shadow-glow-primary transition-smooth">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};