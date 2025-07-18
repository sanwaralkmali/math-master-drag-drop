export interface GameQuestion {
  id: string;
  content: string;
  correctCategory: string;
  explanation?: string;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind color class
}

export interface GameData {
  title: string;
  description: string;
  categories: GameCategory[];
  questions: GameQuestion[];
  instructions?: string[];
}

export interface DragItem {
  id: string;
  content: string;
  originalCategory?: string;
  isCorrect?: boolean;
}