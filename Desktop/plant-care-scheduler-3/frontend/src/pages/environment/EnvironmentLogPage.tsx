import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { ArrowBack, Save, Cloud, Thermostat, WaterDrop, WbSunny, Science } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { environmentService } from '../../services/environmentService';
import { plantService } from '../../services/plantService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataSource } from '../../types/environment';
import { PlantResponse } from '../../types/plants';

const envSchema = z.object({
  plantId: z.number().positive('Please select a plant'),
  temperatureCelsius: z.string().optional(),
  humidityPercentage: z.string().optional(),
  lightLevelLux: z.string().optional(),
  soilMoisturePercentage: z.string().optional(),
  phLevel: z.string().optional(),
  dataSource: z.nativeEnum(DataSource),
});

type EnvFormValues = z.infer<typeof envSchema>;

export const EnvironmentLogPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlantId = searchParams.get('plantId');

  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnvFormValues>({
    resolver: zodResolver(envSchema),
    defaultValues: {
      plantId: initialPlantId ? Number(initialPlantId) : 0,
      temperatureCelsius: '22.5',
      humidityPercentage: '55.0',
      lightLevelLux: '1200',
      soilMoisturePercentage: '60.0',
      phLevel: '6.5',
      dataSource: DataSource.MANUAL,
    },
  });

  const selectedPlantId = watch('plantId');

  useEffect(() => {
    const loadPlants = async () => {
      try {
        setLoading(true);
        const res = await plantService.getPlants(0, 100);
        const list = res?.data?.content || res?.data || res || [];
        const plantsArr = Array.isArray(list) ? list : [];
        setPlants(plantsArr);
        if (plantsArr.length > 0 && (!initialPlantId || !selectedPlantId)) {
          setValue('plantId', plantsArr[0].id);
        }
      } catch (err) {
        console.error('Failed to load plants', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlants();
  }, [initialPlantId]);

  const onSubmit = async (data: EnvFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      await environmentService.recordData({
        plantId: Number(data.plantId),
        temperatureCelsius: data.temperatureCelsius ? Number(data.temperatureCelsius) : undefined,
        temperatureC: data.temperatureCelsius ? Number(data.temperatureCelsius) : undefined,
        humidityPercentage: data.humidityPercentage ? Number(data.humidityPercentage) : undefined,
        humidityPercent: data.humidityPercentage ? Number(data.humidityPercentage) : undefined,
        lightLevelLux: data.lightLevelLux ? Number(data.lightLevelLux) : undefined,
        soilMoisturePercentage: data.soilMoisturePercentage ? Number(data.soilMoisturePercentage) : undefined,
        soilMoisturePercent: data.soilMoisturePercentage ? Number(data.soilMoisturePercentage) : undefined,
        phLevel: data.phLevel ? Number(data.phLevel) : undefined,
        dataSource: data.dataSource,
      });

      navigate(`/plants/${data.plantId}/environment`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to record environment data');
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
          Record Environmental Data 🌡️
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : plants.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Add a plant first before recording environment conditions.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/plants/new')}>
              Add Plant
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="source-label">Data Source</InputLabel>
                  <Select
                    labelId="source-label"
                    label="Data Source"
                    defaultValue={DataSource.MANUAL}
                    {...register('dataSource')}
                  >
                    <MenuItem value={DataSource.MANUAL}>Manual Measurement / Inspection</MenuItem>
                    <MenuItem value={DataSource.SENSOR}>IoT Smart Sensor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Relative Humidity"
                  type="number"
                  step="0.1"
                  {...register('humidityPercentage')}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WaterDrop color="info" />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Soil Moisture"
                  type="number"
                  step="0.1"
                  {...register('soilMoisturePercentage')}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WaterDrop color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Light Level (Lux)"
                  type="number"
                  {...register('lightLevelLux')}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WbSunny color="warning" />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">lux</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Soil pH Level"
                  type="number"
                  step="0.1"
                  {...register('phLevel')}
                  fullWidth
                  placeholder="e.g. 6.5"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Science color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="data-source-label">Data Source</InputLabel>
                  <Select
                    labelId="data-source-label"
                    label="Data Source"
                    defaultValue={DataSource.MANUAL}
                    onChange={(e) => setValue('dataSource', e.target.value as DataSource)}
                  >
                    <MenuItem value={DataSource.MANUAL}>Manual Entry</MenuItem>
                    <MenuItem value={DataSource.SENSOR}>IoT Sensor Device</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={submitting}
                sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, px: 4 }}
              >
                {submitting ? 'Recording...' : 'Record Environment'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EnvironmentLogPage;
