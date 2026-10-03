export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ConsultationResponse {
  id: number;
  plantId: number;
  plantNickname?: string;
  specialistId: number;
  specialistUsername?: string;
  scheduledTime: string; // ISO string
  startTime?: string;
  endTime?: string;
  reasonForConsultation?: string;
  notes?: string;
  rating?: number; // 1-5
  status: ConsultationStatus;
  createdDate?: string;
  updatedDate?: string;
}

export interface ConsultationRequest {
  plantId: number;
  specialistId: number;
  scheduledTime: string; // ISO string
  reasonForConsultation?: string;
  notes?: string;
}

export interface SpecialistResponse {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  expertise?: string;
  bio?: string;
  isActive?: boolean;
}
