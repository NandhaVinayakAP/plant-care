import { api } from './authService';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { SpeciesResponse, CareDifficulty } from '../types/species';

export const speciesService = {
  getAllSpecies: async (page: number = 0, size: number = 20, difficulty?: CareDifficulty, search?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (difficulty) params.append('difficulty', difficulty);
    if (search) params.append('search', search);

    const response = await api.get<ApiResponse<PaginatedResponse<SpeciesResponse>>>(`/species?${params.toString()}`);
    return response.data;
  },

  getSpeciesById: async (id: number) => {
    const response = await api.get<ApiResponse<SpeciesResponse>>(`/species/${id}`);
    return response.data?.data || response.data;
  },

  getPopularSpecies: async () => {
    const response = await api.get<ApiResponse<SpeciesResponse[]>>('/species/popular');
    return response.data?.data || response.data || [];
  },
};

export default speciesService;
