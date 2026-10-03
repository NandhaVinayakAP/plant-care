import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  CommunityPostResponse,
  CommunityPostRequest,
  CommentResponse,
  CommentRequest,
} from '../types/community';
import communityService from '../services/communityService';
import { AxiosError } from 'axios';

export const useCommunity = () => {
  const queryClient = useQueryClient();

  const getCommunityPosts = (params: {
    category?: string;
    page?: number;
    size?: number;
  }) =>
    useQuery<CommunityPostResponse[], AxiosError>({
      queryKey: ['community-posts', params],
      queryFn: () => communityService.getPosts(params.category, params.page, params.size),
      enabled: true,
    });

  const getPostById = (id: number) =>
    useQuery<CommunityPostResponse, AxiosError>({
      queryKey: ['community-post', id],
      queryFn: () => communityService.getPostById(id),
      enabled: !!id,
    });

  const createCommunityPost = useMutation<
    CommunityPostResponse,
    AxiosError,
    CommunityPostRequest
  >({
    mutationFn: (data) => communityService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });

  const deleteCommunityPost = useMutation<
    void,
    AxiosError,
    number
  >({
    mutationFn: (id) => communityService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });

  const getPostComments = (postId: number) =>
    useQuery<CommentResponse[], AxiosError>({
      queryKey: ['post-comments', postId],
      queryFn: () => communityService.getComments(postId),
      enabled: !!postId,
    });

  const createComment = useMutation<
    CommentResponse,
    AxiosError,
    { postId: number; data: CommentRequest }
  >({
    mutationFn: ({ postId, data }) => communityService.createComment(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
    },
  });

  const deleteComment = useMutation<
    void,
    AxiosError,
    { postId: number; commentId: number }
  >({
    mutationFn: ({ postId, commentId }) => communityService.deleteComment(commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
    },
  });

  return {
    getCommunityPosts,
    getPostById,
    createCommunityPost,
    deleteCommunityPost,
    getPostComments,
    createComment,
    deleteComment,
  };
};

export default useCommunity;