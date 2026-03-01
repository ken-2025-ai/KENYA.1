import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Mary Wanjiku",
    role: "Smallholder Farmer, Kiambu",
    avatar: "MW",
    content: "Kenya Pulse Connect transformed my farming business. I now get fair prices and sell directly to markets without middlemen. My income has doubled in 6 months!",
    rating: 5,
    color: "from-primary to-primary-glow",
  },
  {
    name: "John Ochieng",
    role: "Vegetable Farmer, Kisumu",
    avatar: "JO",
    content: "The weather forecasts and farming tips helped me plan better. The mobile money integration makes transactions so easy. Best platform for farmers!",
    rating: 5,
    color: "from-accent to-accent-glow",
  },
  {
    name: "Grace Muthoni",
    role: "Buyer, Nairobi Markets",
    avatar: "GM",
    content: "I source fresh produce directly from farmers at competitive prices. The quality is excellent and the platform makes sourcing transparent and efficient.",
    rating: 5,
    color: "from-success to-primary-glow",
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/60 to-muted/30" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-5 py-2.5 rounded-full mb-6">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight">
            What Our Community{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Says
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Real stories from farmers and buyers across Kenya
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.15} direction="up">
              <div className="group h-full">
                <div className="premium-card h-full bg-card rounded-3xl border border-border/50 overflow-hidden">
                  <div className="p-7 relative">
                    {/* Quote decoration */}
                    <div className="absolute top-6 right-6">
                      <Quote className="w-10 h-10 text-primary/10 group-hover:text-accent/20 transition-colors duration-500" />
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-foreground/80 leading-relaxed mb-8 text-[15px]">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
                          <AvatarFallback className={`bg-gradient-to-br ${testimonial.color} text-primary-foreground font-bold text-sm`}>
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
