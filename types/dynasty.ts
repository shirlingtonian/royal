
import { RivalPerson } from './person';

export interface RivalDynastyColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  textOnPrimary: string;
  textOnSecondary: string;
}

export interface RivalDynasty {
  id: string;
  name: string;
  status: number;
  country: string;
  members: Record<string, RivalPerson>;
  treasury: number;
  currentMonarchId: string | null;
  dynastyFoundedYear: number;
  colorScheme: RivalDynastyColorScheme;
  isAlliedWithPlayer?: boolean;
}

export interface EffectiveStatusBreakdown {
  baseRoyalStatus: number;
  itemStatusBoost: number;
  totalEffectiveStatus: number;
}
