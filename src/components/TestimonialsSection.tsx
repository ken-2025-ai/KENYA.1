import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Mary Wanjiku",
    role: "Smallholder Farmer, Kiambu",
    avatar: "MW",
    content: "Kenya Pulse Connect transformed my farming business. I now get fair prices and sell directly to markets without middlemen. My income has doubled in 6 months!"
  },
  {
    name: "John Ochieng",
    role: "Vegetable Farmer, Kisumu",
    avatar: "JO",
    content: "The weather forecasts and farming tips helped me plan better. The mobile money integration makes transactions so easy. Best platform for farmers!"
  },
  {
    name: "Grace Muthoni",
    role: "Buyer, Nairobi Markets",
    avatar: "GM",
    content: "I source fresh produce directly from farmers at competitive prices. The quality is excellent and the platform makes sourcing transparent and efficient."
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-muted-foreground">
            Real stories from farmers and buyers across Kenya
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.15} direction="up">
              <Card className="group hover:shadow-medium hover:-translate-y-1 transition-all duration-500 h-full">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary mb-4 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
