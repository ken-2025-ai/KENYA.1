import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Circle, Lock, Bookmark, BookmarkCheck, ChevronDown, ChevronRight } from "lucide-react";
import type { Course, Module } from "@/data/lmsCourses";
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
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</span>
          <Badge variant="secondary" className="text-xs">{progressPercent}%</Badge>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-700`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {completedLessons.length}/{totalLessons} lessons completed
        </p>
      </div>

      {/* Module List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {course.modules.map((module, mi) => {
            const moduleLessons = module.lessons.map((l) => l.id);
            const moduleCompleted = moduleLessons.every((id) => completedLessons.includes(id));
            const moduleProgress = moduleLessons.filter((id) => completedLessons.includes(id)).length;
            const isExpanded = expandedModules[module.id];

            return (
              <div key={module.id} className="mb-1">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-muted/60 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-muted-foreground">Module {mi + 1}</p>
                    <p className="text-sm font-semibold truncate">{module.title}</p>
                  </div>
                  {moduleCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{moduleProgress}/{module.lessons.length}</span>
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-3 border-l-2 border-border/50 pl-2 space-y-0.5">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;
                      const isBookmarked = bookmarkedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded-md text-left transition-all text-sm",
                            isCurrent
                              ? "bg-primary/10 border border-primary/20 text-primary font-semibold"
                              : "hover:bg-muted/50 text-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="flex-1 truncate text-xs">{lesson.title}</span>
                          {isBookmarked && <BookmarkCheck className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">{lesson.duration}</span>
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
