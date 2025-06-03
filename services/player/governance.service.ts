
import { GameState, Person } from '../../types/index';
import { updatePlayerTitles, updatePlayerSuccession } from './dynasty.service';

export const excommunicateMember = (prevState: GameState, personId: string): GameState => {
  let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
  const person = newState.allPeople[personId];

  if (!person) return prevState;

  if (person.id === newState.dynastyFounderId && newState.dynastyFounderId !== null) { 
    const otherLivingRoyals = Object.values(newState.allPeople).filter(
      p => p.id !== personId && p.isRoyalBlood && p.isAlive && !p.isExcommunicated && p.lastName === person.lastName
    );
    if (otherLivingRoyals.length === 0) {
      newState.notifications.push(`Cannot excommunicate ${person.firstName} as they are the last of their royal bloodline.`);
      return newState;
    }
  }
  
  const formerSpouseId = person.spouseId;

  person.isExcommunicated = true;
  person.statusPoints = Math.floor(person.statusPoints * 0.2);
  person.title = undefined;
  person.spouseId = undefined; // Excommunicated person is no longer married

  newState.notifications.push(`${person.firstName} ${person.lastName} has been excommunicated from the dynasty!`);

  // Clear the spouseId of the former spouse
  if (formerSpouseId && newState.allPeople[formerSpouseId]) {
    const formerSpouse = newState.allPeople[formerSpouseId];
    formerSpouse.spouseId = undefined;
    newState.notifications.push(`The marriage between ${person.firstName} and ${formerSpouse.firstName} ${formerSpouse.lastName} has been dissolved due to excommunication.`);
  }

  if (newState.currentMonarchId === personId) {
    newState.currentMonarchId = null;
    newState = updatePlayerSuccession(newState);
  } else {
    newState = updatePlayerTitles(newState);
  }
  
  return newState;
};

export const removePersonFromTree = (prevState: GameState, personIdToRemove: string): GameState => { 
    let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
    const personToRemove = newState.allPeople[personIdToRemove];

    if (!personToRemove) {
        newState.notifications.push("Person not found, cannot remove.");
        return newState;
    }

    if (personToRemove.isAlive && !personToRemove.isExcommunicated) {
        newState.notifications.push(`Cannot remove ${personToRemove.firstName} from the tree while they are alive and not excommunicated.`);
        return newState;
    }

    if (personIdToRemove === newState.dynastyFounderId && newState.dynastyFounderId !== null) {
       const otherLivingRoyals = Object.values(newState.allPeople).filter(p => p.isRoyalBlood && p.isAlive && !p.isExcommunicated && p.id !== personIdToRemove && p.lastName === personToRemove.lastName);
       if(otherLivingRoyals.length > 0) {
         newState.notifications.push(`Cannot remove the primary dynasty founder ${personToRemove.firstName} if other royals of their line exist.`);
         return newState;
       } else {
         newState.dynastyFounderId = null; 
       }
    }
    
    if (personToRemove.spouseId && newState.allPeople[personToRemove.spouseId]) {
        newState.allPeople[personToRemove.spouseId].spouseId = undefined;
    }

    if (personToRemove.fatherId && newState.allPeople[personToRemove.fatherId]) {
        const father = newState.allPeople[personToRemove.fatherId];
        father.childrenIds = father.childrenIds.filter(id => id !== personIdToRemove);
    }
    if (personToRemove.motherId && newState.allPeople[personToRemove.motherId]) {
        const mother = newState.allPeople[personToRemove.motherId];
        mother.childrenIds = mother.childrenIds.filter(id => id !== personIdToRemove);
    }
    
    delete newState.allPeople[personIdToRemove];
    newState.notifications.push(`${personToRemove.firstName} ${personToRemove.lastName} has been removed from the dynasty records.`);

    if (newState.selectedPersonDetailId === personIdToRemove) {
        newState.selectedPersonDetailId = null;
    }
    if (newState.currentMonarchId === personIdToRemove) {
        newState.currentMonarchId = null;
        newState = updatePlayerSuccession(newState);
    } else {
        newState = updatePlayerTitles(newState);
    }
    return newState;
};