import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search as SearchIcon, X, FileText, HelpCircle, Sparkles } from "lucide-react";
import type { Course } from "@/data/lmsCourses";

interface LmsSearchProps {
  course: Course;
  completedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
}

interface SearchResult {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  matchType: "title" | "content" | "tip" | "quiz";
  snippet: string;
  duration: string;
}

function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), '<mark class="bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] rounded px-0.5 font-bold">$1</mark>');
}

function getSnippet(content: string, query: string, maxLen = 150): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, maxLen) + "...";
  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + query.length + 90);
  return (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : "");
}

export function LmsSearch({ course, completedLessons, onSelectLesson }: LmsSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const found: SearchResult[] = [];
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.title.toLowerCase().includes(q)) {
          found.push({ lessonId: lesson.id, lessonTitle: lesson.title, moduleTitle: module.title, matchType: "title", snippet: lesson.content.slice(0, 120) + "...", duration: lesson.duration });
          continue;
        }
        if (lesson.content.toLowerCase().includes(q)) {
          found.push({ lessonId: lesson.id, lessonTitle: lesson.title, moduleTitle: module.title, matchType: "content", snippet: getSnippet(lesson.content, q), duration: lesson.duration });
          continue;
        }
        const matchingTip = lesson.tips.find((t) => t.toLowerCase().includes(q));
        if (matchingTip) {
          found.push({ lessonId: lesson.id, lessonTitle: lesson.title, moduleTitle: module.title, matchType: "tip", snippet: matchingTip, duration: lesson.duration });
          continue;
        }
        if (lesson.quiz) {
          const quizText = [lesson.quiz.question, ...lesson.quiz.options, lesson.quiz.explanation].join(" ");
          if (quizText.toLowerCase().includes(q)) {
            found.push({ lessonId: lesson.id, lessonTitle: lesson.title, moduleTitle: module.title, matchType: "quiz", snippet: lesson.quiz.question, duration: lesson.duration });
          }
        }
      }
    }
    return found;
  }, [query, course]);

  const matchTypeConfig = {
    title: { label: "Title", icon: BookOpen, gradient: "from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]" },
    content: { label: "Content", icon: FileText, gradient: "from-[hsl(210,70%,50%)] to-[hsl(210,60%,60%)]" },
    tip: { label: "Tip", icon: Sparkles, gradient: "from-[hsl(var(--accent))] to-[hsl(var(--gold))]" },
    quiz: { label: "Quiz", icon: HelpCircle, gradient: "from-[hsl(270,60%,55%)] to-[hsl(270,50%,65%)]" },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] flex items-center justify-center">
          <SearchIcon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-foreground">Search Course</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, topics, tips, quizzes..."
          className="pl-12 pr-12 h-13 text-sm rounded-xl border-border/60 focus:border-primary/40 shadow-sm bg-card"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {query.length < 2 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
            <SearchIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Search this course</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Type at least 2 characters to search across all lessons, tips, and quizzes.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
            <SearchIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-5 font-semibold">
            {results.length} result{results.length !== 1 ? "s" : ""} for "<span className="text-foreground">{query}</span>"
          </p>
          <div className="space-y-3">
            {results.map((result, i) => {
              const config = matchTypeConfig[result.matchType];
              const isCompleted = completedLessons.includes(result.lessonId);

              return (
                <Card
                  key={`${result.lessonId}-${i}`}
                  className="group cursor-pointer hover:shadow-[var(--shadow-soft)] hover:border-primary/20 transition-all border border-border/50"
                  onClick={() => onSelectLesson(result.lessonId)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <config.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h4
                            className="font-bold text-sm group-hover:text-primary transition-colors"
                            dangerouslySetInnerHTML={{ __html: highlightMatch(result.lessonTitle, query) }}
                          />
                          <Badge variant="outline" className="text-[10px] font-bold">{config.label}</Badge>
                          {isCompleted && (
                            <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-[10px] font-bold">✓ Done</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">{result.moduleTitle} • {result.duration}</p>
                        <p
                          className="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.snippet.replace(/\*\*/g, "").replace(/\n/g, " "), query),
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
