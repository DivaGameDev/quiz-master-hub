import { motion } from "framer-motion";
import { Trophy, Target, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MCQ } from "@/types/quiz";

interface QuizResultsProps {
  questions: MCQ[];
  answers: (number | null)[];
  topic: string;
  onRestart: () => void;
}

export function QuizResults({ questions, answers, topic, onRestart }: QuizResultsProps) {
  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((correctCount / questions.length) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-success' };
    if (percentage >= 70) return { label: 'Great Job!', color: 'text-accent' };
    if (percentage >= 50) return { label: 'Good Effort!', color: 'text-warning' };
    return { label: 'Keep Learning!', color: 'text-muted-foreground' };
  };

  const grade = getGrade();

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
        className="w-full max-w-md bg-card rounded-2xl border-2 border-border p-8 shadow-lg mb-8"
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

        <div className="h-4 bg-secondary rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-success font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {correctCount} Correct
          </span>
          <span className="text-destructive font-medium flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            {questions.length - correctCount} Incorrect
          </span>
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
            const isCorrect = answers[index] === q.correctAnswer;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`p-4 rounded-xl border-2 ${
                  isCorrect
                    ? 'bg-success/5 border-success/30'
                    : 'bg-destructive/5 border-destructive/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground mb-2 line-clamp-2">{q.question}</p>
                    <div className="text-sm">
                      {!isCorrect && answers[index] !== null && (
                        <p className="text-destructive mb-1">
                          Your answer: {q.options[answers[index]!]}
                        </p>
                      )}
                      <p className="text-success">
                        Correct: {q.options[q.correctAnswer]}
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
