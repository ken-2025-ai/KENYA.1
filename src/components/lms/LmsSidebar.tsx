import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Circle, BookmarkCheck, ChevronDown, ChevronRight, Layers } from "lucide-react";
import type { Course } from "@/data/lmsCourses";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LmsSidebarProps {
  course: Course;
  currentLessonId: string | null;
  completedLessons: string[];
  bookmarkedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
  totalLessons: number;
}

export function LmsSidebar({
  course,
  currentLessonId,
  completedLessons,
  bookmarkedLessons,
  onSelectLesson,
  totalLessons,
}: LmsSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    () => Object.fromEntries(course.modules.map((m) => [m.id, true]))
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Progress Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Your Progress</span>
          <span className="text-sm font-black text-foreground">{progressPercent}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-semibold">
          {completedLessons.length} of {totalLessons} lessons done
        </p>
      </div>

      {/* Module List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {course.modules.map((module, mi) => {
            const moduleLessons = module.lessons.map((l) => l.id);
            const moduleCompleted = moduleLessons.every((id) => completedLessons.includes(id));
            const moduleProgress = moduleLessons.filter((id) => completedLessons.includes(id)).length;
            const isExpanded = expandedModules[module.id];

            return (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                    moduleCompleted
                      ? "bg-[hsl(var(--success))] text-white"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    {moduleCompleted ? <CheckCircle className="w-4 h-4" /> : mi + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Module {mi + 1}</p>
                    <p className="text-xs font-bold truncate text-foreground">{module.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground">{moduleProgress}/{module.lessons.length}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-4 pl-4 border-l-2 border-border/40 space-y-0.5 py-1">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;
                      const isBookmarked = bookmarkedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all",
                            isCurrent
                              ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15"
                              : "hover:bg-muted/40 text-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--success))] flex-shrink-0" />
                          ) : isCurrent ? (
                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-border flex-shrink-0" />
                          )}
                          <span className={cn(
                            "flex-1 truncate text-xs",
                            isCurrent ? "font-bold" : "font-medium"
                          )}>
                            {lesson.title}
                          </span>
                          {isBookmarked && <BookmarkCheck className="w-3 h-3 text-[hsl(var(--accent))] flex-shrink-0" />}
                          <span className="text-[9px] text-muted-foreground font-semibold flex-shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
