
import { GameState, Person, Gender } from '../../types/index'; 
import { calculateAge, createPerson } from '../entities/person.service'; 
import { updatePlayerTitles, updatePlayerSuccession, calculateEffectiveDynastyStatus } from './dynasty.service'; 
import { MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE, AI_CHILD_PROBABILITIES_PER_YEAR,
         BASE_ALLIANCE_SUCCESS_CHANCE, STATUS_DIFFERENCE_ALLIANCE_MODIFIER,
         ATTEMPT_NUMBER_ALLIANCE_BONUS, MAX_ALLIANCE_ATTEMPTS_FOR_BONUS_COUNT } from '../../constants'; 
import { getRandomInt } from '../util/utility.service'; 


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
  if (newState.potentialSuitors.find(s => s.id === suitorId)) {
    suitor = JSON.parse(JSON.stringify(suitor)) as Person; // Deep clone suitor object
    newState.allPeople[suitor.id] = suitor; // Add to main people record
    newState.potentialSuitors = newState.potentialSuitors.filter(s => s.id !== suitorId); // Remove from suitors list
  }
  
  royal.spouseId = suitor.id;
  suitor.spouseId = royal.id;

  if (royal.isRoyalBlood) {
    suitor.isMarriedToRoyal = true;
    suitor.lastName = royal.lastName; // Suitor takes royal's dynasty name
    suitor.generation = royal.generation; // Align generation
    suitor.isRoyalBlood = false; // Ensure suitor is not marked as royal blood of player's dynasty unless they were already
    newState.notifications.push(`${royal.firstName} ${royal.lastName} and ${suitor.firstName} ${suitor.originalLastName} (now ${suitor.lastName}) have married.`);
  } else if (suitor.isRoyalBlood && suitor.isForeignRoyal) { // Player's non-royal marries a foreign royal
    royal.isMarriedToRoyal = true;
    // Royal doesn't change name, but is now married to a foreign royal.
    // Suitor keeps their royal name and status.
    newState.notifications.push(`${royal.firstName} ${royal.lastName} and ${suitor.firstName} ${suitor.lastName} (of ${suitor.foreignDynastyDetails?.name}) have married.`);
  } else { // Other cases, e.g., two non-royals within the household or other edge cases
     suitor.isMarriedToRoyal = royal.isMarriedToRoyal; // Inherit married-to-royal status
     suitor.lastName = royal.lastName; // Default: suitor takes player dynasty name if royal isn't royal blood but part of household
     suitor.generation = royal.generation;
     newState.notifications.push(`${royal.firstName} ${royal.lastName} and ${suitor.firstName} ${suitor.originalLastName} (now ${suitor.lastName}) have married.`);
  }
  
  // Status boost from marriage
  const statusBoostFromSpouse = Math.floor(suitor.statusPoints / 10) + Math.floor(royal.statusPoints / 10);
  royal.statusPoints = Math.min(100, royal.statusPoints + Math.floor(statusBoostFromSpouse / 2) + getRandomInt(0,5));
  suitor.statusPoints = Math.min(100, suitor.statusPoints + Math.floor(statusBoostFromSpouse / 2) + getRandomInt(0,5));
  
  newState.selectedRoyalIdForMarriage = null; // Clear selection after marriage
  newState = updatePlayerTitles(newState); // Update titles for everyone
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
        const childIsRoyalBlood = mother.isRoyalBlood || father.isRoyalBlood; // Child is royal if EITHER parent is.
        if(childIsRoyalBlood) { // Only create child if it's considered royal blood.
            const childGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
            const childDynastyName = newState.dynastyName; // Child gets the player's dynasty name.
            const childGeneration = Math.max(mother.generation, father.generation) + 1;
            // Pass player's origin for the child.
            const child = createPerson(newState.currentYear, childGender, true, childDynastyName, childGeneration, father, mother, false, false, undefined, newState.playerDynastyOrigin);
            
            newState.allPeople[child.id] = child;
            mother.childrenIds.push(child.id);
            father.childrenIds.push(child.id);
            newState.notifications.push(`A ${childGender === Gender.Male ? 'son' : 'daughter'}, ${child.firstName}, was born to ${mother.firstName} and ${father.firstName}!`);
        } else {
            // This case (child not being royal blood) should ideally not happen if the action is for royals.
            // If it can, a notification for a non-royal birth might be needed.
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
  const playerDynastyBaseName = royal.lastName; // Assuming royal is from player's dynasty

  Object.values(allPeople).forEach(potentialSuitor => {
    // Basic eligibility checks
    if (potentialSuitor.id === royal.id || !potentialSuitor.isAlive || potentialSuitor.isExcommunicated || potentialSuitor.spouseId) {
      return;
    }
    const suitorAge = calculateAge(potentialSuitor.birthYear, currentYear);
    if (suitorAge < MIN_MARRIAGE_AGE || potentialSuitor.gender === royal.gender) {
      return;
    }
    // Prevent direct incest: parent, child, sibling
    if (potentialSuitor.id === royal.fatherId || potentialSuitor.id === royal.motherId) return;
    if (royal.childrenIds.includes(potentialSuitor.id)) return;
    // Check for siblings (share both parents)
    if (royal.fatherId === potentialSuitor.fatherId && royal.motherId === potentialSuitor.motherId && royal.fatherId && royal.motherId) return;

    // More distant relations: check if they are of the player's dynasty by blood
    if (potentialSuitor.isRoyalBlood && potentialSuitor.lastName === playerDynastyBaseName) {
        // Avoid grandparents (more complex check needed for full tree, this is simplified)
        const royalFather = royal.fatherId ? allPeople[royal.fatherId] : null;
        const royalMother = royal.motherId ? allPeople[royal.motherId] : null;
        if (royalFather && (potentialSuitor.id === royalFather.fatherId || potentialSuitor.id === royalFather.motherId)) return; // Suitor is royal's grandparent via father
        if (royalMother && (potentialSuitor.id === royalMother.fatherId || potentialSuitor.id === royalMother.motherId)) return; // Suitor is royal's grandparent via mother
        // Add other relationship checks as needed (e.g. uncles/aunts, cousins)
        // For now, if they pass above checks and are royal blood of same dynasty, consider them.
        eligibleRelations.push(potentialSuitor);
    }
  });
  return eligibleRelations.sort((a,b) => b.statusPoints - a.statusPoints); // Sort by status
};

// This function remains in interaction.service.ts as it's a specific player-initiated diplomatic action
export const attemptDiplomaticAlliance = (prevState: GameState, rivalDynastyId: string): GameState => {
    let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
    const rival = newState.rivalDynasties.find(r => r.id === rivalDynastyId);
    const playerStatus = calculateEffectiveDynastyStatus(newState.allPeople, newState.ownedItemsCount, newState.availableItems).totalEffectiveStatus;

    if (!rival) {
        newState.notifications.push("Cannot attempt alliance: rival dynasty not found.");
        return newState;
    }
    if (newState.alliances.includes(rivalDynastyId)) {
        newState.notifications.push(`You are already allied with ${rival.name}.`);
        return newState;
    }

    newState.diplomaticAttempts[rivalDynastyId] = (newState.diplomaticAttempts[rivalDynastyId] || 0) + 1;
    const attempts = newState.diplomaticAttempts[rivalDynastyId];

    let successChance = BASE_ALLIANCE_SUCCESS_CHANCE;
    successChance += (playerStatus - rival.status) * STATUS_DIFFERENCE_ALLIANCE_MODIFIER;
    successChance += Math.min(attempts, MAX_ALLIANCE_ATTEMPTS_FOR_BONUS_COUNT) * ATTEMPT_NUMBER_ALLIANCE_BONUS;
    successChance = Math.max(0.05, Math.min(0.95, successChance));

    if (Math.random() < successChance) {
        newState.alliances.push(rivalDynastyId);
        const foundRival = newState.rivalDynasties.find(r => r.id === rivalDynastyId);
        if (foundRival) foundRival.isAlliedWithPlayer = true;
        newState.notifications.push(`Successfully formed an alliance with ${rival.name}! Relations have improved.`);
    } else {
        newState.notifications.push(`Diplomatic efforts with ${rival.name} have failed this time. (Chance: ${(successChance*100).toFixed(0)}%)`);
    }
    return newState;
};
