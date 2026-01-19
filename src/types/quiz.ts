export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizConfig {
  topic: string;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizState {
  questions: MCQ[];
  currentIndex: number;
  answers: (number | null)[];
  timeTaken: number[]; // time in seconds for each question
  showResults: boolean;
}
