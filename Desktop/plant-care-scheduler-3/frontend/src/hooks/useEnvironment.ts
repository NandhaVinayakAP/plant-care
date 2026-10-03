import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  EnvironmentalDataResponse,
  EnvironmentalDataRequest,
} from '../types/environment';
import environmentService from '../services/environmentService';
import { AxiosError } from 'axios';

export const useEnvironment = (plantId: number) => {
  const queryClient = useQueryClient();

  const { data: environmentalData, isLoading, error, refetch } = useQuery<
    EnvironmentalDataResponse[],
    AxiosError
  >({
    queryKey: ['environment-records', plantId],
    queryFn: () => environmentService.getEnvironmentalData(plantId),
    enabled: !!plantId,
  });

  const createEnvironmentalRecord = useMutation<
    EnvironmentalDataResponse,
    AxiosError,
    EnvironmentalDataRequest
  >({
    mutationFn: (data) => environmentService.createEnvironmentalData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environment-records', plantId] });
    },
  });

  const updateEnvironmentalRecord = useMutation<
    EnvironmentalDataResponse,
    AxiosError,
    { id: number; data: EnvironmentalDataRequest }
  >({
    mutationFn: ({ id, data }) => environmentService.updateEnvironmentalData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environment-records', plantId] });
    },
  });

  const deleteEnvironmentalRecord = useMutation<
    void,
    AxiosError,
    { id: number }
  >({
    mutationFn: (id) => environmentService.deleteEnvironmentalData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environment-records', plantId] });
    },
  });

  return {
    environmentalData,
    isLoading,
    error,
    refetch,
    createEnvironmentalRecord,
    updateEnvironmentalRecord,
    deleteEnvironmentalRecord,
  };
};

export default useEnvironment;