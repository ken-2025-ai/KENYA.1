import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search as SearchIcon, X, FileText, HelpCircle } from "lucide-react";
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
  return text.replace(new RegExp(`(${escaped})`, "gi"), '<mark class="bg-amber-300/40 dark:bg-amber-500/30 rounded px-0.5">$1</mark>');
}

function getSnippet(content: string, query: string, maxLen = 150): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, maxLen) + "...";
  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + query.length + 90);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";
  return prefix + content.slice(start, end) + suffix;
}

export function LmsSearch({ course, completedLessons, onSelectLesson }: LmsSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const found: SearchResult[] = [];

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        // Title match
        if (lesson.title.toLowerCase().includes(q)) {
          found.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleTitle: module.title,
            matchType: "title",
            snippet: lesson.content.slice(0, 120) + "...",
            duration: lesson.duration,
          });
          continue; // Don't duplicate
        }

        // Content match
        if (lesson.content.toLowerCase().includes(q)) {
          found.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleTitle: module.title,
            matchType: "content",
            snippet: getSnippet(lesson.content, q),
            duration: lesson.duration,
          });
          continue;
        }

        // Tips match
        const matchingTip = lesson.tips.find((t) => t.toLowerCase().includes(q));
        if (matchingTip) {
          found.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleTitle: module.title,
            matchType: "tip",
            snippet: matchingTip,
            duration: lesson.duration,
          });
          continue;
        }

        // Quiz match
        if (lesson.quiz) {
          const quizText = [lesson.quiz.question, ...lesson.quiz.options, lesson.quiz.explanation].join(" ");
          if (quizText.toLowerCase().includes(q)) {
            found.push({
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              moduleTitle: module.title,
              matchType: "quiz",
              snippet: lesson.quiz.question,
              duration: lesson.duration,
            });
          }
        }
      }
    }

    return found;
  }, [query, course]);

  const matchTypeConfig = {
    title: { label: "Title", icon: BookOpen, color: "bg-primary/10 text-primary" },
    content: { label: "Content", icon: FileText, color: "bg-blue-500/10 text-blue-600" },
    tip: { label: "Tip", icon: BookOpen, color: "bg-amber-500/10 text-amber-600" },
    quiz: { label: "Quiz", icon: HelpCircle, color: "bg-purple-500/10 text-purple-600" },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, topics, tips, quizzes..."
          className="pl-10 pr-10 h-11 text-sm"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {query.length < 2 ? (
        <div className="text-center py-16">
          <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">Search this course</h3>
          <p className="text-sm text-muted-foreground">
            Type at least 2 characters to search across all lessons, tips, and quizzes.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground">
            Try different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
          </p>
          <div className="space-y-3">
            {results.map((result, i) => {
              const config = matchTypeConfig[result.matchType];
              const isCompleted = completedLessons.includes(result.lessonId);

              return (
                <Card
                  key={`${result.lessonId}-${i}`}
                  className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
                  onClick={() => onSelectLesson(result.lessonId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        <config.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4
                            className="font-semibold text-sm"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(result.lessonTitle, query),
                            }}
                          />
                          <Badge variant="outline" className="text-[10px]">
                            {config.label}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-500/10 text-green-600 text-[10px]">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">{result.moduleTitle} • {result.duration}</p>
                        <p
                          className="text-xs text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              result.snippet.replace(/\*\*/g, "").replace(/\n/g, " "),
                              query
                            ),
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
