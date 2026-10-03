import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { PlantResponse, PlantCreateRequest } from '../types/plants';
import plantService from '../services/plantService';
import { AxiosError } from 'axios';

export const usePlants = () => {
  const queryClient = useQueryClient();

  const { data: plants, isLoading, error, refetch } = useQuery<
    PlantResponse[],
    AxiosError
  >({
    queryKey: ['plants'],
    queryFn: () => plantService.getAllPlants(),
  });

  const createPlant = useMutation<
    PlantResponse,
    AxiosError,
    PlantCreateRequest
  >({
    mutationFn: (data) => plantService.createPlant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });

  const updatePlant = useMutation<
    PlantResponse,
    AxiosError,
    { id: number; data: PlantCreateRequest }
  >({
    mutationFn: ({ id, data }) => plantService.updatePlant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });

  const deletePlant = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationFn: (id) => plantService.deletePlant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });

  const { data: needingAttention, isLoading: needingAttentionLoading } = useQuery<
    PlantResponse[],
    AxiosError
  >({
    queryKey: ['plants', 'needing-attention'],
    queryFn: () => plantService.getPlantsNeedingAttention(),
  });

  return {
    plants,
    isLoading,
    error,
    refetch,
    createPlant,
    updatePlant,
    deletePlant,
    needingAttention,
    needingAttentionLoading,
  };
};

export default usePlants;