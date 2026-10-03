import { api } from './authService';
import { ApiResponse } from '../types/api';

export const analyticsService = {
  getPlantAnalytics: async (plantId: number) => {
    const response = await api.get<ApiResponse<Record<string, any>>>(`/analytics/plants/${plantId}/summary`);
    return response.data?.data || response.data;
  },

  getCareEffectiveness: async () => {
    const response = await api.get<ApiResponse<Record<string, any>>>('/analytics/care-effectiveness');
    return response.data?.data || response.data;
  },

  getSystemAnalytics: async () => {
    const response = await api.get<ApiResponse<Record<string, any>>>('/analytics/system/usage');
    return response.data?.data || response.data;
  },
};

export default analyticsService;
