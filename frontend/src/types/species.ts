export enum CareDifficulty {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  DIFFICULT = 'DIFFICULT'
}

export enum LightRequirement {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  DIRECT_SUN = 'DIRECT_SUN'
}

export enum GrowthRate {
  SLOW = 'SLOW',
  MODERATE = 'MODERATE',
  FAST = 'FAST'
}

export interface SpeciesResponse {
  id: number;
  commonName: string;
  scientificName: string;
  familyName?: string;
  careDifficulty: CareDifficulty;
  lightRequirements: LightRequirement;
  waterFrequencyDays?: number;
  humidityMin?: number;
  humidityMax?: number;
  temperatureMinCelsius?: number;
  temperatureMaxCelsius?: number;
  soilPhMin?: number;
  soilPhMax?: number;
  growthRate?: GrowthRate;
  maxHeightCm?: number;
  fertilizerFrequencyDays?: number;
  pruningFrequencyDays?: number;
  repottingFrequencyMonths?: number;
  commonIssues?: string;
  careTips?: string;
  imageUrl?: string;
}
