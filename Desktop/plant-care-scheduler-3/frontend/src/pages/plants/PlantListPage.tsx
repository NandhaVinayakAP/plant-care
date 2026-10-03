import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search, Add, Refresh } from '@mui/icons-material';
import PlantCard from '../../components/features/plants/PlantCard';
import { plantService } from '../../services/plantService';
import { useAuth } from '../../store/AuthContext';
import { PlantResponse } from '../../types/plants';
import { useNavigate } from 'react-router-dom';

export const PlantListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('nickname');
  const [filter, setFilter] = useState<string>('');

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await plantService.getPlants(0, 50, sortBy);
      const plantData = response?.data?.content || response?.data || response || [];
      setPlants(Array.isArray(plantData) ? plantData : []);
    } catch (err: any) {
      setError('Failed to load plants');
      console.error('Plant load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, [user, sortBy]);

  const filteredPlants = plants.filter((plant) => {
    const term = filter.toLowerCase();
    return (
      plant?.nickname?.toLowerCase().includes(term) ||
      plant?.speciesCommonName?.toLowerCase().includes(term) ||
      plant?.location?.toLowerCase().includes(term)
    );
  });

  return (
    <Container maxWidth="xl">
      <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by plant nickname, species, or location..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="nickname">Nickname (A-Z)</MenuItem>
                <MenuItem value="healthStatus">Health Status</MenuItem>
                <MenuItem value="acquisitionDate">Acquisition Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Loading your plants...
          </Typography>
        </Box>
      ) : filteredPlants.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed #C8E6C9',
            bgcolor: '#F9FAF9',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              color: '#2E7D32',
              fontSize: '2.5rem',
            }}
          >
            🌱
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2E7D32', mb: 1 }}>
            {filter ? 'No plants match your search' : 'No plants added yet!'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            {filter
              ? 'Try adjusting your search query or clear the filter to view all plants.'
              : 'Start your plant journey by adding your first plant to your collection.'}
          </Typography>
          {filter ? (
            <Button variant="outlined" onClick={() => setFilter('')}>
              Clear Filter
            </Button>
          ) : (
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/plants/new')}>
              Add Your First Plant
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPlants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
              <PlantCard plant={plant} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PlantListPage;
