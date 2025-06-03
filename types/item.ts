
export interface PurchasableItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  statusBoost: number;
  type: 'Building' | 'Artifact' | 'Title' | 'Holding';
}
