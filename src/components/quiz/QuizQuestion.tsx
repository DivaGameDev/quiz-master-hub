import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MCQ } from "@/types/quiz";

interface QuizQuestionProps {
  question: MCQ;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
  onNext: () => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    onAnswer(index);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    onNext();
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={questionNumber}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 flex flex-col"
      >
        <div className="bg-card rounded-2xl border-2 border-border p-6 md:p-8 shadow-lg mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            let optionState: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
            
            if (isAnswered) {
              if (index === question.correctAnswer) {
                optionState = 'correct';
              } else if (index === selectedAnswer) {
                optionState = 'incorrect';
              }
            }

            return (
              <motion.button
                key={index}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 ${
                  optionState === 'correct'
                    ? 'bg-success/10 border-2 border-success text-foreground'
                    : optionState === 'incorrect'
                    ? 'bg-destructive/10 border-2 border-destructive text-foreground'
                    : 'bg-card border-2 border-border hover:border-primary/50 text-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 ${
                  optionState === 'correct'
                    ? 'gradient-success text-success-foreground'
                    : optionState === 'incorrect'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {optionState === 'correct' ? (
                    <Check className="w-5 h-5" />
                  ) : optionState === 'incorrect' ? (
                    <X className="w-5 h-5" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className={`p-5 rounded-xl border-2 ${
                isCorrect 
                  ? 'bg-success/5 border-success/30' 
                  : 'bg-warning/5 border-warning/30'
              }`}>
                <div className="flex items-start gap-3">
                  <Lightbulb className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isCorrect ? 'text-success' : 'text-warning'
                  }`} />
                  <div>
                    <p className={`font-semibold mb-1 ${
                      isCorrect ? 'text-success' : 'text-warning'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Not quite right'}
                    </p>
                    <p className="text-muted-foreground">{question.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto"
            >
              <Button
                onClick={handleNext}
                className="w-full h-14 text-lg font-semibold gradient-primary shadow-glow hover:opacity-90 transition-opacity rounded-xl"
              >
                {questionNumber === totalQuestions ? (
                  <span className="flex items-center gap-2">
                    See Results
                    <ArrowRight className="w-5 h-5" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Next Question
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
