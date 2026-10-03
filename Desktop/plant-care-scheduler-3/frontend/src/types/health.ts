export enum HealthStatus {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  CRITICAL = 'CRITICAL'
}

export enum RecoveryStatus {
  RECOVERED = 'RECOVERED',
  IMPROVING = 'IMPROVING',
  STABLE = 'STABLE',
  DECLINING = 'DECLINING'
}

export interface HealthRecordResponse {
  id: number;
  plantId: number;
  plantNickname?: string;
  assessmentDate: string;
  overallHealth: HealthStatus;
  healthStatus?: HealthStatus;
  recordDate?: string;
  symptoms?: string;
  diagnosedIssues?: string;
  treatmentsApplied?: string;
  treatmentApplied?: string;
  specialistId?: number;
  notes?: string;
  followUpDate?: string;
  recoveryStatus?: RecoveryStatus;
}

export interface HealthRecordRequest {
  plantId: number;
  overallHealth?: HealthStatus;
  healthStatus?: HealthStatus;
  recordDate?: string;
  symptoms?: string;
  diagnosedIssues?: string;
  treatmentsApplied?: string;
  treatmentApplied?: string;
  notes?: string;
  followUpDate?: string;
  recoveryStatus?: RecoveryStatus;
}
