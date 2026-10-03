import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HealthRecordResponse,
  HealthRecordRequest,
} from '../types/health';
import healthService from '../services/healthService';
import { AxiosError } from 'axios';

export const useHealth = () => {
  const queryClient = useQueryClient();

  const createHealthRecord = useMutation<
    HealthRecordResponse,
    AxiosError,
    HealthRecordRequest
  >({
    mutationFn: (data) => healthService.createHealthRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
    },
  });

  const updateHealthRecord = useMutation<
    HealthRecordResponse,
    AxiosError,
    { id: number; data: HealthRecordRequest }
  >({
    mutationFn: ({ id, data }) => healthService.updateHealthRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
    },
  });

  const deleteHealthRecord = useMutation<
    void,
    AxiosError,
    { id: number }
  >({
    mutationFn: (id) => healthService.deleteHealthRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
    },
  });

  return {
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
  };
};

export default useHealth;