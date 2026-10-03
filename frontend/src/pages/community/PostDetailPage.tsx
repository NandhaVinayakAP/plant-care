import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Chip,
  Avatar,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';
import { ArrowBack, Send, ThumbUp, Delete } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { communityService } from '../../services/communityService';
import { CommunityPostResponse, CommentResponse } from '../../types/community';
import { useAuth } from '../../store/AuthContext';
import { format } from 'date-fns';

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<CommunityPostResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPostDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const postRes = await communityService.getPostById(Number(id));
      setPost(postRes);
      const commentsRes = await communityService.getComments(Number(id));
      setComments(Array.isArray(commentsRes) ? commentsRes : []);
    } catch (err: any) {
      setError('Failed to load post details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostDetails();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;
    try {
      setSubmittingComment(true);
      const newComment = await communityService.createComment(Number(id), { content: commentText });
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this discussion?')) return;
    try {
      await communityService.deletePost(Number(id));
      navigate('/community');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/community')} sx={{ mb: 2 }}>
          Back to Discussions
        </Button>
        <Alert severity="error">{error || 'Post not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/community')} variant="outlined" size="small">
          Back to Discussions
        </Button>
        {user?.username === post.authorUsername && (
          <Button startIcon={<Delete />} color="error" variant="outlined" size="small" onClick={handleDeletePost}>
            Delete
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#2E7D32', width: 48, height: 48 }}>
              {post.authorName ? post.authorName[0].toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {post.authorName || 'Gardener'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {post.createdDate ? format(new Date(post.createdDate), 'MMMM d, yyyy HH:mm') : 'Recently'}
              </Typography>
            </Box>
          </Box>
          <Chip label={post.category || 'General'} color="primary" variant="outlined" size="small" />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          {post.title}
        </Typography>

        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: 'text.primary', mb: 3 }}>
          {post.content}
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          💬 Replies & Comments ({comments.length})
        </Typography>

        <Box component="form" onSubmit={handleAddComment} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your thoughts or advice..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={submittingComment}
          />
          <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<Send />}
              disabled={submittingComment || !commentText.trim()}
              sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, borderRadius: 2 }}
            >
              {submittingComment ? 'Posting...' : 'Post Reply'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No comments yet. Be the first to reply!
          </Typography>
        ) : (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ p: 2, borderRadius: 2, bgcolor: '#F9FBE7', border: '1px solid #E0E0E0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {comment.authorName || 'Community Member'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.createdDate ? format(new Date(comment.createdDate), 'MMM d, yyyy') : 'Just now'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {comment.content}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default PostDetailPage;
