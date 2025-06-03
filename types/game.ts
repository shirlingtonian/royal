
import { Person } from './person';
import { RivalDynasty } from './dynasty';
import { PurchasableItem } from './item';
// import { PoliticalEnvironment } from './political'; // Removed

export interface HistoricalDataPoint {
  year: number;
  value: number;
}

export interface HistoricalStatusData extends HistoricalDataPoint {}
export interface HistoricalTreasuryData extends HistoricalDataPoint {}

export interface GameState {
  allPeople: Record<string, Person>;
  dynastyFounderId: string | null;
  dynastyName: string;
  currentYear: number;
  potentialSuitors: Person[];
  relatedRoyalSuitorsForModal: Person[];
  selectedRoyalIdForMarriage: string | null;
  selectedPersonDetailId: string | null;
  notifications: string[];
  dynastyTreasury: number;
  rivalDynasties: RivalDynasty[];
  ownedItemsCount: Record<string, number>;
  availableItems: PurchasableItem[];
  currentMonarchId: string | null;
  historicalStatus: HistoricalStatusData[];
  historicalTreasury: HistoricalTreasuryData[];
  selectedRivalDynastyId: string | null;
  playerDynastyOrigin: string;
  alliances: string[];
  diplomaticAttempts: Record<string, number>;
  // politicalEnvironment: PoliticalEnvironment | null; // Removed
}