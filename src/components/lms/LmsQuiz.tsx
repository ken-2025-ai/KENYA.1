import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, RotateCcw, Sparkles } from "lucide-react";
import type { Quiz } from "@/data/lmsCourses";

interface LmsQuizProps {
  quiz: Quiz;
  onComplete: (passed: boolean) => void;
  previousResult?: boolean;
}

export function LmsQuiz({ quiz, onComplete, previousResult }: LmsQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(previousResult !== undefined);
  const [isCorrect, setIsCorrect] = useState(previousResult ?? false);

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === quiz.correctIndex;
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/5">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] flex items-center justify-center shadow-sm">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-foreground">Knowledge Check</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Test your understanding</p>
          </div>
          {submitted && (
            <Badge className={`font-bold text-xs px-3 py-1 ${
              isCorrect 
                ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" 
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}>
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </Badge>
          )}
        </div>

        {/* Question */}
        <p className="font-bold text-foreground mb-4">{quiz.question}</p>

        {/* Options */}
        <div className="space-y-2.5">
          {quiz.options.map((option, i) => {
            const isSelected = selected === i;
            const showCorrect = submitted && i === quiz.correctIndex;
            const showWrong = submitted && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  showCorrect
                    ? "border-[hsl(var(--success))] bg-[hsl(var(--success))]/8 text-foreground ring-2 ring-[hsl(var(--success))]/20"
                    : showWrong
                    ? "border-destructive bg-destructive/8 text-foreground ring-2 ring-destructive/20"
                    : isSelected
                    ? "border-primary bg-primary/8 text-foreground ring-2 ring-primary/20"
                    : "border-border/60 hover:border-primary/30 hover:bg-muted/30"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    showCorrect
                      ? "bg-[hsl(var(--success))] text-white"
                      : showWrong
                      ? "bg-destructive text-white"
                      : isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {showCorrect ? <CheckCircle className="w-4 h-4" /> : showWrong ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${
            isCorrect 
              ? "bg-[hsl(var(--success))]/8 border border-[hsl(var(--success))]/20" 
              : "bg-[hsl(var(--accent))]/8 border border-[hsl(var(--accent))]/20"
          }`}>
            <div className="flex items-start gap-2">
              <Sparkles className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCorrect ? "text-[hsl(var(--success))]" : "text-[hsl(var(--accent))]"}`} />
              <p className="text-muted-foreground font-medium leading-relaxed">{quiz.explanation}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          {!submitted && (
            <Button 
              onClick={handleSubmit} 
              disabled={selected === null} 
              className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-primary-foreground font-bold shadow-sm"
            >
              Submit Answer
            </Button>
          )}
          {submitted && !isCorrect && (
            <Button onClick={handleRetry} variant="outline" className="w-full rounded-xl font-bold border-border/50">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
