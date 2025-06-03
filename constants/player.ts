
export const MIN_MARRIAGE_AGE = 18;
export const MAX_CHILD_BEARING_AGE_FEMALE = 42;

// Player Dynasty Tiered Birth Probabilities
export const CHANCE_PLAYER_BIRTH_FIRST_CHILD = 0.30;
export const CHANCE_PLAYER_BIRTH_SECOND_CHILD = 0.04; // Lowered from 0.07
export const CHANCE_PLAYER_BIRTH_THIRD_CHILD = 0.008;  // Lowered from 0.015
export const CHANCE_PLAYER_BIRTH_SUBSEQUENT_CHILD = 0.005; // Lowered from 0.02

// Player Dynasty Autonomous Marriage
export const CHANCE_PLAYER_MEMBER_AUTONOMOUS_MARRIAGE = 0.15;

// Probabilities for player's "Try for Child" action (multiple births)
export const AI_CHILD_PROBABILITIES_PER_YEAR: number[] = [0.60, 0.15, 0.03, 0.01];

// Suitor Generation for Player
export const NUM_SUITORS_GENERATED_PER_YEAR = 4;
export const MIN_SUITOR_AGE = 18;
export const MAX_SUITOR_AGE = 45;
// export const MAX_SUITOR_STATUS_CAP = 85; // Removed - Max status for foreign royal suitors (now global 100)
// export const MAX_COMMON_SUITOR_STATUS_CAP = 55; // Removed - Max status for common suitors (now global 100, with "Socialite" title > 55)
export const CHANCE_FOREIGN_ROYAL_SUITOR = 0.03;
export const FOREIGN_ROYAL_SUITOR_MIN_STATUS_BONUS = 15;
export const FOREIGN_ROYAL_SUITOR_MAX_STATUS_BONUS = 30;
