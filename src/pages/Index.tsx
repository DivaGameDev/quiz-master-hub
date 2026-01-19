import { useState } from "react";
import { QuizSetup } from "@/components/quiz/QuizSetup";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizResults } from "@/components/quiz/QuizResults";
import { useToast } from "@/hooks/use-toast";
import type { MCQ, QuizConfig, QuizState } from "@/types/quiz";

type Screen = 'setup' | 'quiz' | 'results';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: [],
    showResults: false,
  });
  const { toast } = useToast();

  const generateQuiz = async (quizConfig: QuizConfig) => {
    setIsLoading(true);
    setConfig(quizConfig);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-mcqs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            topic: quizConfig.topic,
            count: quizConfig.count,
            difficulty: quizConfig.difficulty,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      const questions: MCQ[] = data.questions;

      if (!questions || questions.length === 0) {
        throw new Error('No questions generated');
      }

      setQuizState({
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        showResults: false,
      });
      setScreen('quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: prev.answers.map((a, i) => 
        i === prev.currentIndex ? selectedIndex : a
      ),
    }));
  };

  const handleNext = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
    } else {
      setScreen('results');
    }
  };

  const handleRestart = () => {
    setScreen('setup');
    setConfig(null);
    setQuizState({
      questions: [],
      currentIndex: 0,
      answers: [],
      showResults: false,
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {screen === 'setup' && (
        <QuizSetup onStart={generateQuiz} isLoading={isLoading} />
      )}
      
      {screen === 'quiz' && quizState.questions.length > 0 && (
        <QuizQuestion
          question={quizState.questions[quizState.currentIndex]}
          questionNumber={quizState.currentIndex + 1}
          totalQuestions={quizState.questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}
      
      {screen === 'results' && config && (
        <QuizResults
          questions={quizState.questions}
          answers={quizState.answers}
          topic={config.topic}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
};

export default Index;
