import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Mary Wanjiku",
    role: "Smallholder Farmer, Kiambu",
    avatar: "MW",
    content: "Kenya Pulse Connect transformed my business. I now sell directly to markets — my income doubled in just 6 months!",
    rating: 5,
    gradient: "from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]",
  },
  {
    name: "John Ochieng",
    role: "Vegetable Farmer, Kisumu",
    avatar: "JO",
    content: "Weather forecasts and farming tips helped me plan better. The M-Pesa integration makes transactions seamless.",
    rating: 5,
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--gold))]",
  },
  {
    name: "Grace Muthoni",
    role: "Buyer, Nairobi Markets",
    avatar: "GM",
    content: "I source fresh produce directly from farmers at competitive prices. The quality is consistently excellent.",
    rating: 5,
    gradient: "from-[hsl(var(--success))] to-[hsl(var(--primary-glow))]",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-14 md:py-20 relative overflow-hidden section-earth">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Asymmetric header */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid lg:grid-cols-2 gap-6 items-end">
            <ScrollReveal direction="left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
                Voices from{" "}
                <span className="text-gradient-warm">the field</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <p className="text-lg text-muted-foreground lg:text-right">
                Real stories from farmers and buyers building their futures with Kenya Pulse.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((t, index) => (
            <ScrollReveal key={index} delay={index * 0.12} direction="up">
              <div className="group h-full">
                <div className="h-full bg-card rounded-3xl border border-border/50 p-7 hover-lift relative overflow-hidden">
                  {/* Decorative quote */}
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-[hsl(var(--accent)/0.08)] group-hover:text-[hsl(var(--accent)/0.15)] transition-colors duration-500" />
                  
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[hsl(var(--accent))] fill-[hsl(var(--accent))]" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground/80 leading-relaxed mb-8 text-[15px]">
                    "{t.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3.5 pt-5 border-t border-border/40 mt-auto">
                    <Avatar className="w-11 h-11 ring-2 ring-border/50 group-hover:ring-[hsl(var(--accent)/0.3)] transition-all duration-300">
                      <AvatarFallback className={`bg-gradient-to-br ${t.gradient} text-white font-bold text-sm`}>
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
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
