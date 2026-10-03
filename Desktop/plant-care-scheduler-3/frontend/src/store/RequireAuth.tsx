import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress color="success" />
        <Typography variant="body2" color="text.secondary">Checking authentication...</Typography>
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress color="success" />
        <Typography variant="body2" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  return !user ? children : <Navigate to="/" replace />;
};