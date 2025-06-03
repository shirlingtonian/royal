
import { GameState } from '../../types/index';
import { updatePlayerSuccession, updatePlayerIncome, calculateEffectiveDynastyStatus } from '../player/dynasty.service'; 
import { updatePlayerPopulation } from '../player/player-family.service';
import { processPlayerAutonomousMarriages } from '../player/player-autonomous-actions.service';
import { generateNewSuitors } from '../entities/person.service'; 
import { processRivalDynastyYear } from '../entities/rival.service';
// import { updatePoliticalEnvironment } from '../systems/political.service'; // Political system updates are no longer part of core game loop


export const advanceYear = (prevState: GameState): GameState => {
  if (!prevState.dynastyFounderId && prevState.currentYear > 0) { 
      return prevState;
  }

  let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
  newState.currentYear++;
  newState.notifications = []; 

  newState = updatePlayerPopulation(newState);
  newState = processPlayerAutonomousMarriages(newState); 

  const playerStatusForSuitorGeneration = calculateEffectiveDynastyStatus(newState.allPeople, newState.ownedItemsCount, newState.availableItems).totalEffectiveStatus;

  newState.potentialSuitors = generateNewSuitors(newState.currentYear, newState.dynastyName, newState.playerDynastyOrigin, newState.allPeople, playerStatusForSuitorGeneration);
  
  newState.rivalDynasties = newState.rivalDynasties.map(rival => processRivalDynastyYear(rival, newState.currentYear));
  
  newState = updatePlayerIncome(newState);
  
  newState = updatePlayerSuccession(newState); 

  const finalEffectiveStatusThisYear = calculateEffectiveDynastyStatus(newState.allPeople, newState.ownedItemsCount, newState.availableItems).totalEffectiveStatus;
  newState.historicalStatus.push({ year: newState.currentYear, value: finalEffectiveStatusThisYear });
  newState.historicalTreasury.push({ year: newState.currentYear, value: newState.dynastyTreasury });
  
  if (!newState.dynastyFounderId && prevState.dynastyFounderId) { 
    newState.notifications.push(`The ${newState.dynastyName} line has ended. The dynasty is no more.`);
  }

  return newState;
};
