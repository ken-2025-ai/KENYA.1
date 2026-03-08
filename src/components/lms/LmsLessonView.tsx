import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  StickyNote,
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";
import type { Lesson, Course } from "@/data/lmsCourses";
import { LmsQuiz } from "./LmsQuiz";

interface LmsLessonViewProps {
  lesson: Lesson;
  course: Course;
  moduleTitle: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  note: string;
  quizResult?: boolean;
  onComplete: () => void;
  onToggleBookmark: () => void;
  onSaveNote: (note: string) => void;
  onQuizComplete: (passed: boolean) => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  lessonIndex: number;
  totalLessons: number;
}

export function LmsLessonView({
  lesson,
  course,
  moduleTitle,
  isCompleted,
  isBookmarked,
  note,
  quizResult,
  onComplete,
  onToggleBookmark,
  onSaveNote,
  onQuizComplete,
  onPrev,
  onNext,
  lessonIndex,
  totalLessons,
}: LmsLessonViewProps) {
  const [showNotes, setShowNotes] = useState(!!note);
  const [localNote, setLocalNote] = useState(note);

  const handleSaveNote = () => {
    onSaveNote(localNote);
  };

  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("**") && block.endsWith("**")) {
        return (
          <h3 key={i} className="text-lg font-black text-foreground mt-8 mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            {block.replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (block.startsWith("|")) {
        const rows = block.split("\n").filter((r) => !r.match(/^\|[-\s|]+\|$/));
        const headers = rows[0]?.split("|").filter(Boolean).map((h) => h.trim());
        const data = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
        return (
          <div key={i} className="overflow-x-auto my-5 rounded-xl border border-border/50 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  {headers?.map((h, hi) => (
                    <th key={hi} className="px-4 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wider border-b border-border/50">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, ri) => (
                  <tr key={ri} className="hover:bg-muted/20 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 border-b border-border/30 text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      if (block.match(/^\d+\./m)) {
        const items = block.split("\n").filter(Boolean);
        return (
          <ol key={i} className="space-y-2 my-4 pl-1">
            {items.map((item, li) => (
              <li key={li} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {li + 1}
                </span>
                <span className="pt-0.5" dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^\d+\.\s*/, "")) }} />
              </li>
            ))}
          </ol>
        );
      }
      if (block.match(/^-\s/m)) {
        const items = block.split("\n").filter(Boolean);
        return (
          <ul key={i} className="space-y-2 my-4">
            {items.map((item, li) => (
              <li key={li} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-primary-glow mt-2 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^-\s*/, "")) }} />
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={i}
          className="text-sm text-muted-foreground leading-[1.8] my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(block) }}
        />
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>')
      .replace(/`(.+?)`/g, '<code class="bg-primary/8 text-primary px-1.5 py-0.5 rounded-md text-xs font-mono font-semibold">$1</code>');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Lesson Header */}
      <div className="mb-8">
        {/* Breadcrumb bar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-primary/8 text-primary px-2.5 py-1 rounded-full font-bold">
              <Layers className="w-3 h-3" />
              {moduleTitle}
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </div>
            <span className="text-border">•</span>
            <span className="font-semibold">{lessonIndex + 1}/{totalLessons}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBookmark}
            className={`rounded-full transition-all ${isBookmarked ? "text-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10" : "text-muted-foreground hover:text-foreground"}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span className="text-xs ml-1">{isBookmarked ? "Saved" : "Save"}</span>
          </Button>
        </div>

        {/* Progress bar for lesson position */}
        <div className="h-1 bg-muted rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] rounded-full transition-all duration-500"
            style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">{lesson.title}</h1>
      </div>

      {/* Video */}
      {lesson.videoId && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-[var(--shadow-medium)] ring-1 ring-border/30">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>
      )}

      {/* Lesson Content */}
      <div className="bg-card rounded-2xl border border-border/50 p-7 md:p-10 mb-8 shadow-sm">
        <div className="prose-custom">{renderContent(lesson.content)}</div>
      </div>

      {/* Pro Tips */}
      {lesson.tips.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[hsl(var(--accent))]/20 bg-gradient-to-br from-[hsl(var(--accent))]/5 to-[hsl(var(--gold))]/5 p-6 mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--accent))]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--gold))] flex items-center justify-center shadow-sm">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-black text-foreground">Pro Tips</h3>
            </div>
            <div className="space-y-3">
              {lesson.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--accent))]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-3 h-3 text-[hsl(var(--accent))]" />
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiz */}
      {lesson.quiz && (
        <div className="mb-8">
          <LmsQuiz quiz={lesson.quiz} onComplete={onQuizComplete} previousResult={quizResult} />
        </div>
      )}

      {/* Notes */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden mb-8 shadow-sm">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-3 w-full text-left px-6 py-4 hover:bg-muted/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-sm text-foreground flex-1">My Notes</span>
          {localNote && (
            <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-[10px] font-bold">Saved</Badge>
          )}
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showNotes ? "rotate-90" : ""}`} />
        </button>
        {showNotes && (
          <div className="px-6 pb-5 pt-1 space-y-3 border-t border-border/30">
            <Textarea
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder="Write your notes for this lesson..."
              className="min-h-[120px] text-sm border-border/50 focus:border-primary/30 rounded-xl resize-none"
            />
            <Button size="sm" onClick={handleSaveNote} className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold">
              Save Notes
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pb-10">
        <Button
          variant="outline"
          onClick={onPrev ?? undefined}
          disabled={!onPrev}
          className="gap-1.5 rounded-xl font-semibold border-border/50 hover:border-border disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <Button
          onClick={() => {
            onComplete();
            if (onNext) onNext();
          }}
          className={`gap-2 rounded-xl font-bold shadow-sm px-6 ${
            isCompleted
              ? "bg-[hsl(var(--success))] hover:bg-[hsl(145,65%,30%)] text-white"
              : "bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-primary-foreground shadow-[var(--glow-primary)]"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4" /> Completed
            </>
          ) : (
            <>
              Mark Complete <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onNext ?? undefined}
          disabled={!onNext}
          className="gap-1.5 rounded-xl font-semibold border-border/50 hover:border-border disabled:opacity-30"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
