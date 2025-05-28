import { v4 as uuidv4 } from 'uuid';
import { Person, Gender, GameState } from '../types';
import {
  INITIAL_YEAR,
  MAX_CHILD_BEARING_AGE_FEMALE,
  MIN_MARRIAGE_AGE,
  AVERAGE_LIFESPAN,
  LIFESPAN_VARIATION,
  CHANCE_OF_RANDOM_DEATH,
  CHANCE_OF_BIRTH_PER_YEAR,
  NUM_SUITORS_GENERATED_PER_YEAR,
  MIN_SUITOR_AGE,
  MAX_SUITOR_AGE,
  COUNTRIES,
  MALE_FIRST_NAMES,
  FEMALE_FIRST_NAMES,
  COMMON_LAST_NAMES,
  PHYSICAL_FEATURES_HAIR,
  PHYSICAL_FEATURES_EYES,
  PHYSICAL_FEATURES_BUILD,
  DYNASTY_ADJECTIVES,
  DYNASTY_NOUNS,
  ROYAL_PORTRAIT_STYLE_SEED,
  COMMONER_PORTRAIT_STYLE_SEED
} from '../constants';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generatePhysicalFeatures = (): string[] => {
  return [
    getRandomElement(PHYSICAL_FEATURES_HAIR),
    getRandomElement(PHYSICAL_FEATURES_EYES),
    getRandomElement(PHYSICAL_FEATURES_BUILD),
  ];
};

export const calculateAge = (birthYear: number, currentYear: number): number => {
  return currentYear - birthYear;
};

export const createPerson = (
  currentYear: number,
  gender: Gender,
  isRoyalBlood: boolean,
  dynastyName: string,
  generation: number,
  father?: Person,
  mother?: Person
): Person => {
  const id = uuidv4();
  const birthYear = currentYear;
  const firstName = gender === Gender.Male ? getRandomElement(MALE_FIRST_NAMES) : getRandomElement(FEMALE_FIRST_NAMES);
  const lastName = isRoyalBlood ? dynastyName : getRandomElement(COMMON_LAST_NAMES);
  
  let statusPoints = Math.floor(Math.random() * 40) + 30; // Base status for non-royals or initial royals
  let physicalFeatures = generatePhysicalFeatures();
  let originCountry = getRandomElement(COUNTRIES);

  if (father && mother) { // Inheritance
    statusPoints = Math.floor((father.statusPoints + mother.statusPoints) / 2) + (Math.floor(Math.random() * 21) - 10); // Avg +/- 10
    statusPoints = Math.max(0, Math.min(100, statusPoints));
    const hairFeatures = [father.physicalFeatures.find(f => f.includes("Hair")) || getRandomElement(PHYSICAL_FEATURES_HAIR), mother.physicalFeatures.find(f => f.includes("Hair")) || getRandomElement(PHYSICAL_FEATURES_HAIR)];
    const eyeFeatures = [father.physicalFeatures.find(f => f.includes("Eyes")) || getRandomElement(PHYSICAL_FEATURES_EYES), mother.physicalFeatures.find(f => f.includes("Eyes")) || getRandomElement(PHYSICAL_FEATURES_EYES)];
    const buildFeatures = [father.physicalFeatures.find(f => f.includes("Build")) || getRandomElement(PHYSICAL_FEATURES_BUILD), mother.physicalFeatures.find(f => f.includes("Build")) || getRandomElement(PHYSICAL_FEATURES_BUILD)];
    physicalFeatures = [getRandomElement(hairFeatures), getRandomElement(eyeFeatures), getRandomElement(buildFeatures)];
    originCountry = getRandomElement([father.originCountry, mother.originCountry]);
  }

  const portraitSeed = isRoyalBlood ? `${id}-${ROYAL_PORTRAIT_STYLE_SEED}` : `${id}-${COMMONER_PORTRAIT_STYLE_SEED}`;
  
  return {
    id,
    firstName,
    lastName,
    gender,
    birthYear,
    isAlive: true,
    originCountry,
    physicalFeatures,
    statusPoints,
    isRoyalBlood,
    isMarriedToRoyal: false,
    childrenIds: [],
    fatherId: father?.id,
    motherId: mother?.id,
    portraitUrl: `https://picsum.photos/seed/${portraitSeed}/150/150`,
    generation,
    isExcommunicated: false, // Initialize new field
  };
};

export const startNewGame = (): GameState => {
  const currentYear = INITIAL_YEAR;
  const dynastyAdj = getRandomElement(DYNASTY_ADJECTIVES);
  const dynastyNoun = getRandomElement(DYNASTY_NOUNS);
  const dynastyName = `${dynastyAdj} ${dynastyNoun}`;

  const founderKing = createPerson(currentYear - 30, Gender.Male, true, dynastyName, 0); 
  const founderQueen = createPerson(currentYear - 28, Gender.Female, false, getRandomElement(COMMON_LAST_NAMES), 0); 
  founderQueen.isMarriedToRoyal = true; 
  founderQueen.lastName = dynastyName; 
  founderQueen.statusPoints = Math.floor(Math.random() * 30) + 60; 

  founderKing.spouseId = founderQueen.id;
  founderQueen.spouseId = founderKing.id;
  
  const child1Age = 8;
  const child1 = createPerson(currentYear - child1Age, getRandomElement([Gender.Male, Gender.Female]), true, dynastyName, 1, founderKing, founderQueen);
  const child2Age = 5;
  const child2 = createPerson(currentYear - child2Age, getRandomElement([Gender.Male, Gender.Female]), true, dynastyName, 1, founderKing, founderQueen);
  
  founderKing.childrenIds.push(child1.id, child2.id);
  founderQueen.childrenIds.push(child1.id, child2.id);

  const allPeople: Record<string, Person> = {
    [founderKing.id]: founderKing,
    [founderQueen.id]: founderQueen,
    [child1.id]: child1,
    [child2.id]: child2,
  };

  return {
    allPeople,
    dynastyFounderId: founderKing.id,
    dynastyName,
    currentYear,
    potentialSuitors: generateSuitors(currentYear, NUM_SUITORS_GENERATED_PER_YEAR, dynastyName),
    selectedRoyalIdForMarriage: null,
    isMarriageModalOpen: false,
    selectedPersonDetailId: founderKing.id,
    notifications: [`The ${dynastyName} was founded in ${currentYear}! Long live King ${founderKing.firstName}!`],
  };
};

export const generateSuitors = (currentYear: number, count: number, royalDynastyName: string): Person[] => {
  const suitors: Person[] = [];
  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * (MAX_SUITOR_AGE - MIN_SUITOR_AGE + 1)) + MIN_SUITOR_AGE;
    const birthYear = currentYear - age;
    const gender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
    let suitorLastName = getRandomElement(COMMON_LAST_NAMES);
    while(suitorLastName === royalDynastyName) {
        suitorLastName = getRandomElement(COMMON_LAST_NAMES);
    }

    const id = uuidv4();
    const portraitSeed = `${id}-${COMMONER_PORTRAIT_STYLE_SEED}`;

    suitors.push({
      id,
      firstName: gender === Gender.Male ? getRandomElement(MALE_FIRST_NAMES) : getRandomElement(FEMALE_FIRST_NAMES),
      lastName: suitorLastName,
      gender,
      birthYear,
      isAlive: true,
      originCountry: getRandomElement(COUNTRIES),
      physicalFeatures: generatePhysicalFeatures(),
      statusPoints: Math.floor(Math.random() * 50) + 20, 
      isRoyalBlood: false,
      isMarriedToRoyal: false,
      childrenIds: [],
      portraitUrl: `https://picsum.photos/seed/${portraitSeed}/150/150`,
      generation: -1, 
      isExcommunicated: false,
    });
  }
  return suitors;
};

export const advanceYear = (prevState: GameState): GameState => {
  const newState = JSON.parse(JSON.stringify(prevState)) as GameState; 
  newState.currentYear += 1;
  const currentNotifications = [...newState.notifications]; // Keep notifications from tryForChild etc.
  newState.notifications = []; // Clear for yearly events, then re-add

  for (const personId in newState.allPeople) {
    const person = newState.allPeople[personId];
    if (!person.isAlive) continue;

    const age = calculateAge(person.birthYear, newState.currentYear);

    // Check for death
    const naturalDeathAge = AVERAGE_LIFESPAN - LIFESPAN_VARIATION + Math.floor(Math.random() * (LIFESPAN_VARIATION * 2 + 1));
    if (age > naturalDeathAge) {
      person.isAlive = false;
      person.deathYear = newState.currentYear;
      newState.notifications.push(`${person.firstName} ${person.lastName} has passed away at age ${age}.`);
      if (person.spouseId && newState.allPeople[person.spouseId]) {
        newState.allPeople[person.spouseId].spouseId = undefined;
      }
      continue; 
    }
    if (age > MIN_MARRIAGE_AGE && Math.random() < CHANCE_OF_RANDOM_DEATH) { 
       person.isAlive = false;
       person.deathYear = newState.currentYear;
       newState.notifications.push(`${person.firstName} ${person.lastName} has died unexpectedly at age ${age}.`);
        if (person.spouseId && newState.allPeople[person.spouseId]) {
            newState.allPeople[person.spouseId].spouseId = undefined;
        }
       continue;
    }
    // Birth logic moved to tryForChild
  }
  
  newState.potentialSuitors = generateSuitors(newState.currentYear, NUM_SUITORS_GENERATED_PER_YEAR, newState.dynastyName);

  const livingRoyalBloodMembers = Object.values(newState.allPeople).filter(p => p.isAlive && p.isRoyalBlood && !p.isExcommunicated);
  if (livingRoyalBloodMembers.length === 0 && newState.dynastyFounderId) {
      newState.notifications.push(`The ${newState.dynastyName} has fallen. There are no more living royal blood members. Game Over.`);
      newState.dynastyFounderId = null; 
  }
  newState.notifications = [...currentNotifications, ...newState.notifications]; // Combine notifications

  return newState;
};

export const marryPeople = (
  state: GameState,
  royalId: string,
  suitorId: string
): GameState => {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  const royal = newState.allPeople[royalId];
  const suitorInPool = newState.potentialSuitors.find(s => s.id === suitorId);

  if (!royal || !suitorInPool || !royal.isAlive || royal.spouseId || royal.isExcommunicated || suitorInPool.isExcommunicated) {
    newState.notifications.push("Marriage cannot be arranged. Ensure both parties are alive, eligible, and not excommunicated.");
    return newState;
  }
  
  const ageRoyal = calculateAge(royal.birthYear, newState.currentYear);
  const ageSuitor = calculateAge(suitorInPool.birthYear, newState.currentYear);

  if (ageRoyal < MIN_MARRIAGE_AGE || ageSuitor < MIN_MARRIAGE_AGE) {
      newState.notifications.push("Both individuals must be of marrying age.");
      return newState;
  }

  const newSpouse: Person = { ...suitorInPool };
  newSpouse.isMarriedToRoyal = royal.isRoyalBlood; // Becomes married to royal if the royal is actual royal blood
  newSpouse.lastName = royal.isRoyalBlood ? newState.dynastyName : newSpouse.lastName; 
  newSpouse.generation = royal.generation; 

  newState.allPeople[newSpouse.id] = newSpouse;

  royal.spouseId = newSpouse.id;
  newState.allPeople[newSpouse.id].spouseId = royal.id;
  
  const oldRoyalStatus = royal.statusPoints;
  const spouseStatus = newSpouse.statusPoints;
  const statusChange = Math.floor((spouseStatus - 50) / 5); 
  royal.statusPoints = Math.max(0, Math.min(100, royal.statusPoints + statusChange));

  newState.notifications.push(`${royal.firstName} ${royal.lastName} (Status: ${oldRoyalStatus} -> ${royal.statusPoints}) has married ${newSpouse.firstName} ${newSpouse.lastName} (Status: ${spouseStatus}).`);
  
  newState.potentialSuitors = newState.potentialSuitors.filter(s => s.id !== suitorId);
  newState.isMarriageModalOpen = false;
  newState.selectedRoyalIdForMarriage = null;

  return newState;
};

export const tryForChild = (state: GameState, motherId: string): GameState => {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  const mother = newState.allPeople[motherId];

  if (!mother) {
    newState.notifications.push("Prospective mother not found.");
    return newState;
  }
  
  const father = mother.spouseId ? newState.allPeople[mother.spouseId] : null;
  const motherAge = calculateAge(mother.birthYear, newState.currentYear);

  if (
    mother.gender === Gender.Female &&
    mother.isAlive &&
    !mother.isExcommunicated &&
    father &&
    father.isAlive &&
    !father.isExcommunicated &&
    motherAge >= MIN_MARRIAGE_AGE && 
    motherAge <= MAX_CHILD_BEARING_AGE_FEMALE
  ) {
    if (Math.random() < CHANCE_OF_BIRTH_PER_YEAR) {
      const childGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
      // Child is royal if mother or father is currently royal blood (and not excommunicated)
      const childIsRoyalBlood = (mother.isRoyalBlood && !mother.isExcommunicated) || (father.isRoyalBlood && !father.isExcommunicated);
      
      const newChild = createPerson(
        newState.currentYear,
        childGender,
        childIsRoyalBlood,
        newState.dynastyName,
        Math.max(mother.generation, father.generation) + 1,
        father,
        mother
      );
      newState.allPeople[newChild.id] = newChild;
      mother.childrenIds.push(newChild.id);
      father.childrenIds.push(newChild.id);
      newState.notifications.push(`A new child, ${newChild.firstName}, was born to ${mother.firstName} and ${father.firstName}!`);
    } else {
      newState.notifications.push(`${mother.firstName} and ${father.firstName} tried for a child, but were unsuccessful this year.`);
    }
  } else {
    let reason = "Cannot try for child: ";
    if (mother.gender !== Gender.Female) reason += "Not female. ";
    if (!mother.isAlive) reason += "Mother deceased. ";
    if (mother.isExcommunicated) reason += "Mother excommunicated. ";
    if (!father) reason += "No spouse. ";
    else if (!father.isAlive) reason += "Spouse deceased. ";
    else if (father.isExcommunicated) reason += "Spouse excommunicated. ";
    if (motherAge < MIN_MARRIAGE_AGE) reason += "Mother too young. ";
    if (motherAge > MAX_CHILD_BEARING_AGE_FEMALE) reason += "Mother past child-bearing age. ";
    newState.notifications.push(reason.trim());
  }
  return newState;
};

export const excommunicateMember = (state: GameState, personId: string): GameState => {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  const person = newState.allPeople[personId];

  if (!person) {
    newState.notifications.push("Person to excommunicate not found.");
    return newState;
  }
  if (person.id === newState.dynastyFounderId) {
    newState.notifications.push(`The founder, ${person.firstName} ${person.lastName}, cannot be excommunicated.`);
    return newState;
  }

  person.isExcommunicated = true;
  person.statusPoints = Math.max(0, person.statusPoints - 50); // Drastic status drop
  person.isRoyalBlood = false; // Revoke royal status
  person.isMarriedToRoyal = false; // No longer married to a royal

  // Sever spousal ties
  if (person.spouseId) {
    const spouse = newState.allPeople[person.spouseId];
    if (spouse) {
      spouse.spouseId = undefined;
      // If spouse was only 'marriedToRoyal' via this person, update their status too
      if (spouse.isMarriedToRoyal && !spouse.isRoyalBlood) {
         // Check if they are still married to another royal (highly unlikely in this model)
         // For simplicity, we assume this excommunication breaks their royal connection.
         spouse.isMarriedToRoyal = false;
      }
    }
    person.spouseId = undefined;
  }
  
  newState.notifications.push(`${person.firstName} ${person.lastName} has been excommunicated from the ${newState.dynastyName}!`);
  return newState;
};
