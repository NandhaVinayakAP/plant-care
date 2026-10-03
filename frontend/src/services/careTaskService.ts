import { api } from './authService';
import { ApiResponse } from '../types/api';
import { CareTaskResponse, CareTaskRequest } from '../types/tasks';

export const careTaskService = {
  getTasks: async (_page: number = 0, _size: number = 20, _sort: string = 'scheduledDate') => {
    try {
      const [upcomingRes, overdueRes] = await Promise.all([
        api.get<ApiResponse<CareTaskResponse[]>>('/care-tasks/upcoming'),
        api.get<ApiResponse<CareTaskResponse[]>>('/care-tasks/overdue')
      ]);
      const upcoming = upcomingRes.data?.data || [];
      const overdue = overdueRes.data?.data || [];
      const combined = [...overdue, ...upcoming];
      return {
        success: true,
        message: 'Tasks fetched',
        data: {
          content: combined,
          totalElements: combined.length,
          totalPages: 1,
          size: combined.length,
          number: 0,
          first: true,
          last: true,
          empty: combined.length === 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: false,
        message: 'Error fetching tasks',
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 0,
          number: 0,
          first: true,
          last: true,
          empty: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  getTasksByOwner: async (_userId?: number, page: number = 0, size: number = 20, sort: string = 'scheduledDate') => {
    return careTaskService.getTasks(page, size, sort);
  },

  getTaskById: async (taskId: number) => {
    const response = await api.get<ApiResponse<CareTaskResponse>>(`/care-tasks/${taskId}`);
    return response.data;
  },

  createTask: async (taskData: CareTaskRequest) => {
    const response = await api.post<ApiResponse<CareTaskResponse>>('/care-tasks', taskData);
    return response.data;
  },

  updateTask: async (taskId: number, taskData: Partial<CareTaskRequest>) => {
    const response = await api.put<ApiResponse<CareTaskResponse>>(`/care-tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: number) => {
    const response = await api.delete<ApiResponse<void>>(`/care-tasks/${taskId}`);
    return response.data;
  },

  completeTask: async (taskId: number) => {
    const response = await api.put<ApiResponse<CareTaskResponse>>(`/care-tasks/${taskId}/complete`);
    return response.data;
  },

  getUpcomingTasks: async () => {
    const response = await api.get<ApiResponse<CareTaskResponse[]>>('/care-tasks/upcoming');
    return response.data;
  },

  getOverdueTasks: async () => {
    const response = await api.get<ApiResponse<CareTaskResponse[]>>('/care-tasks/overdue');
    return response.data;
  },
};

export default careTaskService;
