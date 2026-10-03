import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Avatar,
  TextField,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import { Person, Edit, Save, Logout } from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [location, setLocation] = useState(user?.location || '');
  const [gardeningExperience, setGardeningExperience] = useState(user?.gardeningExperience || 'INTERMEDIATE');
  const [bio, setBio] = useState(user?.bio || '');
  const [expertise, setExpertise] = useState(user?.expertise || '');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await updateProfile({
        fullName,
        location,
        gardeningExperience,
        bio,
        expertise,
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
          User Profile 👤
        </Typography>
        <Button variant="outlined" color="error" startIcon={<Logout />} onClick={handleLogout}>
          Sign Out
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#2E7D32', fontSize: 32 }}>
            {user?.fullName ? user.fullName[0].toUpperCase() : (user?.username ? user.username[0].toUpperCase() : 'U')}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {user?.fullName || user?.username || 'Plant Lover'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip label={user?.role || 'STANDARD_PLANT_OWNER'} size="small" color="primary" variant="outlined" />
              <Chip label={user?.gardeningExperience || gardeningExperience} size="small" color="success" />
            </Box>
          </Box>
          <Button
            variant={isEditing ? 'outlined' : 'contained'}
            startIcon={<Edit />}
            onClick={() => setIsEditing(!isEditing)}
            sx={{
              borderRadius: 2,
              bgcolor: isEditing ? 'transparent' : '#2E7D32',
              '&:hover': { bgcolor: isEditing ? 'transparent' : '#1B5E20' },
            }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleSaveProfile}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                disabled={!isEditing}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gardening Experience"
                select
                SelectProps={{ native: true }}
                disabled={!isEditing}
                value={gardeningExperience}
                onChange={(e) => setGardeningExperience(e.target.value as any)}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialty / Expertise"
                disabled={!isEditing}
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g. Tropicals, Succulents"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                disabled={!isEditing}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your indoor jungle..."
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={submitting}
                sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, px: 4, py: 1, borderRadius: 2 }}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
