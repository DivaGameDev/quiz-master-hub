import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, BookOpen, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuizConfig } from "@/types/quiz";

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

const questionCounts = [5, 10, 15, 20];
const difficulties = [
  { value: 'easy' as const, label: 'Easy', icon: BookOpen, description: 'Basic concepts' },
  { value: 'medium' as const, label: 'Medium', icon: Zap, description: 'Requires analysis' },
  { value: 'hard' as const, label: 'Hard', icon: Trophy, description: 'Expert level' },
];

export function QuizSetup({ onStart, isLoading }: QuizSetupProps) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart({ topic: topic.trim(), count, difficulty });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-glow mb-6">
          <Brain className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Quiz<span className="text-gradient">Master</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          AI-powered quizzes on any topic. Test your knowledge and learn something new.
        </p>
      </motion.div>

      {/* Setup Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-8"
      >
        {/* Topic Input */}
        <div className="space-y-3">
          <Label htmlFor="topic" className="text-base font-medium">
            What would you like to learn about?
          </Label>
          <div className="relative">
            <Input
              id="topic"
              type="text"
              placeholder="e.g., World History, Machine Learning, Space Exploration..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-14 pl-5 pr-12 text-lg rounded-xl border-2 border-border bg-card shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
              required
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Number of Questions</Label>
          <div className="grid grid-cols-4 gap-3">
            {questionCounts.map((num) => (
              <motion.button
                key={num}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCount(num)}
                className={`py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                  count === num
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/50"
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Difficulty Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map(({ value, label, icon: Icon, description }) => (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDifficulty(value)}
                className={`py-4 px-4 rounded-xl text-center transition-all ${
                  difficulty === value
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/50"
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{label}</div>
                <div className={`text-xs mt-1 ${
                  difficulty === value ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="w-full h-14 text-lg font-semibold gradient-primary shadow-glow hover:opacity-90 transition-opacity rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse-soft">Generating Quiz...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Quiz
              </span>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
