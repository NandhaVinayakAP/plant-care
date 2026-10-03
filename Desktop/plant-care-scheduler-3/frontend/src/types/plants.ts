export enum HealthStatus {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  CRITICAL = 'CRITICAL'
}

export interface PlantResponse {
  id: number;
  ownerId: number;
  ownerUsername: string;
  speciesId: number;
  speciesCommonName: string;
  speciesScientificName: string;
  nickname: string;
  location?: string;
  acquisitionDate?: string;
  currentHeightCm?: number;
  currentWidthCm?: number;
  potSize?: string;
  soilType?: string;
  lastWateredDate?: string;
  lastFertilizedDate?: string;
  lastPrunedDate?: string;
  lastRepottedDate?: string;
  healthStatus: HealthStatus;
  notes?: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface PlantCreateRequest {
  speciesId: number;
  nickname: string;
  location?: string;
  acquisitionDate?: string;
  currentHeightCm?: number;
  currentWidthCm?: number;
  potSize?: string;
  soilType?: string;
  notes?: string;
}

export interface PlantSearchRequest {
  nickname?: string;
  speciesName?: string;
  location?: string;
  healthStatus?: HealthStatus;
}
