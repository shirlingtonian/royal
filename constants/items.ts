
import { PurchasableItem } from '../types/index'; 

export const PURCHASABLE_ITEMS: PurchasableItem[] = [
  { id: 'item_manor_1', name: 'Small Manor Deed', description: 'Claim to a modest but respectable estate.', cost: 150, statusBoost: 0.2, type: 'Holding' },
  { id: 'item_keep_1', name: 'Stone Keep Blueprint', description: 'Plans for a fortified keep, projecting strength.', cost: 500, statusBoost: 0.5, type: 'Building' },
  { id: 'item_regalia_1', name: 'Minor Regalia Set', description: 'Symbols of office that lend an air of legitimacy.', cost: 250, statusBoost: 0.3, type: 'Artifact' },
  { id: 'item_charter_1', name: 'Local Market Stall', description: 'Rights to a stall in a nearby town market.', cost: 300, statusBoost: 0.3, type: 'Title' },
  { id: 'item_castle_1', name: 'Regional Castle Claim', description: 'A claim to a significant castle, a seat of power.', cost: 2000, statusBoost: 1.0, type: 'Building' },
  { id: 'item_crown_1', name: 'Ceremonial Circlet', description: 'A finely crafted circlet, recognized by local peers.', cost: 1200, statusBoost: 0.7, type: 'Artifact' },
  { id: 'item_land_grant_1', name: 'Paddock Land Grant', description: 'Tracts of fertile land, bringing minor prestige.', cost: 2500, statusBoost: 1.2, type: 'Holding'},
  { id: 'item_grand_palace_1', name: 'Palace Wing Blueprint', description: 'Architectural plans for a wing of a grand palace.', cost: 7500, statusBoost: 2.0, type: 'Building' },
];
