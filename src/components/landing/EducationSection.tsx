import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Sprout, Cloud, Bug, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const topics = [
  { icon: Sprout, label: "Crop Management", color: "text-[hsl(var(--success))]" },
  { icon: Cloud, label: "Weather Insights", color: "text-[hsl(var(--primary))]" },
  { icon: Bug, label: "Pest Control", color: "text-[hsl(var(--accent))]" },
];

export const EducationSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { ref: progressRef, isVisible: progressVisible } = useScrollReveal();

  return (
    <section id="education" className="py-14 md:py-20 relative overflow-hidden">
      {/* Warm background */}
      <div className="absolute inset-0 section-warm" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="absolute top-[25%] right-[5%] w-[400px] h-[400px] organic-blob bg-[hsl(var(--primary)/0.03)] blur-[120px]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.15)] px-4 py-2 rounded-full mb-6">
                <GraduationCap className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
                <span className="text-xs font-bold text-[hsl(var(--primary))] uppercase tracking-[0.15em]">Learning Hub</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[1.05] tracking-tight">
                Master modern{" "}
                <span className="text-gradient-earth animate-gradient-shift" style={{ backgroundSize: '200% auto' }}>
                  farming
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Expert agricultural knowledge, weather forecasts, and best practices 
                tailored for Kenyan conditions. Boost your yields and profits.
              </p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {topics.map((topic, i) => (
                  <ScrollReveal key={i} delay={0.1 * i} direction="up">
                    <div className="flex items-center gap-2.5 bg-card border border-border/50 px-5 py-3 rounded-2xl hover:border-[hsl(var(--accent)/0.3)] hover:shadow-soft hover-lift transition-all duration-300 cursor-pointer">
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
                Explore Resources
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Button>
            </ScrollReveal>

            {/* Right: Visual card */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative" ref={progressRef}>
                <div className="absolute -inset-4 bg-gradient-to-br from-[hsl(var(--primary)/0.1)] to-[hsl(var(--accent)/0.1)] rounded-[2rem] blur-3xl opacity-50" />
                
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-strong overflow-hidden">
                  <div className="space-y-5">
                    {[
                      { title: "Soil Management", progress: 85, color: "bg-[hsl(var(--success))]" },
                      { title: "Irrigation Methods", progress: 60, color: "bg-[hsl(var(--primary))]" },
                      { title: "Pest Prevention", progress: 40, color: "bg-[hsl(var(--accent))]" },
                    ].map((course, i) => (
                      <div key={i} className="bg-muted/40 rounded-2xl p-5 hover:bg-muted/60 transition-all duration-300 group/card cursor-pointer">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-foreground group-hover/card:text-[hsl(var(--primary))] transition-colors">{course.title}</span>
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
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute -top-3 -right-3 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-5 py-2 rounded-full shadow-lg font-bold text-sm animate-float-rotate">
                    ✨ Free
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
