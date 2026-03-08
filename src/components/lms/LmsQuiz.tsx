import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, RotateCcw } from "lucide-react";
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
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Knowledge Check</CardTitle>
          {submitted && (
            <Badge className={isCorrect ? "bg-green-500" : "bg-red-500"}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-semibold text-sm">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((option, i) => {
            const isSelected = selected === i;
            const showCorrect = submitted && i === quiz.correctIndex;
            const showWrong = submitted && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-lg border-2 text-sm transition-all ${
                  showCorrect
                    ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                    : showWrong
                    ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-2">
                  {showCorrect && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  {showWrong && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                  <span className="font-medium text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className={`p-3 rounded-lg text-sm ${isCorrect ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
            <p className="font-medium">{quiz.explanation}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!submitted && (
            <Button onClick={handleSubmit} disabled={selected === null} size="sm" className="w-full">
              Submit Answer
            </Button>
          )}
          {submitted && !isCorrect && (
            <Button onClick={handleRetry} variant="outline" size="sm" className="w-full">
              <RotateCcw className="w-3 h-3 mr-1" /> Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
