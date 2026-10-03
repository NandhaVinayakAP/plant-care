import { api } from './authService';
import { ApiResponse } from '../types/api';
import { EnvironmentalDataResponse, EnvironmentalDataRequest } from '../types/environment';

export const environmentService = {
  getEnvironmentalData: async (plantId: number) => {
    const response = await api.get<ApiResponse<EnvironmentalDataResponse[]>>(`/environment?plantId=${plantId}`);
    return response.data?.data || response.data;
  },

  recordData: async (data: EnvironmentalDataRequest) => {
    const response = await api.post<ApiResponse<EnvironmentalDataResponse>>('/environment/manual-entry', data);
    return response.data;
  },

  createEnvironmentalData: async (data: EnvironmentalDataRequest) => {
    const response = await api.post<ApiResponse<EnvironmentalDataResponse>>('/environment/manual-entry', data);
    return response.data?.data || response.data;
  },

  updateEnvironmentalData: async (_id: number, data: EnvironmentalDataRequest) => {
    const response = await api.post<ApiResponse<EnvironmentalDataResponse>>('/environment/manual-entry', data);
    return response.data?.data || response.data;
  },

  deleteEnvironmentalData: async (_id: number) => {
    return Promise.resolve();
  },

  getCurrentConditions: async (plantId: number) => {
    const response = await api.get<ApiResponse<EnvironmentalDataResponse>>(`/environment/${plantId}/current`);
    return response.data;
  },
};

export default environmentService;
