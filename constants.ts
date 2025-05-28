
export const INITIAL_YEAR = 1000;
export const MAX_CHILD_BEARING_AGE_FEMALE = 42;
export const MIN_MARRIAGE_AGE = 18;
export const AVERAGE_LIFESPAN = 80; // Base lifespan
export const LIFESPAN_VARIATION = 15; // Max +/- years from average
export const CHANCE_OF_RANDOM_DEATH = 0.002; // Per year for non-elderly
export const CHANCE_OF_BIRTH_PER_YEAR = 0.35; // For eligible couples
export const NUM_SUITORS_GENERATED_PER_YEAR = 5;
export const MIN_SUITOR_AGE = 18;
export const MAX_SUITOR_AGE = 45;

export const COUNTRIES: string[] = [
  "Eldoria", "Valerium", "Crystalia", "Ironhold", "Sylvandell",
  "Meridia", "Aerilon", "Pyronia", "Aquaria", "Terragard"
];

export const MALE_FIRST_NAMES: string[] = [
  "Arthur", "William", "Henry", "Richard", "John", "Edward", "Charles", "James", "Robert", "Louis",
  "Theodore", "Frederick", "Leopold", "Maximilian", "Philip"
];

export const FEMALE_FIRST_NAMES: string[] = [
  "Eleanor", "Isabella", "Matilda", "Victoria", "Elizabeth", "Catherine", "Mary", "Anne", "Margaret", "Sophia",
  "Charlotte", "Amelia", "Josephine", "Constance", "Beatrice"
];

export const COMMON_LAST_NAMES: string[] = [ // For non-royals initially
  "Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson",
  "Thomas", "Jackson", "White", "Harris", "Martin"
];

export const PHYSICAL_FEATURES_HAIR: string[] = ["Black Hair", "Brown Hair", "Blonde Hair", "Red Hair", "Silver Hair"];
export const PHYSICAL_FEATURES_EYES: string[] = ["Blue Eyes", "Green Eyes", "Brown Eyes", "Hazel Eyes", "Grey Eyes"];
export const PHYSICAL_FEATURES_BUILD: string[] = ["Slender Build", "Athletic Build", "Average Build", "Sturdy Build"];

export const DYNASTY_ADJECTIVES: string[] = ["Golden", "Iron", "Silver", "Sun", "Moon", "Star", "Lion", "Eagle", "Dragon"];
export const DYNASTY_NOUNS: string[] = ["Dynasty", "House", "Lineage", "Bloodline", "Clan", "Empire"];

export const ROYAL_PORTRAIT_STYLE_SEED = "regal";
export const COMMONER_PORTRAIT_STYLE_SEED = "common";
    