import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Avatar,
  Grid,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(20),
    email: z.string().email('Invalid email address').refine(
      (val) => val.toLowerCase().endsWith('@gmail.com'),
      { message: 'Only @gmail.com email addresses are allowed' }
    ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    fullName: z.string().optional(),
    location: z.string().optional(),
    gardeningExperience: z.string().optional(),
    bio: z.string().max(500).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      gardeningExperience: 'BEGINNER',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setSubmitting(true);
      setServerError(null);
      const { confirmPassword, ...userData } = data;
      await authRegister(userData as any);
      navigate('/');
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#2E7D32',
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 1.5,
              fontSize: '1.6rem',
            }}
          >
            🌱
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, color: '#1B5E20' }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join the Plant Care Scheduler community
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setServerError(null)}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                {...register('username')}
                required
                fullWidth
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                {...register('email')}
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                {...register('password')}
                required
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                required
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name (optional)"
                {...register('fullName')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location (optional)"
                {...register('location')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="experience-label">Gardening Experience</InputLabel>
                <Select
                  labelId="experience-label"
                  label="Gardening Experience"
                  defaultValue="BEGINNER"
                  {...register('gardeningExperience')}
                >
                  <MenuItem value="BEGINNER">Beginner</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                  <MenuItem value="EXPERT">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio (optional)"
                {...register('bio')}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={submitting}
            sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Typography
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ color: '#2E7D32', fontWeight: 600, textDecoration: 'none' }}
              >
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;