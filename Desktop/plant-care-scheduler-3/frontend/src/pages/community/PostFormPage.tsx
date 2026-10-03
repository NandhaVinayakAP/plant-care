import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Alert,
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { communityService } from '../../services/communityService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForumCategory } from '../../types/community';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  category: z.nativeEnum(ForumCategory),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000),
  tags: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export const PostFormPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      category: ForumCategory.GENERAL,
      content: '',
      tags: 'plants, tips, care',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: PostFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      await communityService.createPost({
        title: data.title,
        forumCategory: data.category,
        content: data.content,
        tags: data.tags,
      });

      navigate('/community');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create discussion post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined" size="small">
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
          Create New Discussion 💬
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="post-cat-label">Forum Category</InputLabel>
                <Select
                  labelId="post-cat-label"
                  label="Forum Category"
                  value={selectedCategory}
                  onChange={(e) => setValue('category', e.target.value as ForumCategory)}
                >
                  <MenuItem value={ForumCategory.GENERAL}>General Gardening</MenuItem>
                  <MenuItem value={ForumCategory.PLANT_CARE}>Plant Care & Advice</MenuItem>
                  <MenuItem value={ForumCategory.PEST_CONTROL}>Pest & Disease Control</MenuItem>
                  <MenuItem value={ForumCategory.PROPAGATION}>Propagation & Repotting</MenuItem>
                  <MenuItem value={ForumCategory.INDOOR_PLANTS}>Indoor Plants</MenuItem>
                  <MenuItem value={ForumCategory.OUTDOOR_GARDENING}>Outdoor Gardening</MenuItem>
                  <MenuItem value={ForumCategory.SHOWCASE}>Plant Showcase</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Discussion Body"
                {...register('content')}
                required
                fullWidth
                multiline
                rows={6}
                placeholder="Describe your question, observation, or helpful tips for the gardening community..."
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/community')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Send />}
              disabled={submitting}
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostFormPage;