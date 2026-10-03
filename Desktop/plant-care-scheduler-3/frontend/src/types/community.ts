export enum ForumCategory {
  GENERAL = 'GENERAL',
  PLANT_CARE = 'PLANT_CARE',
  PEST_CONTROL = 'PEST_CONTROL',
  PROPAGATION = 'PROPAGATION',
  INDOOR_PLANTS = 'INDOOR_PLANTS',
  OUTDOOR_GARDENING = 'OUTDOOR_GARDENING',
  SHOWCASE = 'SHOWCASE'
}

export enum PostStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  PINNED = 'PINNED',
  FLAGGED = 'FLAGGED'
}

export interface CommunityPostResponse {
  id: number;
  authorId: number;
  authorUsername: string;
  forumCategory: ForumCategory;
  category?: string;
  title: string;
  content: string;
  plantId?: number;
  tags?: string;
  upvotes: number;
  downvotes: number;
  viewCount: number;
  isPinned: boolean;
  status: PostStatus;
  createdDate: string;
  commentsCount?: number;
}

export interface CommunityPostRequest {
  forumCategory?: ForumCategory;
  category?: string;
  title: string;
  content: string;
  plantId?: number;
  tags?: string | string[];
}

export interface CommentResponse {
  id: number;
  postId: number;
  authorId: number;
  authorUsername: string;
  content: string;
  text?: string;
  createdDate: string;
}

export interface CommentRequest {
  content?: string;
  text?: string;
}
