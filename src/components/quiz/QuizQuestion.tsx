import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MCQ } from "@/types/quiz";

interface QuizQuestionProps {
  question: MCQ;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswer: (selectedIndex: number) => void;
  onNext: (timeSpent: number) => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
}: QuizQuestionProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(selectedAnswer);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  // Reset timer when question changes
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setLocalSelected(selectedAnswer);
  }, [questionNumber, selectedAnswer]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [questionNumber]);

  const handleSelect = (index: number) => {
    setLocalSelected(index);
    onAnswer(index);
  };

  const handleNext = () => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    onNext(timeSpent);
  };

  const progress = (questionNumber / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-3xl mx-auto">
      {/* Progress Bar & Timer */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-primary font-semibold">
              <Clock className="w-4 h-4" />
              {formatTime(elapsedTime)}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
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
            const isSelected = localSelected === index;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect(index)}
                className={`w-full p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'bg-primary/10 border-2 border-primary text-foreground'
                    : 'bg-card border-2 border-border hover:border-primary/50 text-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 ${
                  isSelected
                    ? 'gradient-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-auto flex gap-3">
          <Button
            onClick={handleNext}
            variant="outline"
            className="flex-1 h-14 text-lg font-semibold rounded-xl border-2"
          >
            <span className="flex items-center gap-2">
              <SkipForward className="w-5 h-5" />
              {localSelected === null ? 'Skip' : 'Next'}
            </span>
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-14 text-lg font-semibold gradient-primary shadow-glow hover:opacity-90 transition-opacity rounded-xl"
          >
            {questionNumber === totalQuestions ? (
              <span className="flex items-center gap-2">
                Finish Quiz
                <ArrowRight className="w-5 h-5" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
