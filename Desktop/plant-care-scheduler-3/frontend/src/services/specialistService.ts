import { api } from './authService';
import { ApiResponse } from '../types/api';
import { SpecialistResponse, ConsultationResponse, ConsultationRequest } from '../types/consultation';

export const specialistService = {
  getAllSpecialists: async () => {
    const response = await api.get<ApiResponse<SpecialistResponse[]>>('/specialist');
    return response.data?.data || response.data || [];
  },

  getSpecialistById: async (id: number) => {
    const response = await api.get<ApiResponse<SpecialistResponse>>(`/specialist/${id}`);
    return response.data?.data || response.data;
  },

  getMyConsultations: async (_userId?: number) => {
    const response = await api.get<ApiResponse<ConsultationResponse[]>>('/consultations/my-appointments');
    return response.data?.data || response.data || [];
  },

  bookConsultation: async (data: ConsultationRequest) => {
    const response = await api.post<ApiResponse<ConsultationResponse>>('/consultations/book', data);
    return response.data;
  },

  createConsultation: async (data: ConsultationRequest) => {
    const response = await api.post<ApiResponse<ConsultationResponse>>('/consultations/book', data);
    return response.data?.data || response.data;
  },

  completeConsultation: async (id: number, payload: { notes?: string; rating?: number }) => {
    const params = new URLSearchParams();
    if (payload.notes) params.append('notes', payload.notes);
    if (payload.rating) params.append('rating', payload.rating.toString());
    const response = await api.put<ApiResponse<ConsultationResponse>>(
      `/consultations/${id}/complete?${params.toString()}`
    );
    return response.data?.data || response.data;
  },

  cancelConsultation: async (_id: number) => {
    return Promise.resolve();
  },
};

export default specialistService;
