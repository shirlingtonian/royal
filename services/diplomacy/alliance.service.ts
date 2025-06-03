
import { GameState } from '../../types/index';
import { calculateEffectiveDynastyStatus } from '../player/dynasty.service';
import { BASE_ALLIANCE_SUCCESS_CHANCE, STATUS_DIFFERENCE_ALLIANCE_MODIFIER,
         ATTEMPT_NUMBER_ALLIANCE_BONUS, MAX_ALLIANCE_ATTEMPTS_FOR_BONUS_COUNT } from '../../constants';

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
