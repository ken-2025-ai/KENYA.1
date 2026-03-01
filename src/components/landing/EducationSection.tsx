import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Sprout, Cloud, Bug, GraduationCap } from "lucide-react";
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
    <section id="education" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-muted/40 to-accent/[0.02]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Floating orb */}
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[120px] animate-drift" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full mb-8">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary uppercase tracking-wider">Learning Hub</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
                Master Modern{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>
                  Farming Techniques
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Access expert agricultural knowledge, weather forecasts, and best practices 
                tailored for Kenyan farming conditions. Increase your yields and profits.
              </p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {topics.map((topic, i) => (
                  <ScrollReveal key={i} delay={0.1 * i} direction="up">
                    <div className="flex items-center gap-2.5 bg-card border border-border/50 px-5 py-3 rounded-2xl hover:border-primary/30 hover:shadow-soft hover-lift transition-all duration-300 cursor-pointer">
                      <topic.icon className={`w-5 h-5 ${topic.color}`} />
                      <span className="text-sm font-semibold text-foreground">{topic.label}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <Button 
                variant="hero" 
                size={isMobile ? "default" : "lg"} 
                className="group min-h-[56px] font-bold shadow-glow-primary hover:scale-[1.03] transition-all duration-300"
                onClick={() => {
                  if ('vibrate' in navigator) navigator.vibrate(50);
                  navigate("/learn");
                }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Learning Resources
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Button>
            </ScrollReveal>

            {/* Right: Visual card */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative" ref={progressRef}>
                {/* Background glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 to-accent/15 rounded-[2rem] blur-3xl opacity-60" />
                
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-strong overflow-hidden">
                  {/* Shimmer */}
                  <div className="shimmer-overlay">
                    {/* Learning progress cards */}
                    <div className="space-y-5">
                      {[
                        { title: "Soil Management", progress: 85, color: "bg-success" },
                        { title: "Irrigation Methods", progress: 60, color: "bg-primary" },
                        { title: "Pest Prevention", progress: 40, color: "bg-accent" },
                      ].map((course, i) => (
                        <div key={i} className="bg-muted/40 rounded-2xl p-5 hover:bg-muted/60 transition-all duration-300 group/card cursor-pointer">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-foreground group-hover/card:text-primary transition-colors">{course.title}</span>
                            <span className="text-sm font-bold text-muted-foreground bg-muted rounded-full px-3 py-1">{course.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${course.color} rounded-full relative overflow-hidden`}
                              style={{
                                width: progressVisible ? `${course.progress}%` : "0%",
                                transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.2}s`,
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground px-5 py-2.5 rounded-full shadow-lg font-bold text-sm animate-float-rotate">
                    ✨ Free Access
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
