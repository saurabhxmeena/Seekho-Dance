export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type DanceStyle =
  | 'Bollywood'
  | 'Traditional'
  | 'Rajasthani'
  | 'Haryanvi'
  | 'Wedding'
  | 'Punjabi';

export interface DanceStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  timestampStart: number; // in seconds
  timestampEnd: number; // in seconds
  countNotation: string; // e.g. "1 - 2 - 3 & 4 | Step right, dip left"
  instructorTip: string;
  focalArea: 'Footwork' | 'Upper Body' | 'Weight Shift' | 'Groove' | 'Full Combo' | 'Performance';
  tempoGuide: 'Half Tempo (0.5x)' | 'Practice Tempo (0.75x)' | 'Original BPM (1.0x)';
  keyCounts: string[];
}

export interface DanceRoutine {
  id: string;
  slug: string;
  title: string; // Song Title
  artist: string; // Original Song Artist
  creator: string; // Dance Instructor / Choreographer
  creatorHandle: string;
  creatorAvatar: string;
  creatorBio: string;
  creatorChannelUrl?: string;
  coverImage: string;
  videoUrl: string;
  previewVideoUrl?: string;
  difficulty: Difficulty;
  style: DanceStyle;
  bpm: number;
  durationMinutes: string; // e.g. "14 min breakdown"
  description: string;
  keyTechnique: string;
  learningCheckpoints: string[];
  steps: DanceStep[];
  isTrending?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBeginnerPick?: boolean;
}

export interface DanceCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  sampleSongs: string[];
}

export interface Instructor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  specialty: string;
  bio: string;
  location: string;
  featuredRoutineId: string;
}

export interface SearchFilterState {
  query: string;
  style: string;
  difficulty: string;
  sortBy: 'featured' | 'newest' | 'bpm';
}
