export interface Celebrity {
  name: string;
  birthday: string; // YYYY-MM-DD format
  achievements: string[];
  category: CelebrityCategory;
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
}

export type CelebrityCategory = 'actors' | 'singers' | 'footballers' | 'basketball' | 'wwe' | 'ufc';

export interface GameState {
  currentRound: number;
  score: number;
  selectedCategory: CelebrityCategory | null;
  currentCelebrity: Celebrity | null;
  gamePhase: 'login' | 'category-selection' | 'quiz' | 'feedback' | 'game-over' | 'leaderboard';
  timeLeft: number;
  isAnswered: boolean;
  lastAnswer: {
    correct: boolean;
    selectedZodiac: string;
    correctZodiac: string;
  } | null;
  usedCelebrities: Celebrity[];
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  percentage: number;
  date: string;
  grade: string;
}

export interface User {
  username: string;
  password: string;
}