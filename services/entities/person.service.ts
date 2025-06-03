import { v4 as uuidv4 } from 'uuid';
import { Person, Gender, ForeignDynastyDetails, RivalPerson, RivalDynastyColorScheme } from '../../types/index';
import {
  MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, COMMON_LAST_NAMES, COUNTRIES,
  FOUNDER_MIN_STATUS, FOUNDER_MAX_STATUS,
  FOREIGN_ROYAL_SUITOR_MIN_STATUS_BONUS, FOREIGN_ROYAL_SUITOR_MAX_STATUS_BONUS,
  NUM_SUITORS_GENERATED_PER_YEAR, MIN_SUITOR_AGE, MAX_SUITOR_AGE, CHANCE_FOREIGN_ROYAL_SUITOR,
  EUROPEAN_DYNASTY_BASENAMES, RIVAL_DYNASTY_COLOR_SCHEMES
} from '../../constants';
import { getRandomElement, getRandomInt, generatePhysicalFeatures } from '../util/utility.service';

export const calculateAge = (birthYear: number, currentYear: number): number => {
  return currentYear - birthYear;
};

export const createPerson = (
  personBirthYear: number,
  gender: Gender,
  isRoyalBloodInput: boolean,
  dynastyName: string,
  generation: number,
  father?: Person,
  mother?: Person,
  isFounder: boolean = false,
  isForeignRoyalFlag: boolean = false,
  foreignDynastyDetails?: ForeignDynastyDetails,
  playerDynastyOrigin?: string,
  playerDynastyStatus?: number // Optional: Used for suitor generation
): Person => {
  const id = uuidv4();
  const firstName = gender === Gender.Male ? getRandomElement(MALE_FIRST_NAMES) : getRandomElement(FEMALE_FIRST_NAMES);
  if (!firstName) throw new Error("Failed to generate first name"); // Should not happen if NAMES constants are populated

  const baseDynastyName = dynastyName.startsWith("House of ") ? dynastyName.substring(9) : dynastyName;
  const isEffectivelyRoyal = isRoyalBloodInput || isForeignRoyalFlag;

  const commonLastName = getRandomElement(COMMON_LAST_NAMES) || "CommonerName";
  const personLastName =
    isEffectivelyRoyal
      ? foreignDynastyDetails
          ? foreignDynastyDetails.name
              .replace(/^House of /, "")
              .split(" of ")[0]
          : baseDynastyName
      : commonLastName;

  const originalLastName = isEffectivelyRoyal ? personLastName : (isForeignRoyalFlag && foreignDynastyDetails ? foreignDynastyDetails.name.split(" of ")[0] : commonLastName);

  let statusPoints: number;
  if (isFounder) {
    statusPoints = getRandomInt(FOUNDER_MIN_STATUS, FOUNDER_MAX_STATUS);
  } else if (isForeignRoyalFlag && foreignDynastyDetails && playerDynastyStatus !== undefined) {
    let targetStatus = playerDynastyStatus * 0.8; 
    targetStatus += getRandomInt(-10, 10); 
    statusPoints = Math.round(Math.max(FOREIGN_ROYAL_SUITOR_MIN_STATUS_BONUS, targetStatus)); 
  } else if (isForeignRoyalFlag && foreignDynastyDetails) {
    statusPoints = getRandomInt(FOREIGN_ROYAL_SUITOR_MIN_STATUS_BONUS + 5, FOREIGN_ROYAL_SUITOR_MAX_STATUS_BONUS + 15);
  }
   else if (father && mother) {
    const maxParentStatus = Math.max(father.statusPoints, mother.statusPoints);
    const bonus = getRandomInt(0, 2); 
    statusPoints = maxParentStatus + bonus;
  } else {
    statusPoints = getRandomInt(1, 10);
  }
  statusPoints = Math.max(0, Math.min(100, statusPoints)); 

  let physicalFeatures = generatePhysicalFeatures();
  let originCountry: string = "Undetermined";
  const defaultCountry = "Unknown Realm";

  if (isRoyalBloodInput && !isForeignRoyalFlag && playerDynastyOrigin) {
    originCountry = playerDynastyOrigin;
  } else if (foreignDynastyDetails) {
    originCountry = foreignDynastyDetails.country;
  } else if (father && mother) {
    let possibleOrigins: string[] = [father.originCountry, mother.originCountry].filter((o): o is string => Boolean(o));
    if (COUNTRIES.length > 0) { 
        const randomCountry = getRandomElement(COUNTRIES);
        if (randomCountry) possibleOrigins.push(randomCountry);
    }
    const filteredPossibleOrigins = possibleOrigins.filter(Boolean);
    if (filteredPossibleOrigins.length > 0) {
        originCountry = getRandomElement(filteredPossibleOrigins) || defaultCountry;
    } else if (COUNTRIES.length > 0) {
         originCountry = getRandomElement(COUNTRIES) || defaultCountry;
    } else {
        originCountry = defaultCountry;
    }
  } else {
    const filteredCountries = COUNTRIES.filter(c => c !== playerDynastyOrigin);
    if (filteredCountries.length > 0) {
        originCountry = getRandomElement(filteredCountries) || defaultCountry;
    } else if (COUNTRIES.length > 0) {
        originCountry = getRandomElement(COUNTRIES) || defaultCountry;
    } else {
        originCountry = defaultCountry;
    }
  }

  const portraitUrl = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${id}`;

  return {
    id, firstName, lastName: personLastName, originalLastName, gender, birthYear: personBirthYear, isAlive: true,
    originCountry, physicalFeatures, statusPoints, isRoyalBlood: isRoyalBloodInput, isMarriedToRoyal: false, childrenIds: [],
    fatherId: father?.id, motherId: mother?.id, portraitUrl, generation, isExcommunicated: false, title: undefined,
    isForeignRoyal: isForeignRoyalFlag, foreignDynastyDetails
  };
};

export const createRivalPerson = (
  birthYear: number,
  gender: Gender,
  dynastyName: string,
  isFounder: boolean = false
): RivalPerson => {
  const id = uuidv4();
  const firstName = (gender === Gender.Male ? getRandomElement(MALE_FIRST_NAMES) : getRandomElement(FEMALE_FIRST_NAMES)) || "RivalName";
  const rivalDynastyBaseName = dynastyName.substring(dynastyName.indexOf("House of ") === 0 ? 9 : 0, dynastyName.indexOf(" of ") > -1 ? dynastyName.indexOf(" of ") : dynastyName.length);

  let statusPoints = getRandomInt(isFounder ? 40 : 20, isFounder ? 70 : 60);

  return {
    id, firstName, lastName: rivalDynastyBaseName, gender, birthYear, isAlive: true,
    statusPoints, childrenCount: 0, title: undefined
  };
};

export const generateNewSuitors = (
    currentYear: number,
    playerDynastyName: string,
    playerDynastyOrigin: string,
    existingPeople: Record<string, Person>,
    playerDynastyStatus: number
): Person[] => {
    const newSuitors: Person[] = [];
    const existingSuitorOrigins = new Set<string>();
    Object.values(existingPeople).forEach(p => {
        if(p.isForeignRoyal && p.foreignDynastyDetails?.country) {
            existingSuitorOrigins.add(p.foreignDynastyDetails.country);
        } else if (p.isRoyalBlood && playerDynastyOrigin) {
            existingSuitorOrigins.add(playerDynastyOrigin);
        }
    });
    const defaultCountry = "Unknown Origin";

    for (let i = 0; i < NUM_SUITORS_GENERATED_PER_YEAR; i++) {
        const suitorGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
        const age = getRandomInt(MIN_SUITOR_AGE, MAX_SUITOR_AGE);
        const birthYear = currentYear - age;
        const isForeignRoyal = Math.random() < CHANCE_FOREIGN_ROYAL_SUITOR;
        let foreignDynastyDetails: ForeignDynastyDetails | undefined = undefined;
        let suitorDynastyName = "Commoner";

        if (isForeignRoyal) {
            let rivalDynastyBase: string;
            let rivalCountry: string;
            let attempts = 0;
            do {
                rivalDynastyBase = getRandomElement(EUROPEAN_DYNASTY_BASENAMES.filter(name => name !== playerDynastyName.replace("House of ", ""))) || "ForeignNobleHouse";
                const potentialCountries = COUNTRIES.filter(c => !existingSuitorOrigins.has(c));
                rivalCountry = (potentialCountries.length > 0 ? getRandomElement(potentialCountries) : getRandomElement(COUNTRIES)) || defaultCountry;
                attempts++;
            } while (existingSuitorOrigins.has(rivalCountry) && attempts < 10 && COUNTRIES.length > existingSuitorOrigins.size);

            const colorScheme: RivalDynastyColorScheme | undefined = getRandomElement(RIVAL_DYNASTY_COLOR_SCHEMES);
            foreignDynastyDetails = {
                id: uuidv4(),
                name: `House of ${rivalDynastyBase} of ${rivalCountry}`,
                country: rivalCountry,
                colorPrimary: colorScheme ? colorScheme.primary : 'bg-gray-500', // Default color if scheme undefined
            };
            existingSuitorOrigins.add(rivalCountry);
            suitorDynastyName = foreignDynastyDetails.name;
        }

        const suitor = createPerson(
            birthYear,
            suitorGender,
            isForeignRoyal, // isRoyalBloodInput will be true if isForeignRoyal is true
            suitorDynastyName,
            0, // Generation 0 for suitors
            undefined,
            undefined,
            false, // Not a founder
            isForeignRoyal, // Pass the flag
            foreignDynastyDetails,
            playerDynastyOrigin,
            playerDynastyStatus
        );

        if (!isForeignRoyal) { 
            let targetStatus = playerDynastyStatus * 0.6; 
            targetStatus += getRandomInt(-8, 8); 
            suitor.statusPoints = Math.round(Math.max(1, targetStatus)); 
            suitor.statusPoints = Math.min(100, Math.max(0, suitor.statusPoints)); 

            if (suitor.statusPoints > 55) {
                suitor.title = "Socialite";
            }
        }
        newSuitors.push(suitor);
    }
    return newSuitors;
};
