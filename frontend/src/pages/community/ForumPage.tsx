import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import { Forum, Add, Refresh, ChatBubbleOutline, ThumbUp, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { communityService } from '../../services/communityService';
import { CommunityPostResponse, ForumCategory } from '../../types/community';
import { format } from 'date-fns';

export const ForumPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('ALL');

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communityService.getPosts(category === 'ALL' ? undefined : category);
      const postData = res?.data?.content || res?.data || res || [];
      setPosts(Array.isArray(postData) ? postData : []);
    } catch (err: any) {
      setError('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category]);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
            Gardening Community & Forum 💬
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect with fellow plant enthusiasts, ask questions, and share tips
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadPosts}>
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/community/new')}
          >
            Create Discussion Post
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <FormControl fullWidth size="small">
          <InputLabel id="category-filter-label">Filter by Topic Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={category}
            label="Filter by Topic Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="ALL">All Topics & Discussions</MenuItem>
            <MenuItem value="GENERAL_PLANT_CARE">General Plant Care</MenuItem>
            <MenuItem value="PEST_DISEASE_IDENTIFICATION">Pest & Disease ID</MenuItem>
            <MenuItem value="PROPAGATION_TIPS">Propagation Tips</MenuItem>
            <MenuItem value="PLANT_SHOWCASE">Plant Showcase & Collections</MenuItem>
            <MenuItem value="SPECIALIST_QA">Specialist Q&A</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #E0E0E0' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No discussions found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Be the first to start a conversation in this topic!
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/community/new')}>
            Start New Discussion
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {posts.map((post) => (
            <Paper
              key={post.id}
              elevation={0}
              onClick={() => navigate(`/community/post/${post.id}`)}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E0E0E0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#2E7D32', transform: 'translateY(-2px)' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: '#2E7D32', width: 40, height: 40 }}>
                    {post.authorName ? post.authorName[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {post.authorName || 'Anonymous Gardener'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.createdDate ? format(new Date(post.createdDate), 'MMM d, yyyy') : 'Recently'}
                    </Typography>
                  </Box>
                </Box>
                <Chip label={post.category || 'Discussion'} size="small" variant="outlined" color="primary" />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {post.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                {post.content}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ThumbUp fontSize="small" />
                  <Typography variant="caption">{post.upvotes ?? post.likesCount ?? 0} Likes</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ChatBubbleOutline fontSize="small" />
                  <Typography variant="caption">{post.commentCount ?? post.comments?.length ?? 0} Comments</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ForumPage;
