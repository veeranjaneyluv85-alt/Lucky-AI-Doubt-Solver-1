
export type ClassLevel = '5' | '6' | '7' | '8' | '9' | '10' | 'Intermediate';
export type BoardType = 'CBSE' | 'ICSE' | 'State Board';
export type AppLanguage = 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Malayalam';
export type SecondLanguage = 'Hindi' | 'Sanskrit' | 'None';

export interface UserProfile {
  name: string;
  classLevel: ClassLevel;
  board: BoardType;
  language: AppLanguage;
  secondLanguage?: SecondLanguage;
}

export type TabType = 'home' | 'lucky' | 'quiz';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizState {
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  isFinished: boolean;
}
