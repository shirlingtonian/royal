
import { GameState, Person, EffectiveStatusBreakdown, PurchasableItem, Gender } from '../../types/index';
import { calculateAge } from '../entities/person.service';
import {
    MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE, AVERAGE_LIFESPAN, LIFESPAN_VARIATION,
    CHANCE_OF_RANDOM_DEATH, INCOME_BASE_FLAT,
    INCOME_SCALING_FACTOR_DIVISOR, INCOME_SCALING_EXPONENT
} from '../../constants';
import { getRandomInt } from '../util/utility.service';


export const calculateEffectiveDynastyStatus = (
    allPeople: Record<string, Person>,
    ownedItemsCount: Record<string, number>,
    availableItems: PurchasableItem[]
 ): EffectiveStatusBreakdown => {
  const livingRoyalBloodMembers = Object.values(allPeople).filter(p => p.isAlive && p.isRoyalBlood && !p.isExcommunicated);
  const baseRoyalStatus = livingRoyalBloodMembers.length > 0
    ? livingRoyalBloodMembers.reduce((sum, p) => sum + p.statusPoints, 0) / livingRoyalBloodMembers.length
    : 0;

  let itemStatusBoost = 0;
  for (const itemId in ownedItemsCount) {
    const count = ownedItemsCount[itemId];
    const item = availableItems.find(i => i.id === itemId);
    if (item && count > 0) {
      itemStatusBoost += item.statusBoost * count;
    }
  }
  const totalEffectiveStatus = Math.max(0, Math.min(100, baseRoyalStatus + itemStatusBoost));
  return { baseRoyalStatus, itemStatusBoost, totalEffectiveStatus };
};

export const updatePlayerTitles = (state: GameState): GameState => {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  const monarch = newState.currentMonarchId ? newState.allPeople[newState.currentMonarchId] : null;
  const playerDynastyBaseName = newState.dynastyName.replace("House of ", "");

  // 1. Clear all titles initially
  for (const personId in newState.allPeople) {
    newState.allPeople[personId].title = undefined;
  }

  // 2. Assign King/Queen
  if (monarch && monarch.isAlive && !monarch.isExcommunicated && monarch.lastName === playerDynastyBaseName) {
    monarch.title = monarch.gender === Gender.Male ? 'King' : 'Queen';
    // 3. Assign Consort to Monarch's spouse
    if (monarch.spouseId) {
      const spouse = newState.allPeople[monarch.spouseId];
      if (spouse && spouse.isAlive && !spouse.isExcommunicated && !spouse.title) { // Check if spouse already has a title (e.g. foreign monarch)
        spouse.title = monarch.gender === Gender.Male ? 'Queen' : 'Prince Consort';
      }
    }
  }

  // 4. Assign Prince/Princess to Monarch's children
  if (monarch) {
    monarch.childrenIds.forEach(childId => {
      const child = newState.allPeople[childId];
      if (child && child.isAlive && !child.isExcommunicated && child.isRoyalBlood && child.lastName === playerDynastyBaseName) {
        child.title = child.gender === Gender.Male ? 'Prince' : 'Princess';
        // 5. Assign Consort to spouses of Princes/Princesses
        if (child.spouseId) {
          const childSpouse = newState.allPeople[child.spouseId];
          if (childSpouse && childSpouse.isAlive && !childSpouse.isExcommunicated && !childSpouse.title) {
             if (child.gender === Gender.Female && childSpouse.gender === Gender.Male) { // Corrected from Gender.Princess
                 childSpouse.title = 'Prince Consort';
             } else if (child.gender === Gender.Male && childSpouse.gender === Gender.Female) { // Corrected from Gender.Prince
                 childSpouse.title = 'Princess';
             }
          }
        }
      }
    });
  }

  // 6. Assign Duke/Duchess and their Consorts
  // Siblings of the Monarch
  if (monarch && monarch.fatherId && monarch.motherId) {
    const monarchSiblings = Object.values(newState.allPeople).filter(p =>
      p.id !== monarch.id &&
      p.fatherId === monarch.fatherId &&
      p.motherId === monarch.motherId &&
      p.isAlive && p.isRoyalBlood && !p.isExcommunicated &&
      p.lastName === playerDynastyBaseName &&
      !p.title // Not already King/Queen/Prince/Princess
    );
    monarchSiblings.forEach(sibling => {
      if (!sibling.title) { // Double check they aren't already titled higher
        sibling.title = sibling.gender === Gender.Male ? 'Duke' : 'Duchess';
        if (sibling.spouseId) {
          const spouse = newState.allPeople[sibling.spouseId];
          if (spouse && spouse.isAlive && !spouse.isExcommunicated && !spouse.title) {
            spouse.title = sibling.gender === Gender.Male ? 'Duchess' : 'Duke Consort';
          }
        }
      }
    });
  }

  // Children of Princes/Princesses (Nephews/Nieces of Monarch)
  const princesAndPrincesses = Object.values(newState.allPeople).filter(
    p => (p.title === 'Prince' || p.title === 'Princess') && p.lastName === playerDynastyBaseName
  );

  princesAndPrincesses.forEach(princeOrPrincess => {
    princeOrPrincess.childrenIds.forEach(childId => {
      const child = newState.allPeople[childId];
      if (child && child.isAlive && !child.isExcommunicated && child.isRoyalBlood && child.lastName === playerDynastyBaseName && !child.title) {
        child.title = child.gender === Gender.Male ? 'Duke' : 'Duchess';
        if (child.spouseId) {
          const spouse = newState.allPeople[child.spouseId];
          if (spouse && spouse.isAlive && !spouse.isExcommunicated && !spouse.title) {
            spouse.title = child.gender === Gender.Male ? 'Duchess' : 'Duke Consort';
          }
        }
      }
    });
  });
  
  // 7. Assign 'Regalite' as a fallback for untitled royals of the player dynasty
  Object.values(newState.allPeople).forEach(p => {
    if (p.isAlive && p.isRoyalBlood && !p.isExcommunicated && p.lastName === playerDynastyBaseName && !p.title) {
      p.title = 'Regalite';
    }
  });
  
  return newState;
};

export const updatePlayerSuccession = (state: GameState): GameState => {
  let newState = JSON.parse(JSON.stringify(state)) as GameState;
  const currentMonarch = newState.currentMonarchId ? newState.allPeople[newState.currentMonarchId] : null;
  const playerDynastyBaseName = newState.dynastyName.replace("House of ", "");

  if (!currentMonarch || !currentMonarch.isAlive || currentMonarch.isExcommunicated) {
    const anyLivingRoyal = Object.values(newState.allPeople).find(p => p.isRoyalBlood && p.isAlive && !p.isExcommunicated && p.lastName === playerDynastyBaseName);
    if (!anyLivingRoyal) {
      newState.notifications.push(`The ${newState.dynastyName} has fallen. There are no living heirs.`);
      newState.dynastyFounderId = null;
      newState.currentMonarchId = null;
      return newState;
    }

    let potentialHeirs: Person[] = [];
    const findHeirsRecursive = (personId: string) => {
      const person = newState.allPeople[personId];
      if (!person || person.lastName !== playerDynastyBaseName || !person.isRoyalBlood) {
        return;
      }

      if (person.isAlive && !person.isExcommunicated) {
        if (!potentialHeirs.find(p => p.id === person.id)) {
            potentialHeirs.push(person);
        }
      }

      person.childrenIds
        .map(id => newState.allPeople[id])
        .filter(c => c && c.isRoyalBlood && c.lastName === playerDynastyBaseName)
        .sort((a, b) => a.birthYear - b.birthYear) 
        .forEach(child => findHeirsRecursive(child.id));
    };

    if (newState.dynastyFounderId && newState.allPeople[newState.dynastyFounderId]) {
      findHeirsRecursive(newState.dynastyFounderId);
    } else {
      const allEligibleRoyals = Object.values(newState.allPeople)
        .filter(p => p.isRoyalBlood && p.isAlive && !p.isExcommunicated && p.lastName === playerDynastyBaseName)
        .sort((a,b) => a.birthYear - b.birthYear);
      if (allEligibleRoyals.length > 0) {
        findHeirsRecursive(allEligibleRoyals[0].id);
      }
    }
    
    potentialHeirs = potentialHeirs.filter((person, index, self) => 
        index === self.findIndex((p) => p.id === person.id));

    potentialHeirs.sort((a, b) => {
      if (a.generation !== b.generation) return a.generation - b.generation;
      return a.birthYear - b.birthYear;
    });
    
    const newMonarch = potentialHeirs[0];

    if (newMonarch) {
      newState.currentMonarchId = newMonarch.id;
      newState.notifications.push(`${newMonarch.firstName} ${newMonarch.lastName} has ascended to the throne of the ${newState.dynastyName}!`);
    } else {
      newState.notifications.push(`The ${newState.dynastyName} has no clear heir. The dynasty may be in peril!`);
      newState.currentMonarchId = null; 
    }
  }
  newState = updatePlayerTitles(newState); // Ensure titles are updated after potential succession
  return newState;
};


export const updatePlayerIncome = (state: GameState): GameState => {
    let newState = JSON.parse(JSON.stringify(state)) as GameState;
    const effectiveStatus = calculateEffectiveDynastyStatus(newState.allPeople, newState.ownedItemsCount, newState.availableItems);
    const annualIncome = INCOME_BASE_FLAT + Math.floor(Math.pow(effectiveStatus.totalEffectiveStatus / INCOME_SCALING_FACTOR_DIVISOR, INCOME_SCALING_EXPONENT));
    newState.dynastyTreasury += annualIncome;
    newState.notifications.push(`Your dynasty earned ${annualIncome} gold this year.`);
    return newState;
};
