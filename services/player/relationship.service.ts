
import { GameState, Person, Gender } from '../../types/index'; // Updated path
import { calculateAge, createPerson } from '../entities/person.service'; // Updated path
import { updatePlayerTitles, updatePlayerSuccession, calculateEffectiveDynastyStatus } from './dynasty.service'; // Updated path (sibling)
import { MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE, AI_CHILD_PROBABILITIES_PER_YEAR,
         BASE_ALLIANCE_SUCCESS_CHANCE, STATUS_DIFFERENCE_ALLIANCE_MODIFIER,
         ATTEMPT_NUMBER_ALLIANCE_BONUS, MAX_ALLIANCE_ATTEMPTS_FOR_BONUS_COUNT } from '../../constants'; // Updated path
import { getRandomInt } from '../util/utility.service'; // Updated path


export const marryPeople = (prevState: GameState, royalId: string, suitorId: string): GameState => {
  let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
  const royal = newState.allPeople[royalId];
  let suitor = newState.allPeople[suitorId] || newState.potentialSuitors.find(s => s.id === suitorId);

  if (!royal || !suitor) {
    newState.notifications.push("Marriage failed: one of the individuals could not be found.");
    return newState;
  }
  if (royal.gender === suitor.gender) {
     newState.notifications.push(`Marriage failed: ${royal.firstName} and ${suitor.firstName} are of the same gender.`);
     return newState;
  }
  if (royal.spouseId || suitor.spouseId) {
     newState.notifications.push(`Marriage failed: One or both individuals are already married.`);
     return newState;
  }

  // If suitor is from potentialSuitors, move them to allPeople
  // Important: suitor object reference needs to be the one in newState.allPeople for status updates
  if (newState.potentialSuitors.find(s => s.id === suitorId)) {
    const suitorFromList = newState.potentialSuitors.find(s => s.id === suitorId)!;
    newState.allPeople[suitorFromList.id] = JSON.parse(JSON.stringify(suitorFromList)); // Deep clone and add
    suitor = newState.allPeople[suitorFromList.id]; // Update suitor reference
    newState.potentialSuitors = newState.potentialSuitors.filter(s => s.id !== suitorId); // Remove from suitors list
  } else {
    // Ensure suitor is the reference from newState.allPeople if already there
    suitor = newState.allPeople[suitorId];
  }
  
  // Store original statuses before any modification for this marriage transaction
  const originalRoyalStatus = royal.statusPoints;
  const originalSuitorStatus = suitor.statusPoints;

  royal.spouseId = suitor.id;
  suitor.spouseId = royal.id;

  if (royal.isRoyalBlood) {
    suitor.isMarriedToRoyal = true;
    suitor.lastName = royal.lastName;
    suitor.generation = royal.generation;
    if (!suitor.isRoyalBlood) { 
        suitor.isRoyalBlood = false; 
    }
    newState.notifications.push(`${royal.firstName} ${royal.lastName} and ${suitor.firstName} ${suitor.originalLastName} (now ${suitor.lastName}) have married.`);
  } else if (suitor.isRoyalBlood && suitor.isForeignRoyal) { 
    royal.isMarriedToRoyal = true;
    newState.notifications.push(`${royal.firstName} ${royal.lastName} and ${suitor.firstName} ${suitor.lastName} (of ${suitor.foreignDynastyDetails?.name}) have married.`);
  } else { 
     suitor.isMarriedToRoyal = royal.isMarriedToRoyal;
     suitor.lastName = royal.lastName; 
     suitor.generation = royal.generation;
     newState.notifications.push(`${royal.firstName} ${royal.lastName} and ${suitor.firstName} ${suitor.originalLastName} (now ${suitor.lastName}) have married.`);
  }
  
  // New status boost logic
  let lowerStatusPartner: Person;
  let higherStatusPartnerOriginalStatus: number;

  if (originalRoyalStatus <= originalSuitorStatus) {
    lowerStatusPartner = royal;
    higherStatusPartnerOriginalStatus = originalSuitorStatus;
  } else {
    lowerStatusPartner = suitor;
    higherStatusPartnerOriginalStatus = originalRoyalStatus;
  }
  
  const boostAmount = Math.floor(higherStatusPartnerOriginalStatus * 0.20);
  let newLowerStatus = lowerStatusPartner.statusPoints + boostAmount;
  
  // Cap: new status of lower partner cannot exceed original status of higher partner
  newLowerStatus = Math.min(newLowerStatus, higherStatusPartnerOriginalStatus);
  newLowerStatus = Math.min(100, Math.max(0, newLowerStatus)); // Global cap 0-100
  
  lowerStatusPartner.statusPoints = newLowerStatus;
  // The higher status partner does not receive a boost from this interaction.
  
  newState.selectedRoyalIdForMarriage = null;
  newState = updatePlayerTitles(newState);
  return newState;
};

export const tryForChild = (prevState: GameState, motherId: string): GameState => { 
  let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
  const mother = newState.allPeople[motherId];

  if (!mother || !mother.isAlive || mother.gender !== Gender.Female || !mother.spouseId || mother.isExcommunicated) {
    newState.notifications.push("Cannot try for a child: conditions not met for the mother.");
    return newState;
  }
  const father = newState.allPeople[mother.spouseId];
  if (!father || !father.isAlive || father.isExcommunicated) {
    newState.notifications.push("Cannot try for a child: conditions not met for the father.");
    return newState;
  }

  const motherAge = calculateAge(mother.birthYear, newState.currentYear);
  if (motherAge > MAX_CHILD_BEARING_AGE_FEMALE || motherAge < MIN_MARRIAGE_AGE) {
    newState.notifications.push(`${mother.firstName} is not of child-bearing age.`);
    return newState;
  }

  const baseSuccessChance = 0.6; 
  let childrenBornThisAttempt = 0;

  if (Math.random() < baseSuccessChance) {
      const prob = Math.random();
      if (prob < AI_CHILD_PROBABILITIES_PER_YEAR[0]) childrenBornThisAttempt = 1;
      else if (prob < AI_CHILD_PROBABILITIES_PER_YEAR[0] + AI_CHILD_PROBABILITIES_PER_YEAR[1]) childrenBornThisAttempt = 2;
      else if (prob < AI_CHILD_PROBABILITIES_PER_YEAR[0] + AI_CHILD_PROBABILITIES_PER_YEAR[1] + AI_CHILD_PROBABILITIES_PER_YEAR[2]) childrenBornThisAttempt = 3;
  }

  if (childrenBornThisAttempt > 0) {
    for (let i = 0; i < childrenBornThisAttempt; i++) {
        const childIsRoyalBlood = mother.isRoyalBlood || father.isRoyalBlood;
        if(childIsRoyalBlood) {
            const childGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
            const childDynastyName = newState.dynastyName;
            const childGeneration = Math.max(mother.generation, father.generation) + 1;
            const child = createPerson(newState.currentYear, childGender, true, childDynastyName, childGeneration, father, mother, false, false, undefined, newState.playerDynastyOrigin);
            
            newState.allPeople[child.id] = child;
            if (mother.childrenIds && father.childrenIds) { 
                mother.childrenIds.push(child.id);
                father.childrenIds.push(child.id);
            }
            newState.notifications.push(`A ${childGender === Gender.Male ? 'son' : 'daughter'}, ${child.firstName}, was born to ${mother.firstName} and ${father.firstName}!`);
        } else {
            if (i === 0 && childrenBornThisAttempt === 1) newState.notifications.push(`${mother.firstName} and ${father.firstName} tried for a child, but the stars did not align for a royal birth this time.`);
        }
    }
    if (childrenBornThisAttempt > 1) newState.notifications.push(`It's multiples! ${mother.firstName} gave birth to ${childrenBornThisAttempt} children!`);
  } else {
    newState.notifications.push(`${mother.firstName} and ${father.firstName} tried for a child, but to no avail this year.`);
  }
  newState = updatePlayerTitles(newState);
  return newState;
};

export const getEligibleRelatedRoyalSuitors = (royal: Person, allPeople: Record<string, Person>, currentYear: number): Person[] => { 
  if (!royal.isRoyalBlood) return [];

  const eligibleRelations: Person[] = [];
  const playerDynastyBaseName = royal.lastName; 

  Object.values(allPeople).forEach(potentialSuitor => {
    if (potentialSuitor.id === royal.id || !potentialSuitor.isAlive || potentialSuitor.isExcommunicated || potentialSuitor.spouseId) {
      return;
    }
    const suitorAge = calculateAge(potentialSuitor.birthYear, currentYear);
    if (suitorAge < MIN_MARRIAGE_AGE || potentialSuitor.gender === royal.gender) {
      return;
    }

    // Exclude direct lineage (parents, children)
    if (potentialSuitor.id === royal.fatherId || potentialSuitor.id === royal.motherId) return; // Parent
    if (royal.childrenIds.includes(potentialSuitor.id)) return; // Child
    
    // Sibling marriage is NOW ALLOWED by removing the check:
    // if (royal.fatherId && royal.motherId && potentialSuitor.fatherId === royal.fatherId && potentialSuitor.motherId === royal.motherId) return; // Full Sibling

    // Ensure part of the player's royal bloodline
    if (!potentialSuitor.isRoyalBlood || potentialSuitor.lastName !== playerDynastyBaseName) {
        return;
    }

    const royalFather = royal.fatherId ? allPeople[royal.fatherId] : null;
    const royalMother = royal.motherId ? allPeople[royal.motherId] : null;

    // Exclude Grandparents
    if (royalFather && (potentialSuitor.id === royalFather.fatherId || potentialSuitor.id === royalFather.motherId)) return;
    if (royalMother && (potentialSuitor.id === royalMother.fatherId || potentialSuitor.id === royalMother.motherId)) return;

    // Exclude Aunts/Uncles
    if (royalFather && royalFather.fatherId && royalFather.motherId) { 
        if (potentialSuitor.fatherId === royalFather.fatherId && potentialSuitor.motherId === royalFather.motherId && potentialSuitor.id !== royal.fatherId) return; 
    }
    if (royalMother && royalMother.fatherId && royalMother.motherId) { 
        if (potentialSuitor.fatherId === royalMother.fatherId && potentialSuitor.motherId === royalMother.motherId && potentialSuitor.id !== royal.motherId) return; 
    }
    
    // Exclude Nieces/Nephews
    const royalSiblings: Person[] = [];
    if (royal.fatherId && royal.motherId) { // Only check for siblings if royal has known parents
        Object.values(allPeople).forEach(p => {
            if (p.fatherId === royal.fatherId && p.motherId === royal.motherId && p.id !== royal.id) {
                royalSiblings.push(p);
            }
        });
    }
    for (const sibling of royalSiblings) {
        if (potentialSuitor.fatherId === sibling.id || potentialSuitor.motherId === sibling.id) {
            return; 
        }
    }
    
    eligibleRelations.push(potentialSuitor);
  });
  return eligibleRelations.sort((a,b) => b.statusPoints - a.statusPoints);
};
