import { api } from './authService';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { PlantResponse, PlantCreateRequest, PlantSearchRequest, HealthStatus } from '../types/plants';

export const plantService = {
  getPlants: async (page: number = 0, size: number = 20, sort: string = 'nickname') => {
    const response = await api.get<ApiResponse<PaginatedResponse<PlantResponse>>>(
      `/plants?page=${page}&size=${size}${sort ? `&sort=${sort}` : ''}`
    );
    return response.data;
  },

  getPlantsByOwner: async (_userId?: number, page: number = 0, size: number = 20, sort: string = 'nickname') => {
    const response = await api.get<ApiResponse<PaginatedResponse<PlantResponse>>>(
      `/plants?page=${page}&size=${size}${sort ? `&sort=${sort}` : ''}`
    );
    return response.data;
  },

  getPlantById: async (plantId: number) => {
    const response = await api.get<ApiResponse<PlantResponse>>(`/plants/${plantId}`);
    return response.data;
  },

  createPlant: async (plantData: PlantCreateRequest) => {
    const response = await api.post<ApiResponse<PlantResponse>>('/plants', plantData);
    return response.data;
  },

  updatePlant: async (plantId: number, plantData: Partial<PlantCreateRequest>) => {
    const response = await api.put<ApiResponse<PlantResponse>>(`/plants/${plantId}`, plantData);
    return response.data;
  },

  deletePlant: async (plantId: number) => {
    const response = await api.delete<ApiResponse<void>>(`/plants/${plantId}`);
    return response.data;
  },

  searchPlants: async (searchParams: PlantSearchRequest, page: number = 0, size: number = 20) => {
    const response = await api.get<ApiResponse<PaginatedResponse<PlantResponse>>>(
      `/plants/search?page=${page}&size=${size}`,
      { params: searchParams }
    );
    return response.data;
  },

  getPlantsNeedingAttention: async () => {
    const response = await api.get<ApiResponse<PlantResponse[]>>('/plants/needing-attention');
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await api.get<ApiResponse<any>>('/plants/dashboard-summary');
    return response.data;
  },

  updateHealthStatus: async (plantId: number, status: HealthStatus | string) => {
    const response = await api.put<ApiResponse<PlantResponse>>(`/plants/${plantId}/health-status?status=${status}`);
    return response.data;
  },
};

export default plantService;
