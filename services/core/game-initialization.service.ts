
import { v4 as uuidv4 } from 'uuid';
import { GameState, Person, Gender, RivalDynasty, RivalPerson, RivalDynastyColorScheme } from '../../types/index';
import {
  INITIAL_YEAR, COUNTRIES, EUROPEAN_DYNASTY_BASENAMES, INITIAL_TREASURY, PURCHASABLE_ITEMS,
  NUM_RIVAL_DYNASTIES, RIVAL_DYNASTY_INITIAL_MEMBERS_MIN, RIVAL_DYNASTY_INITIAL_MEMBERS_MAX,
  RIVAL_DYNASTY_INITIAL_TREASURY_MIN, RIVAL_DYNASTY_INITIAL_TREASURY_MAX, RIVAL_DYNASTY_COLOR_SCHEMES,
  RIVAL_STATUS_MIN_INITIAL, RIVAL_STATUS_MAX_INITIAL, RIVAL_MIN_MARRIAGE_AGE, RIVAL_MAX_CHILD_BEARING_AGE,
  RIVAL_MAX_CHILDREN, MALE_FIRST_NAMES, FEMALE_FIRST_NAMES
} from '../../constants';
import { getRandomElement, getRandomInt } from '../util/utility.service';
import { createPerson, createRivalPerson, generateNewSuitors, calculateAge } from '../entities/person.service'; 
import { calculateEffectiveDynastyStatus, updatePlayerSuccession } from '../player/dynasty.service';
import { updateRivalDynastyTitles } from '../entities/rival.service';


export const startNewGame = (): GameState => { 
  const dynastyFounderId = uuidv4();
  const playerDynastyOrigin = "Kingdom of England"; 
  const dynastyBaseName = getRandomElement(EUROPEAN_DYNASTY_BASENAMES) || "NobleHouse";
  const dynastyName = `House of ${dynastyBaseName}`;
  
  const founderGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
  const founder = createPerson(
    INITIAL_YEAR - getRandomInt(20,35), 
    founderGender, 
    true, 
    dynastyName, 
    0, 
    undefined, 
    undefined, 
    true, 
    false, 
    undefined, 
    playerDynastyOrigin 
  );
  founder.id = dynastyFounderId; 
  founder.spouseId = undefined; 

  const allPeople: Record<string, Person> = {
    [founder.id]: founder,
  };

  const tempInitialStatusForSuitors = calculateEffectiveDynastyStatus(allPeople, {}, PURCHASABLE_ITEMS).totalEffectiveStatus;
  const initialSuitors = generateNewSuitors(INITIAL_YEAR, dynastyName, playerDynastyOrigin, allPeople, tempInitialStatusForSuitors);


  const rivalDynasties: RivalDynasty[] = [];
  const usedDynastyNames: string[] = [dynastyBaseName];
  const usedCountries: string[] = [playerDynastyOrigin]; 
  const defaultCountry = "Unknown Realm";

  for (let i = 0; i < NUM_RIVAL_DYNASTIES; i++) {
    let rivalDynastyBase: string;
    do {
      rivalDynastyBase = getRandomElement(EUROPEAN_DYNASTY_BASENAMES) || "RivalHouse";
    } while (usedDynastyNames.includes(rivalDynastyBase));
    usedDynastyNames.push(rivalDynastyBase);

    let rivalCountry: string;
    const availableCountries = COUNTRIES.filter(c => !usedCountries.includes(c));
    if (availableCountries.length > 0) {
        rivalCountry = getRandomElement(availableCountries) || defaultCountry;
        usedCountries.push(rivalCountry);
    } else {
        rivalCountry = getRandomElement(COUNTRIES.filter(c => c !== playerDynastyOrigin)) || defaultCountry; 
        if (rivalCountry === defaultCountry && COUNTRIES.length > 0) rivalCountry = getRandomElement(COUNTRIES) || defaultCountry; 
    }
    
    const rivalDynastyName = `House of ${rivalDynastyBase} of ${rivalCountry}`;
    const colorScheme: RivalDynastyColorScheme = RIVAL_DYNASTY_COLOR_SCHEMES[i % RIVAL_DYNASTY_COLOR_SCHEMES.length];
    
    const rivalFounderGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
    const rivalFounderAge = getRandomInt(25, 45);
    const rivalFounderBirthYear = INITIAL_YEAR - rivalFounderAge;
    const rivalFounder = createRivalPerson(rivalFounderBirthYear, rivalFounderGender, rivalDynastyName, true);
    
    const members: Record<string, RivalPerson> = { [rivalFounder.id]: rivalFounder };
    let currentMonarchId: string | null = rivalFounder.id;
    
    if (Math.random() < 0.8) {
        const rivalSpouseGender = rivalFounderGender === Gender.Male ? Gender.Female : Gender.Male;
        rivalFounder.spouseInfo = { 
            firstName: (rivalSpouseGender === Gender.Male ? getRandomElement(MALE_FIRST_NAMES) : getRandomElement(FEMALE_FIRST_NAMES)) || "SpouseName", 
            lastName: getRandomElement(EUROPEAN_DYNASTY_BASENAMES) || "SpouseLastName", 
            statusPoints: getRandomInt(30, 60) 
        };
    }

    const numInitialMembers = getRandomInt(RIVAL_DYNASTY_INITIAL_MEMBERS_MIN, RIVAL_DYNASTY_INITIAL_MEMBERS_MAX);
    let childrenCount = 0;
    if (rivalFounder.spouseInfo && numInitialMembers > 1) {
        const maxChildrenToCreate = Math.min(RIVAL_MAX_CHILDREN, numInitialMembers -1); 
        for (let j = 0; j < maxChildrenToCreate; j++) {
            const founderAgeAtChildBirth = calculateAge(rivalFounder.birthYear, INITIAL_YEAR - getRandomInt(1,15));
            if (founderAgeAtChildBirth < RIVAL_MAX_CHILD_BEARING_AGE && founderAgeAtChildBirth > RIVAL_MIN_MARRIAGE_AGE && childrenCount < RIVAL_MAX_CHILDREN) {
                const childGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
                const childAge = getRandomInt(1, Math.min(15, calculateAge(rivalFounder.birthYear, INITIAL_YEAR) - (RIVAL_MIN_MARRIAGE_AGE + 1) ));
                if (childAge < 1) continue; 
                const child = createRivalPerson(INITIAL_YEAR - childAge, childGender, rivalDynastyName, false);
                child.statusPoints = getRandomInt(15, 50);
                members[child.id] = child;
                childrenCount++;
            }
        }
    }
     rivalFounder.childrenCount = childrenCount;

    let rivalToAdd: RivalDynasty = {
      id: uuidv4(),
      name: rivalDynastyName,
      status: getRandomInt(RIVAL_STATUS_MIN_INITIAL, RIVAL_STATUS_MAX_INITIAL),
      country: rivalCountry,
      members: members,
      treasury: getRandomInt(RIVAL_DYNASTY_INITIAL_TREASURY_MIN, RIVAL_DYNASTY_INITIAL_TREASURY_MAX),
      currentMonarchId: currentMonarchId,
      dynastyFoundedYear: INITIAL_YEAR - getRandomInt(0,10),
      colorScheme: colorScheme,
      isAlliedWithPlayer: false,
    };
    rivalToAdd = updateRivalDynastyTitles(rivalToAdd);
    rivalDynasties.push(rivalToAdd);
  }

  let gameState: GameState = {
    allPeople,
    dynastyFounderId,
    dynastyName,
    currentYear: INITIAL_YEAR,
    potentialSuitors: initialSuitors,
    relatedRoyalSuitorsForModal: [],
    selectedRoyalIdForMarriage: null,
    selectedPersonDetailId: null,
    notifications: [`The ${dynastyName} was founded in year ${INITIAL_YEAR} in ${playerDynastyOrigin}. ${founder.firstName} ${founder.lastName} begins their reign alone.`],
    dynastyTreasury: INITIAL_TREASURY,
    rivalDynasties,
    ownedItemsCount: {},
    availableItems: PURCHASABLE_ITEMS,
    currentMonarchId: founder.id,
    historicalStatus: [], 
    historicalTreasury: [{ year: INITIAL_YEAR, value: INITIAL_TREASURY }],
    selectedRivalDynastyId: null,
    playerDynastyOrigin: playerDynastyOrigin,
    alliances: [],
    diplomaticAttempts: {},
  };
  
  const initialStatus = calculateEffectiveDynastyStatus(gameState.allPeople, gameState.ownedItemsCount, gameState.availableItems);
  gameState.historicalStatus.push({ year: INITIAL_YEAR, value: initialStatus.totalEffectiveStatus });
  gameState = updatePlayerSuccession(gameState); 
  
  return gameState; 
};
