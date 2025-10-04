import { ArrowLeft, Tractor, Wrench, Truck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FarmingAssistant } from "@/components/FarmingAssistant";

export default function FarmEquipment() {
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
            Farm Equipment & Tools
          </h1>
          <p className="text-muted-foreground text-lg">
            Essential equipment, maintenance tips, and smart investment strategies for Kenyan farmers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-primary" />
                Essential Farm Equipment
              </CardTitle>
              <CardDescription>Core tools for Kenyan farming operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Hand Tools</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Jembes (hoes) for land preparation</li>
                  <li>• Pangas (machetes) for clearing and harvesting</li>
                  <li>• Rakes for soil leveling</li>
                  <li>• Spades and forks for digging</li>
                  <li>• Pruning shears for maintenance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mechanized Equipment</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Two-wheel tractors (power tillers)</li>
                  <li>• Four-wheel tractors for larger farms</li>
                  <li>• Ploughs and harrows</li>
                  <li>• Planters and seeders</li>
                  <li>• Sprayers (knapsack and motorized)</li>
                  <li>• Threshers and shellers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Maintenance & Care
              </CardTitle>
              <CardDescription>Keep your equipment running efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Regular Maintenance</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Clean tools after each use</li>
                  <li>• Oil moving parts regularly</li>
                  <li>• Sharpen cutting edges (jembes, pangas)</li>
                  <li>• Check for rust and apply protection</li>
                  <li>• Store in dry, covered areas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tractor Maintenance</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Regular oil changes (every 100 hours)</li>
                  <li>• Check tire pressure weekly</li>
                  <li>• Clean air filters frequently</li>
                  <li>• Inspect belts and hoses</li>
                  <li>• Service at authorized centers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Smart Investment Tips
              </CardTitle>
              <CardDescription>Making cost-effective equipment decisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Before Buying</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Assess your actual farm needs</li>
                  <li>• Consider farm size and terrain</li>
                  <li>• Research local dealers and support</li>
                  <li>• Compare prices and warranties</li>
                  <li>• Check availability of spare parts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Financing Options</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Agricultural loans from banks</li>
                  <li>• SACCO financing schemes</li>
                  <li>• Government subsidy programs</li>
                  <li>• Equipment leasing options</li>
                  <li>• Group buying for shared equipment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Shared Equipment Solutions
              </CardTitle>
              <CardDescription>Collaborative approaches to reduce costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Community Sharing</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Form farmer cooperatives</li>
                  <li>• Pool resources for expensive equipment</li>
                  <li>• Create equipment rental schedules</li>
                  <li>• Hire operators collectively</li>
                  <li>• Share maintenance costs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hiring Services</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Tractor hire services (KES 4,000-8,000/acre)</li>
                  <li>• Ploughing and harrowing services</li>
                  <li>• Spraying services with equipment</li>
                  <li>• Harvesting machinery rental</li>
                  <li>• Transport and delivery services</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Equipment Recommendations by Farm Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary">Small Farms (0-2 acres)</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Basic hand tools (jembes, pangas)</li>
                  <li>• Knapsack sprayer</li>
                  <li>• Wheelbarrow</li>
                  <li>• Watering cans/hosepipes</li>
                  <li>• Manual seeders</li>
                  <li><strong>Investment:</strong> KES 20,000-50,000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary">Medium Farms (2-10 acres)</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Two-wheel tractor</li>
                  <li>• Motorized sprayer</li>
                  <li>• Irrigation system</li>
                  <li>• Small harvesters/threshers</li>
                  <li>• Storage facilities</li>
                  <li><strong>Investment:</strong> KES 200,000-800,000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary">Large Farms (10+ acres)</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Four-wheel tractor with implements</li>
                  <li>• Advanced irrigation systems</li>
                  <li>• Combine harvesters</li>
                  <li>• Processing equipment</li>
                  <li>• Climate-controlled storage</li>
                  <li><strong>Investment:</strong> KES 1M-5M+</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <FarmingAssistant topic="farm-equipment" />
      </div>
    </div>
  );
}
