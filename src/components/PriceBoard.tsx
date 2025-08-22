import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const marketPrices = [
  { crop: "Maize", price: "KSh 45/kg", trend: "up", change: "+5%" },
  { crop: "Beans", price: "KSh 120/kg", trend: "up", change: "+8%" },
  { crop: "Tomatoes", price: "KSh 80/kg", trend: "down", change: "-3%" },
  { crop: "Onions", price: "KSh 60/kg", trend: "stable", change: "0%" },
  { crop: "Potatoes", price: "KSh 50/kg", trend: "up", change: "+12%" },
  { crop: "Cabbage", price: "KSh 35/kg", trend: "up", change: "+6%" }
];

export const PriceBoard = () => {
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live Market Prices
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time pricing from markets across Kenya
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-medium">
          <CardHeader className="bg-gradient-primary text-primary-foreground">
            <CardTitle className="text-2xl text-center">Today's Market Board</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketPrices.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-smooth">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.crop}</h3>
                    <p className="text-2xl font-bold text-primary">{item.price}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {getTrendIcon(item.trend)}
                      <span className={`font-medium ${getTrendColor(item.trend)}`}>
                        {item.change}
                      </span>
                    </div>
                    <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}>
                      {item.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Last updated: Today, 2:30 PM EAT • Source: Kenya Agricultural Commodity Exchange
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};