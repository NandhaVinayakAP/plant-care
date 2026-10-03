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
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  LocalFlorist,
  WaterDrop,
  Science,
  ContentCut,
  Favorite,
  Cloud,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { plantService } from '../../services/plantService';
import { careTaskService } from '../../services/careTaskService';
import { PlantResponse, HealthStatus } from '../../types/plants';
import { TaskType } from '../../types/tasks';
import { format } from 'date-fns';

export const PlantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<PlantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<HealthStatus>(HealthStatus.GOOD);

  const loadPlantData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await plantService.getPlantById(Number(id));
      const plantData = response?.data || response;
      setPlant(plantData);
      if (plantData?.healthStatus) {
        setSelectedStatus(plantData.healthStatus);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load plant details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlantData();
  }, [id]);

  const handleQuickCare = async (taskType: TaskType) => {
    if (!plant) return;
    try {
      await careTaskService.createTask({
        plantId: plant.id,
        taskType,
        title: `Quick ${taskType.toLowerCase()}`,
        scheduledDate: new Date().toISOString(),
      });
      setSuccessMsg(`Successfully performed ${taskType.toLowerCase()} on ${plant.nickname}!`);
      loadPlantData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to record care action');
    }
  };

  const handleUpdateHealthStatus = async () => {
    if (!plant) return;
    try {
      await plantService.updateHealthStatus(plant.id, selectedStatus);
      setStatusDialogOpen(false);
      setSuccessMsg(`Health status updated to ${selectedStatus}`);
      loadPlantData();
    } catch (err: any) {
      setError('Failed to update health status');
    }
  };

  const handleDeletePlant = async () => {
    if (!plant || !window.confirm(`Are you sure you want to delete ${plant.nickname}?`)) return;
    try {
      await plantService.deletePlant(plant.id);
      navigate('/plants');
    } catch (err: any) {
      setError('Failed to delete plant');
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return '#4CAF50';
      case 'GOOD':
        return '#8BC34A';
      case 'FAIR':
        return '#FFC107';
      case 'POOR':
        return '#FF9800';
      case 'CRITICAL':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading plant details...
        </Typography>
      </Container>
    );
  }

  if (!plant) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/plants')} sx={{ mb: 2 }}>
          Back to My Plants
        </Button>
        <Alert severity="error">{error || 'Plant not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #E0E0E0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: 3,
                bgcolor: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
              }}
            >
              🌿
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
                {plant.nickname}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {plant.speciesCommonName} ({plant.speciesScientificName})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                <Chip
                  label={plant.healthStatus}
                  size="small"
                  sx={{
                    bgcolor: `${getHealthColor(plant.healthStatus)}20`,
                    color: getHealthColor(plant.healthStatus),
                    fontWeight: 700,
                  }}
                  onClick={() => setStatusDialogOpen(true)}
                />
                {plant.location && (
                  <Chip label={`📍 ${plant.location}`} size="small" variant="outlined" />
                )}
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Favorite />}
            onClick={() => setStatusDialogOpen(true)}
          >
            Update Health
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', height: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🌿 Plant Characteristics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Acquisition Date:</Typography>
                  <Typography fontWeight={500}>{plant.acquisitionDate || 'Not specified'}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Current Height:</Typography>
                  <Typography fontWeight={500}>
                    {plant.currentHeightCm ? `${plant.currentHeightCm} cm` : 'Not recorded'}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Current Width:</Typography>
                  <Typography fontWeight={500}>
                    {plant.currentWidthCm ? `${plant.currentWidthCm} cm` : 'Not recorded'}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Pot Size:</Typography>
                  <Typography fontWeight={500}>{plant.potSize || 'Standard'}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Soil Type:</Typography>
                  <Typography fontWeight={500}>{plant.soilType || 'Potting mix'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', height: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🕒 Care History
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Last Watered:</Typography>
                  <Typography fontWeight={500}>
                    {plant.lastWateredDate
                      ? format(new Date(plant.lastWateredDate), 'MMM d, yyyy h:mm a')
                      : 'Never'}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Last Fertilized:</Typography>
                  <Typography fontWeight={500}>
                    {plant.lastFertilizedDate
                      ? format(new Date(plant.lastFertilizedDate), 'MMM d, yyyy h:mm a')
                      : 'Never'}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Last Pruned:</Typography>
                  <Typography fontWeight={500}>
                    {plant.lastPrunedDate
                      ? format(new Date(plant.lastPrunedDate), 'MMM d, yyyy h:mm a')
                      : 'Never'}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Last Repotted:</Typography>
                  <Typography fontWeight={500}>
                    {plant.lastRepottedDate
                      ? format(new Date(plant.lastRepottedDate), 'MMM d, yyyy h:mm a')
                      : 'Never'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {plant.notes && (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📝 Notes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {plant.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default PlantDetailPage;
