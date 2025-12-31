
export enum ClassLevel {
  CLASS_6 = 'Class 6',
  CLASS_7 = 'Class 7',
  CLASS_8 = 'Class 8',
  CLASS_9 = 'Class 9',
  CLASS_10 = 'Class 10',
  INTERMEDIATE = 'Intermediate',
  BTECH = 'B.Tech'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export type Board = 'CBSE' | 'CISCE' | 'SSC';
export type IntermediateGroup = 'MPC' | 'BiPC' | 'MBiPC';
export type BTechCourse = 'CSE' | 'ECE' | 'AI & ML' | 'AI' | 'EEE' | 'CIVIL';
export type SecondLanguage = 'Hindi' | 'Sanskrit';

export type PermissionType = 'always' | 'once' | 'none';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'lucky';
  content: string;
  image?: string; // base64 image data
  timestamp: number;
  grounding?: GroundingChunk[];
}

export interface ChatSession {
  id: string;
  title: string;
  classLevel: ClassLevel;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type TabType = 'home' | 'ask' | 'quiz' | 'profile';

export interface UserProfile {
  name: string;
  classLevel: ClassLevel;
  board?: Board;
  group?: IntermediateGroup;
  course?: BTechCourse;
  secondLanguage?: SecondLanguage;
  goal: string;
  avatarId: number;
  joinedAt: number;
  completedQuizzes: Record<string, number>;
  permissions: {
    camera: PermissionType;
    gallery: PermissionType;
  };
}
