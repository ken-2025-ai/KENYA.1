import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

export const FeatureCard = ({ icon: Icon, title, description, highlight = false }: FeatureCardProps) => {
  return (
    <Card className={`group cursor-pointer transition-smooth hover:shadow-medium ${highlight ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
      <CardHeader className="text-center">
        <div className={`mx-auto w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow-primary transition-smooth ${highlight ? 'animate-pulse-grow' : ''}`}>
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};