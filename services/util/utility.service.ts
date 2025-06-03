
import { PHYSICAL_FEATURES_HAIR, PHYSICAL_FEATURES_EYES, PHYSICAL_FEATURES_BUILD } from '../../constants';

export const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const generatePhysicalFeatures = (): string[] => {
  return [
    getRandomElement(PHYSICAL_FEATURES_HAIR),
    getRandomElement(PHYSICAL_FEATURES_EYES),
    getRandomElement(PHYSICAL_FEATURES_BUILD),
  ];
};
    