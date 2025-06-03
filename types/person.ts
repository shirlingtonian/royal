
export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface ForeignDynastyDetails {
  id: string;
  name: string;
  country: string;
  colorPrimary: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  originalLastName: string;
  gender: Gender;
  birthYear: number;
  deathYear?: number;
  isAlive: boolean;
  originCountry: string;
  physicalFeatures: string[];
  statusPoints: number;
  isRoyalBlood: boolean;
  isMarriedToRoyal: boolean;
  spouseId?: string;
  childrenIds: string[];
  fatherId?: string;
  motherId?: string;
  portraitUrl: string;
  generation: number;
  isExcommunicated: boolean;
  title?: string;
  isForeignRoyal?: boolean;
  foreignDynastyDetails?: ForeignDynastyDetails;
}

export interface RivalPerson {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: number;
  deathYear?: number;
  isAlive: boolean;
  statusPoints: number;
  spouseInfo?: {
    firstName: string;
    lastName: string;
    statusPoints: number;
  };
  childrenCount: number;
  title?: string;
}
