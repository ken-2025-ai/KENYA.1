import { ArrowLeft, TrendingUp, BarChart3, Globe, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FarmingAssistant } from "@/components/FarmingAssistant";

export default function MarketIntelligence() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/learn")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Hub
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Market Intelligence & Trends
          </h1>
          <p className="text-muted-foreground text-lg">
            Understanding markets, pricing strategies, and demand patterns for Kenyan agricultural products
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Price Trends & Seasonality
              </CardTitle>
              <CardDescription>Understanding market cycles and pricing patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">High-Demand Periods</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>December-January:</strong> Festive season demand (vegetables, poultry)</li>
                  <li>• <strong>March-April:</strong> School opening (beans, maize)</li>
                  <li>• <strong>July-August:</strong> Mid-year school term</li>
                  <li>• <strong>September:</strong> Pre-harvest scarcity period</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Price Factors in Kenya</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Seasonal supply fluctuations</li>
                  <li>• Weather patterns and rainfall</li>
                  <li>• Transport and fuel costs</li>
                  <li>• Market day and location</li>
                  <li>• Product quality and presentation</li>
                  <li>• Competition from imports</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Market Channels in Kenya
              </CardTitle>
              <CardDescription>Different selling options and their benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Direct Markets</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Farm Gate:</strong> Lowest price but immediate cash</li>
                  <li>• <strong>Local Markets:</strong> Better prices, weekly opportunities</li>
                  <li>• <strong>Roadside Stalls:</strong> Direct to consumers</li>
                  <li>• <strong>Online Platforms:</strong> Wider reach, digital payments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Organized Markets</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Cooperatives:</strong> Collective bargaining power</li>
                  <li>• <strong>Wholesale Markets:</strong> Large volumes, lower margins</li>
                  <li>• <strong>Supermarket Contracts:</strong> Steady demand, quality requirements</li>
                  <li>• <strong>Export Markets:</strong> Premium prices, strict standards</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Value Addition Opportunities
              </CardTitle>
              <CardDescription>Increase profits through processing and packaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Simple Value Addition</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Cleaning and sorting produce</li>
                  <li>• Proper packaging and branding</li>
                  <li>• Grading by size and quality</li>
                  <li>• Pre-cutting vegetables</li>
                  <li>• Drying fruits and vegetables</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advanced Processing</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Fruit juices and purees</li>
                  <li>• Flour milling (maize, cassava, banana)</li>
                  <li>• Dairy products (yogurt, cheese)</li>
                  <li>• Honey processing and bottling</li>
                  <li>• Herbal teas and spices</li>
                  <li>• Organic fertilizers from farm waste</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Market Information Sources
              </CardTitle>
              <CardDescription>Stay informed about market conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Government Resources</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Ministry of Agriculture reports</li>
                  <li>• Kenya Agricultural and Livestock Research Organization (KALRO)</li>
                  <li>• County agricultural offices</li>
                  <li>• Agricultural Information Resource Centers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Digital Platforms</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• SMS price alerts (e.g., M-Farm)</li>
                  <li>• Mobile apps for market prices</li>
                  <li>• WhatsApp farmer groups</li>
                  <li>• Radio agricultural programs</li>
                  <li>• Social media market groups</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>High-Value Crops in Kenyan Markets (2024)</CardTitle>
            <CardDescription>Trending crops with strong market demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary">Export Champions</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Avocado:</strong> KES 15-40/fruit (export KES 80-120)</li>
                  <li>• <strong>French Beans:</strong> KES 80-150/kg</li>
                  <li>• <strong>Snow Peas:</strong> KES 120-200/kg</li>
                  <li>• <strong>Cut Flowers:</strong> Premium prices</li>
                  <li>• <strong>Macadamia:</strong> KES 200-300/kg</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary">Urban Market Favorites</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Cherry Tomatoes:</strong> KES 150-250/kg</li>
                  <li>• <strong>Broccoli:</strong> KES 120-180/kg</li>
                  <li>• <strong>Lettuce (Hydroponics):</strong> KES 80-150/head</li>
                  <li>• <strong>Bell Peppers:</strong> KES 200-300/kg</li>
                  <li>• <strong>Strawberries:</strong> KES 400-600/kg</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary">Consistent Demand</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Kales (Sukuma Wiki):</strong> KES 20-40/bunch</li>
                  <li>• <strong>Tomatoes:</strong> KES 40-120/kg</li>
                  <li>• <strong>Onions:</strong> KES 50-150/kg</li>
                  <li>• <strong>Potatoes:</strong> KES 30-70/kg</li>
                  <li>• <strong>Indigenous Vegetables:</strong> KES 30-60/bunch</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Smart Marketing Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Timing Your Sales</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Sell when supply is low and demand is high. Consider storing produce (where possible) to sell during scarcity periods for 30-50% higher prices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Building Relationships</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Establish regular customers through consistent quality and reliability. Hotels, schools, and supermarkets prefer dependable suppliers willing to sign contracts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Presentation</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Clean, sorted, and well-packaged produce can command 20-40% premium prices. Invest in proper crates, bags, and branding materials.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Risk Management</h4>
                <p className="text-sm text-muted-foreground">
                  Diversify your crop portfolio to spread risk. Don't put all crops to market at once. Use contracts and forward selling where possible to lock in prices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <FarmingAssistant topic="market-intelligence" />
      </div>
    </div>
  );
}
