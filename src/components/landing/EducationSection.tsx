import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Sprout, Cloud, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const topics = [
  { icon: Sprout, label: "Crop Management", color: "text-success" },
  { icon: Cloud, label: "Weather Insights", color: "text-primary" },
  { icon: Bug, label: "Pest Control", color: "text-accent" },
];

export const EducationSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { ref: progressRef, isVisible: progressVisible } = useScrollReveal();

  return (
    <section id="education" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/50 to-accent/5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Learning Hub</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Master Modern{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Farming Techniques
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Access expert agricultural knowledge, weather forecasts, and best practices 
                tailored for Kenyan farming conditions. Increase your yields and profits.
              </p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {topics.map((topic, i) => (
                  <ScrollReveal key={i} delay={0.1 * i} direction="up">
                    <div className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-full hover:border-primary/40 hover:shadow-soft transition-all duration-300">
                      <topic.icon className={`w-4 h-4 ${topic.color}`} />
                      <span className="text-sm font-medium text-foreground">{topic.label}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <Button 
                variant="hero" 
                size={isMobile ? "default" : "lg"} 
                className="group min-h-[52px] font-semibold shadow-glow-primary hover:scale-105 transition-all duration-300"
                onClick={() => {
                  if ('vibrate' in navigator) navigator.vibrate(50);
                  navigate("/learn");
                }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Learning Resources
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </ScrollReveal>

            {/* Right: Visual card */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative" ref={progressRef}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                
                <div className="relative bg-card border border-border rounded-3xl p-8 shadow-strong">
                  {/* Mock learning cards */}
                  <div className="space-y-4">
                    {[
                      { title: "Soil Management", progress: 85, color: "bg-success" },
                      { title: "Irrigation Methods", progress: 60, color: "bg-primary" },
                      { title: "Pest Prevention", progress: 40, color: "bg-accent" },
                    ].map((course, i) => (
                      <div key={i} className="bg-muted/50 rounded-xl p-4 hover:bg-muted/80 transition-colors duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground">{course.title}</span>
                          <span className="text-sm text-muted-foreground">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${course.color} rounded-full`}
                            style={{
                              width: progressVisible ? `${course.progress}%` : "0%",
                              transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.2}s`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative badge */}
                  <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-lg font-semibold text-sm animate-float">
                    Free Access
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
