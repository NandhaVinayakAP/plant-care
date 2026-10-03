import { api } from './authService';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { CommunityPostResponse, CommunityPostRequest, CommentResponse, CommentRequest } from '../types/community';

export const communityService = {
  getPosts: async (category?: string, page: number = 0, size: number = 20) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category.toUpperCase());
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<CommunityPostResponse>>>(
      `/community/forums?${params.toString()}`
    );
    return response.data;
  },

  createPost: async (postData: CommunityPostRequest) => {
    const payload = {
      title: postData.title,
      content: postData.content,
      forumCategory: postData.forumCategory || (postData.category ? postData.category.toUpperCase() : 'GENERAL'),
      plantId: postData.plantId,
      tags: Array.isArray(postData.tags) ? postData.tags.join(',') : postData.tags,
    };
    const response = await api.post<ApiResponse<CommunityPostResponse>>('/community/forums/posts', payload);
    return response.data;
  },

  getPostById: async (postId: number) => {
    const response = await api.get<ApiResponse<CommunityPostResponse>>(`/community/posts/${postId}`);
    return response.data?.data || response.data;
  },

  deletePost: async (postId: number) => {
    const response = await api.delete<ApiResponse<void>>(`/community/posts/${postId}`);
    return response.data;
  },

  getComments: async (_postId: number): Promise<CommentResponse[]> => {
    return [];
  },

  createComment: async (postId: number, data: CommentRequest): Promise<CommentResponse> => {
    return {
      id: Date.now(),
      postId,
      authorId: 1,
      authorUsername: 'You',
      content: data.content || data.text || '',
      createdDate: new Date().toISOString(),
    };
  },

  deleteComment: async (_commentId: number): Promise<void> => {
    return Promise.resolve();
  },
};

export default communityService;