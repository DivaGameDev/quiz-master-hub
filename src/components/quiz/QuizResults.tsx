import { motion } from "framer-motion";
import { Trophy, Target, RotateCcw, CheckCircle2, XCircle, Clock, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MCQ } from "@/types/quiz";

interface QuizResultsProps {
  questions: MCQ[];
  answers: (number | null)[];
  timeTaken: number[];
  topic: string;
  onRestart: () => void;
}

export function QuizResults({ questions, answers, timeTaken, topic, onRestart }: QuizResultsProps) {
  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);

  const skippedCount = answers.filter(a => a === null).length;
  const incorrectCount = questions.length - correctCount - skippedCount;
  const totalTime = timeTaken.reduce((sum, t) => sum + t, 0);

  const percentage = Math.round((correctCount / questions.length) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-success' };
    if (percentage >= 70) return { label: 'Great Job!', color: 'text-accent' };
    if (percentage >= 50) return { label: 'Good Effort!', color: 'text-warning' };
    return { label: 'Keep Learning!', color: 'text-muted-foreground' };
  };

  const grade = getGrade();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 pt-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full gradient-primary shadow-glow mb-6">
          <Trophy className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className={`font-display text-4xl md:text-5xl font-bold mb-2 ${grade.color}`}>
          {grade.label}
        </h1>
        <p className="text-muted-foreground text-lg">
          Quiz completed on <span className="font-semibold text-foreground">{topic}</span>
        </p>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-card rounded-2xl border-2 border-border p-8 shadow-lg mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">Your Score</span>
          </div>
          <div className="text-3xl font-display font-bold text-gradient">
            {percentage}%
          </div>
        </div>

        <div className="h-4 bg-secondary rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
            <div className="text-2xl font-bold text-success">{correctCount}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <XCircle className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <div className="text-2xl font-bold text-destructive">{incorrectCount}</div>
            <div className="text-xs text-muted-foreground">Incorrect</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted border border-border">
            <SkipForward className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold text-muted-foreground">{skippedCount}</div>
            <div className="text-xs text-muted-foreground">Skipped</div>
          </div>
        </div>

        {/* Total Time */}
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-medium">Total Time:</span>
          <span className="font-bold text-primary">{formatTotalTime(totalTime)}</span>
        </div>
      </motion.div>

      {/* Question Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl mb-8"
      >
        <h2 className="font-display text-xl font-bold mb-4">Question Breakdown</h2>
        <div className="space-y-3">
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const isSkipped = userAnswer === null;
            const isCorrect = userAnswer === q.correctAnswer;

            let statusColor = 'bg-muted border-border';
            let StatusIcon = SkipForward;
            let iconBg = 'bg-muted-foreground';

            if (!isSkipped) {
              if (isCorrect) {
                statusColor = 'bg-success/5 border-success/30';
                StatusIcon = CheckCircle2;
                iconBg = 'bg-success text-success-foreground';
              } else {
                statusColor = 'bg-destructive/5 border-destructive/30';
                StatusIcon = XCircle;
                iconBg = 'bg-destructive text-destructive-foreground';
              }
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`p-4 rounded-xl border-2 ${statusColor}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-foreground line-clamp-2">{q.question}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(timeTaken[index] || 0)}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      {isSkipped ? (
                        <p className="text-muted-foreground italic">Skipped</p>
                      ) : !isCorrect && (
                        <p className="text-destructive">
                          Your answer: {q.options[userAnswer!]}
                        </p>
                      )}
                      <p className="text-success">
                        Correct: {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-muted-foreground text-xs mt-2 italic">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Restart Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={onRestart}
          className="w-full h-14 text-lg font-semibold gradient-primary shadow-glow hover:opacity-90 transition-opacity rounded-xl"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start New Quiz
        </Button>
      </motion.div>
    </div>
  );
}
