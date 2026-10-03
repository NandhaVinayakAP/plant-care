import { api } from './authService';
import { ApiResponse } from '../types/api';
import { HealthRecordResponse, HealthRecordRequest } from '../types/health';

export const healthService = {
  getHealthRecords: async (plantId: number) => {
    const response = await api.get<ApiResponse<HealthRecordResponse[]>>(`/health-records?plantId=${plantId}`);
    return response.data;
  },

  createHealthRecord: async (healthData: HealthRecordRequest) => {
    const response = await api.post<ApiResponse<HealthRecordResponse>>('/health-records', healthData);
    return response.data;
  },

  getHealthRecordById: async (recordId: number) => {
    const response = await api.get<ApiResponse<HealthRecordResponse>>(`/health-records/${recordId}`);
    return response.data;
  },

  updateHealthRecord: async (recordId: number, data: Partial<HealthRecordRequest>) => {
    const response = await api.put<ApiResponse<HealthRecordResponse>>(`/health-records/${recordId}`, data);
    return response.data;
  },

  deleteHealthRecord: async (recordId: number) => {
    const response = await api.delete<ApiResponse<void>>(`/health-records/${recordId}`);
    return response.data;
  },
};

export default healthService;
