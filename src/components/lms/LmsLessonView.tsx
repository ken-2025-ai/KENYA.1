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

  // Parse content for rendering (basic markdown-like formatting)
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("**") && block.endsWith("**")) {
        return (
          <h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">
            {block.replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (block.startsWith("|")) {
        const rows = block.split("\n").filter((r) => !r.match(/^\|[-\s|]+\|$/));
        const headers = rows[0]?.split("|").filter(Boolean).map((h) => h.trim());
        const data = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));
        return (
          <div key={i} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {headers?.map((h, hi) => (
                    <th key={hi} className="border border-border/50 bg-muted/50 px-3 py-2 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-border/50 px-3 py-2">
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
      // Handle numbered lists
      if (block.match(/^\d+\./m)) {
        const items = block.split("\n").filter(Boolean);
        return (
          <ol key={i} className="list-decimal list-inside space-y-1.5 my-3 text-sm text-muted-foreground">
            {items.map((item, li) => (
              <li key={li} dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^\d+\.\s*/, "")) }} />
            ))}
          </ol>
        );
      }
      // Handle bullet lists
      if (block.match(/^-\s/m)) {
        const items = block.split("\n").filter(Boolean);
        return (
          <ul key={i} className="space-y-1.5 my-3">
            {items.map((item, li) => (
              <li key={li} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^-\s*/, "")) }} />
              </li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return (
        <p
          key={i}
          className="text-sm text-muted-foreground leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formatInline(block) }}
        />
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Badge variant="outline" className="text-[10px]">{moduleTitle}</Badge>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
          <span>•</span>
          <span>Lesson {lessonIndex + 1} of {totalLessons}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{lesson.title}</h1>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleBookmark}
              className={isBookmarked ? "text-amber-500" : "text-muted-foreground"}
            >
              {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Video if available */}
      {lesson.videoId && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-lg">
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
      <Card className="mb-6">
        <CardContent className="p-6 md:p-8">
          {renderContent(lesson.content)}
        </CardContent>
      </Card>

      {/* Pro Tips */}
      {lesson.tips.length > 0 && (
        <Card className="mb-6 border-2 border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm">Pro Tips</h3>
            </div>
            <div className="space-y-2">
              {lesson.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-500 font-bold">💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz */}
      {lesson.quiz && (
        <div className="mb-6">
          <LmsQuiz quiz={lesson.quiz} onComplete={onQuizComplete} previousResult={quizResult} />
        </div>
      )}

      {/* Notes Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-2 w-full text-left"
          >
            <StickyNote className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">My Notes</span>
            {localNote && <Badge variant="secondary" className="text-[10px]">Saved</Badge>}
          </button>
          {showNotes && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                placeholder="Write your notes for this lesson..."
                className="min-h-[100px] text-sm"
              />
              <Button size="sm" onClick={handleSaveNote} variant="outline">
                Save Notes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation & Completion */}
      <div className="flex items-center justify-between gap-4 pb-8">
        <Button
          variant="outline"
          onClick={onPrev ?? undefined}
          disabled={!onPrev}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <Button
          onClick={() => {
            onComplete();
            if (onNext) onNext();
          }}
          className={`gap-2 ${isCompleted ? "bg-green-600 hover:bg-green-700" : `bg-gradient-to-r ${course.color}`}`}
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
          className="gap-1"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
