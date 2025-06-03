
import { RivalDynastyColorScheme } from '../types/index'; 

export const NUM_RIVAL_DYNASTIES = 4;
export const RIVAL_DYNASTY_INITIAL_MEMBERS_MIN = 2;
export const RIVAL_DYNASTY_INITIAL_MEMBERS_MAX = 4;
export const RIVAL_DYNASTY_INITIAL_TREASURY_MIN = 100;
export const RIVAL_DYNASTY_INITIAL_TREASURY_MAX = 500;
export const RIVAL_STATUS_MIN_INITIAL = 10;
export const RIVAL_STATUS_MAX_INITIAL = 40;
export const RIVAL_LIFESPAN = 70;
export const RIVAL_LIFESPAN_VARIATION = 15;
export const CHANCE_RIVAL_DEATH_PER_YEAR_OLD_AGE = 0.05;
export const RIVAL_MAX_CHILDREN = 4;
export const RIVAL_BASE_INCOME = 10;
export const RIVAL_INCOME_PER_STATUS_POINT = 0.5;
export const RIVAL_STATUS_FROM_MONARCH_WEIGHT = 0.5;
export const RIVAL_STATUS_FROM_TREASURY_FACTOR = 0.01;
export const RIVAL_STATUS_PER_MEMBER_FACTOR = 0.25;
export const RIVAL_MIN_MARRIAGE_AGE = 16;
export const RIVAL_MAX_CHILD_BEARING_AGE = 40;

export const CHANCE_RIVAL_MONARCH_BIRTH_FIRST_CHILD = 0.25;
export const CHANCE_RIVAL_MONARCH_BIRTH_SECOND_CHILD = 0.15;
export const CHANCE_RIVAL_MONARCH_BIRTH_SUBSEQUENT_CHILD = 0.05;

export const AI_CHANCE_SEEK_MARRIAGE_PER_YEAR = 0.3;

export const RIVAL_DYNASTY_COLOR_SCHEMES: RivalDynastyColorScheme[] = [
  { primary: 'bg-rose-700', secondary: 'bg-rose-500', accent: 'border-rose-800', textOnPrimary: 'text-white', textOnSecondary: 'text-rose-100' },
  { primary: 'bg-sky-700', secondary: 'bg-sky-500', accent: 'border-sky-800', textOnPrimary: 'text-white', textOnSecondary: 'text-sky-100' },
  { primary: 'bg-purple-700', secondary: 'bg-purple-500', accent: 'border-purple-800', textOnPrimary: 'text-white', textOnSecondary: 'text-purple-100' },
  { primary: 'bg-amber-600', secondary: 'bg-amber-400', accent: 'border-amber-700', textOnPrimary: 'text-white', textOnSecondary: 'text-amber-50' },
  { primary: 'bg-lime-600', secondary: 'bg-lime-400', accent: 'border-lime-700', textOnPrimary: 'text-white', textOnSecondary: 'text-lime-50' },
  { primary: 'bg-indigo-700', secondary: 'bg-indigo-500', accent: 'border-indigo-800', textOnPrimary: 'text-white', textOnSecondary: 'text-indigo-100' },
];
