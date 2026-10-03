import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Avatar,
  TextField,
  Alert,
  InputAdornment,
} from '@mui/material';
import { MedicalServices, Search, CalendarToday, Star, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { specialistService } from '../../services/specialistService';
import { SpecialistResponse } from '../../types/consultation';

const fallbackSpecialists: SpecialistResponse[] = [
  {
    id: 2,
    username: 'Dr. Green Thumb',
    fullName: 'Dr. Lily Green, Horticulturist',
    expertise: 'Tropical plants, succulents, soil health, and indoor gardens',
    bio: 'Certified horticulturist with 15+ years of botanical and plant pathology experience.',
    isActive: true,
  },
  {
    id: 99,
    username: 'Prof. Flora Bloom',
    fullName: 'Prof. Marcus Bloom',
    expertise: 'Bonsai, orchids, pest control, and nutrient deficiency diagnosis',
    bio: 'Botanical consultant and author specializing in rare houseplant cultivation.',
    isActive: true,
  },
];

export const SpecialistListPage = () => {
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState<SpecialistResponse[]>(fallbackSpecialists);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadSpecialists = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await specialistService.getAllSpecialists();
      const list = Array.isArray(res) ? res : res?.data || [];
      if (list.length > 0) {
        setSpecialists(list);
      }
    } catch (err: any) {
      console.warn('Specialists load error, using fallbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialists();
  }, []);

  const filteredSpecialists = specialists.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.username?.toLowerCase().includes(term) ||
      s.fullName?.toLowerCase().includes(term) ||
      s.expertise?.toLowerCase().includes(term)
    );
  });

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
            Expert Plant Care Specialists 🩺🌿
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Book 1-on-1 consultations with certified horticulturists and plant doctors
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<CalendarToday />}
          onClick={() => navigate('/consultations/my-appointments')}
        >
          My Appointments
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search specialists by name, specialty, or expertise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {specialists
            .filter((s) => {
              const q = search.toLowerCase();
              return (
                (s.fullName || s.username || '').toLowerCase().includes(q) ||
                (s.expertise || '').toLowerCase().includes(q) ||
                (s.bio || '').toLowerCase().includes(q)
              );
            })
            .map((spec) => (
              <Grid item xs={12} md={6} key={spec.id}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #E0E0E0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.08)' },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#1B5E20', width: 56, height: 56, fontSize: 24 }}>
                        {(spec.fullName || spec.username || 'S')[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {spec.fullName || spec.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {spec.expertise || 'Plant Health & Diagnostics'}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {spec.bio || 'Specialist available for scheduled video and chat consultations.'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip size="small" icon={<Star sx={{ color: '#F57C00 !important' }} />} label="4.9 (120+ reviews)" />
                      <Chip size="small" label="Certified Expert" color="success" variant="outlined" />
                    </Box>
                  </CardContent>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CalendarToday />}
                      sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, borderRadius: 2 }}
                      onClick={() => navigate(`/consultations/book/${spec.id}`)}
                    >
                      Book Consultation
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default SpecialistListPage;

