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
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { healthService } from '../../services/healthService';
import { plantService } from '../../services/plantService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HealthStatus } from '../../types/health';
import { PlantResponse } from '../../types/plants';

const healthSchema = z.object({
  plantId: z.number().positive('Please select a plant'),
  recordDate: z.string().min(1, 'Date is required'),
  overallHealth: z.nativeEnum(HealthStatus),
  symptoms: z.string().max(500).optional(),
  diagnosedIssues: z.string().max(500).optional(),
  treatmentsApplied: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});

type HealthFormValues = z.infer<typeof healthSchema>;

export const HealthLogPage = () => {
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
  } = useForm<HealthFormValues>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      plantId: initialPlantId ? Number(initialPlantId) : 0,
      recordDate: new Date().toISOString().split('T')[0],
      overallHealth: HealthStatus.GOOD,
      symptoms: '',
      diagnosedIssues: '',
      treatmentsApplied: '',
      notes: '',
    },
  });

  const selectedPlantId = watch('plantId');
  const selectedHealth = watch('overallHealth');

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

  const onSubmit = async (data: HealthFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      await healthService.createHealthRecord({
        plantId: Number(data.plantId),
        overallHealth: data.overallHealth,
        healthStatus: data.overallHealth,
        recordDate: `${data.recordDate}T12:00:00`,
        symptoms: data.symptoms || undefined,
        diagnosedIssues: data.diagnosedIssues || undefined,
        treatmentsApplied: data.treatmentsApplied || undefined,
        treatmentApplied: data.treatmentsApplied || undefined,
        notes: data.notes || undefined,
      });

      await plantService.updateHealthStatus(Number(data.plantId), data.overallHealth);
      navigate(`/plants/${data.plantId}/health`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to log health inspection');
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
          Plant Health Log 🩺
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
              Add a plant first before recording health observations.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/plants/new')}>
              Add Plant
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="health-status-label">Overall Health Status</InputLabel>
                  <Select
                    labelId="health-status-label"
                    label="Overall Health Status"
                    value={selectedHealth}
                    onChange={(e) => setValue('overallHealth', e.target.value as HealthStatus)}
                  >
                    <MenuItem value={HealthStatus.EXCELLENT}>🌟 Excellent (Vibrant, flourishing)</MenuItem>
                    <MenuItem value={HealthStatus.GOOD}>✅ Good (Healthy, minor regular wear)</MenuItem>
                    <MenuItem value={HealthStatus.FAIR}>⚠️ Fair (Needs observation)</MenuItem>
                    <MenuItem value={HealthStatus.POOR}>🍂 Poor (Signs of distress or pests)</MenuItem>
                    <MenuItem value={HealthStatus.CRITICAL}>🚨 Critical (Immediate intervention needed)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Symptoms Observed"
                  {...register('symptoms')}
                  fullWidth
                  placeholder="e.g. Yellow tips, curling leaves, powdery mildew"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Treatments Applied"
                  {...register('treatmentsApplied')}
                  fullWidth
                  placeholder="e.g. Neem oil spray, moved to indirect light, flushed soil"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Diagnosed Issues"
                  {...register('diagnosedIssues')}
                  fullWidth
                  placeholder="e.g. Spider mites, root rot, nitrogen deficiency"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Progress Notes & Next Checkup Observations"
                  placeholder="Record growth progress, new bud formation, or any changes..."
                  {...register('notes')}
                />
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
                {submitting ? 'Saving...' : 'Save Health Record'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default HealthLogPage;
