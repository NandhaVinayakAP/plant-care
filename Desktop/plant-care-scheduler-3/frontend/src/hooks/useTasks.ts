export const useCareTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error, refetch } = useQuery<
    CareTaskResponse[],
    AxiosError
  >({
    queryKey: ['care-tasks'],
    queryFn: () => careTaskService.getAllTasks(),
  });

  const createTask = useMutation<
    CareTaskResponse,
    AxiosError,
    CareTaskRequest
  >({
    mutationFn: (data) => careTaskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-tasks'] });
    },
  });

  const updateTask = useMutation<
    CareTaskResponse,
    AxiosError,
    { id: number; data: CareTaskRequest }
  >({
    mutationFn: ({ id, data }) => careTaskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-tasks'] });
    },
  });

  const deleteTask = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationFn: (id) => careTaskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-tasks'] });
    },
  });

  const completeTask = useMutation<
    CareTaskResponse,
    AxiosError,
    number
  >({
    mutationFn: (id) => careTaskService.completeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-tasks'] });
    },
  });

  const { data: upcomingTasks, isLoading: upcomingLoading } = useQuery<
    CareTaskResponse[],
    AxiosError
  >({
    queryKey: ['care-tasks', 'upcoming'],
    queryFn: () => careTaskService.getUpcomingTasks(),
  });

  const { data: overdueTasks, isLoading: overdueLoading } = useQuery<
    CareTaskResponse[],
    AxiosError
  >({
    queryKey: ['care-tasks', 'overdue'],
    queryFn: () => careTaskService.getOverdueTasks(),
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    upcomingTasks,
    upcomingLoading,
    overdueTasks,
    overdueLoading,
  };
};

export default useCareTasks;