import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Avatar,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import { LockOutlined, EmailOutlined, ArrowForward } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'user',
      password: 'user123',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setSubmitting(true);
      setServerError(null);
      await login(data.username, data.password);
      navigate('/');
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Invalid username or password. Try a demo account below.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setValue('username', u);
    setValue('password', p);
    // Auto-submit after setting values
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 0);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#2E7D32',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 1.5,
              fontSize: '1.8rem',
            }}
          >
            🌿
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, color: '#1B5E20' }}>
            Plant Care Scheduler
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your plant collection
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setServerError(null)}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Username or Email"
            {...register('username')}
            fullWidth
            required
            margin="normal"
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="Password"
            type="password"
            {...register('password')}
            fullWidth
            required
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={submitting}
            sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ color: '#2E7D32', fontWeight: 600, textDecoration: 'none' }}
              >
                Register here
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            DEMO ACCOUNTS
          </Typography>
        </Divider>

        <Stack spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('user', 'user123')}
            sx={{ justifyContent: 'space-between' }}
          >
            <span>Standard User: <b>user</b> / <b>user123</b></span>
            <ArrowForward fontSize="small" />
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('specialist', 'specialist123')}
            sx={{ justifyContent: 'space-between' }}
          >
            <span>Specialist: <b>specialist</b> / <b>specialist123</b></span>
            <ArrowForward fontSize="small" />
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('admin', 'admin123')}
            sx={{ justifyContent: 'space-between' }}
          >
            <span>Admin: <b>admin</b> / <b>admin123</b></span>
            <ArrowForward fontSize="small" />
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;