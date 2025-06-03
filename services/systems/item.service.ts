
import { GameState } from '../../types/index';

export const purchaseItem = (prevState: GameState, itemId: string): GameState => {
  let newState = JSON.parse(JSON.stringify(prevState)) as GameState;
  const item = newState.availableItems.find(i => i.id === itemId);

  if (!item) {
    newState.notifications.push("Item not found.");
    return newState;
  }

  if (newState.dynastyTreasury < item.cost) {
    newState.notifications.push(`Not enough gold to purchase ${item.name}.`);
    return newState;
  }

  newState.dynastyTreasury -= item.cost;
  newState.ownedItemsCount[itemId] = (newState.ownedItemsCount[itemId] || 0) + 1;
  newState.notifications.push(`${item.name} purchased for ${item.cost} gold.`);
  
  return newState;
};
