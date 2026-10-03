import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  SpecialistResponse,
  ConsultationResponse,
  ConsultationRequest,
} from '../types/consultation';
import specialistService from '../services/specialistService';
import { AxiosError } from 'axios';

export const useConsultations = () => {
  const queryClient = useQueryClient();

  const getSpecialists = () =>
    useQuery<SpecialistResponse[], AxiosError>({
      queryKey: ['specialists'],
      queryFn: () => specialistService.getAllSpecialists(),
    });

  const getSpecialistById = (id: number) =>
    useQuery<SpecialistResponse, AxiosError>({
      queryKey: ['specialist', id],
      queryFn: () => specialistService.getSpecialistById(id),
      enabled: !!id,
    });

  const getMyConsultations = () =>
    useQuery<ConsultationResponse[], AxiosError>({
      queryKey: ['my-consultations'],
      queryFn: () => specialistService.getMyConsultations(),
    });

  const createConsultation = useMutation<
    ConsultationResponse,
    AxiosError,
    ConsultationRequest
  >({
    mutationFn: (data) => specialistService.createConsultation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-consultations'] });
    },
  });

  const cancelConsultation = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationFn: (id) => specialistService.cancelConsultation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-consultations'] });
    },
  });

  const completeConsultation = useMutation<
    ConsultationResponse,
    AxiosError,
    { consultationId: number; notes: string; rating: number }
  >({
    mutationFn: ({ consultationId, notes, rating }) =>
      specialistService.completeConsultation(consultationId, { notes, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-consultations'] });
    },
  });

  return {
    getSpecialists,
    getSpecialistById,
    getMyConsultations,
    createConsultation,
    cancelConsultation,
    completeConsultation,
  };
};

export default useConsultations;