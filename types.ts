export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string; // Dynasty name for royals, original for others
  gender: Gender;
  birthYear: number;
  deathYear?: number;
  isAlive: boolean;
  originCountry: string;
  physicalFeatures: string[];
  statusPoints: number; // 0-100
  isRoyalBlood: boolean; // True if born into the dynasty
  isMarriedToRoyal: boolean; // True if married into the dynasty
  spouseId?: string;
  childrenIds: string[];
  fatherId?: string;
  motherId?: string;
  portraitUrl: string;
  generation: number; // Generation number from the founder
  isExcommunicated: boolean; // New field
}

export interface GameState {
  allPeople: Record<string, Person>;
  dynastyFounderId: string | null;
  dynastyName: string;
  currentYear: number;
  potentialSuitors: Person[];
  selectedRoyalIdForMarriage: string | null;
  isMarriageModalOpen: boolean;
  selectedPersonDetailId: string | null;
  notifications: string[];
}

export interface Trait {
  name: string;
  type: 'positive' | 'negative' | 'neutral';
}