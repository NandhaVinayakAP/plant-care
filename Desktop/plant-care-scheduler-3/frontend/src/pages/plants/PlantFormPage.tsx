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
import { useNavigate, useParams } from 'react-router-dom';
import { plantService } from '../../services/plantService';
import { speciesService } from '../../services/speciesService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpeciesResponse } from '../../types/species';

const plantSchema = z.object({
  speciesId: z.number().positive('Please select a species'),
  nickname: z.string().min(1, 'Nickname is required').max(50),
  location: z.string().max(100).optional(),
  acquisitionDate: z.string().optional(),
  currentHeightCm: z.string().optional(),
  currentWidthCm: z.string().optional(),
  potSize: z.string().max(50).optional(),
  soilType: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

type PlantFormValues = z.infer<typeof plantSchema>;

const fallbackSpecies: SpeciesResponse[] = [
  { id: 1, commonName: 'Fiddle Leaf Fig', scientificName: 'Ficus lyrata', careDifficulty: 'MODERATE' as any, lightRequirements: 'HIGH' as any },
  { id: 2, commonName: 'Snake Plant', scientificName: 'Dracaena trifasciata', careDifficulty: 'EASY' as any, lightRequirements: 'LOW' as any },
  { id: 3, commonName: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa', careDifficulty: 'EASY' as any, lightRequirements: 'MEDIUM' as any },
  { id: 4, commonName: 'Golden Pothos', scientificName: 'Epipremnum aureum', careDifficulty: 'EASY' as any, lightRequirements: 'LOW' as any },
  { id: 5, commonName: 'Jade Plant', scientificName: 'Crassula ovata', careDifficulty: 'EASY' as any, lightRequirements: 'HIGH' as any },
];

export const PlantFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [speciesList, setSpeciesList] = useState<SpeciesResponse[]>(fallbackSpecies);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      speciesId: 1,
      nickname: '',
      location: 'Living Room',
      acquisitionDate: new Date().toISOString().split('T')[0],
      currentHeightCm: '30',
      currentWidthCm: '20',
      potSize: '8 inch',
      soilType: 'Standard potting soil',
      notes: '',
    },
  });

  const selectedSpeciesId = watch('speciesId');

  useEffect(() => {
    const loadSpeciesAndPlant = async () => {
      try {
        setLoading(true);
        try {
          const specRes = await speciesService.getAllSpecies(0, 100);
          const list = specRes?.data?.content || specRes?.data || specRes || [];
          if (Array.isArray(list) && list.length > 0) {
            setSpeciesList(list);
          }
        } catch {
        }

        if (id) {
          const plantRes = await plantService.getPlantById(Number(id));
          const p = plantRes?.data || plantRes;
          if (p) {
            reset({
              speciesId: p.speciesId || 1,
              nickname: p.nickname || '',
              location: p.location || '',
              acquisitionDate: p.acquisitionDate || '',
              currentHeightCm: p.currentHeightCm ? String(p.currentHeightCm) : '',
              currentWidthCm: p.currentWidthCm ? String(p.currentWidthCm) : '',
              potSize: p.potSize || '',
              soilType: p.soilType || '',
              notes: p.notes || '',
            });
          }
        }
      } catch (err: any) {
        setError('Failed to load form details');
      } finally {
        setLoading(false);
      }
    };

    loadSpeciesAndPlant();
  }, [id, reset]);

  const onSubmit = async (data: PlantFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        speciesId: Number(data.speciesId),
        nickname: data.nickname,
        location: data.location || undefined,
        acquisitionDate: data.acquisitionDate || undefined,
        currentHeightCm: data.currentHeightCm ? Number(data.currentHeightCm) : undefined,
        currentWidthCm: data.currentWidthCm ? Number(data.currentWidthCm) : undefined,
        potSize: data.potSize || undefined,
        soilType: data.soilType || undefined,
        notes: data.notes || undefined,
      };

      if (isEdit && id) {
        await plantService.updatePlant(Number(id), payload);
        navigate(`/plants/${id}`);
      } else {
        const res = await plantService.createPlant(payload);
        const newPlant = res?.data || res;
        navigate(newPlant?.id ? `/plants/${newPlant.id}` : '/plants');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save plant. Please check input values.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined" size="small">
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
          {isEdit ? 'Edit Plant Profile' : 'Add New Plant 🌿'}
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
              <TextField
                label="Nickname"
                {...register('nickname')}
                required
                fullWidth
                placeholder="e.g. Monty, Foliage Friend"
                error={!!errors.nickname}
                helperText={errors.nickname?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Acquisition Date"
                type="date"
                {...register('acquisitionDate')}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Location in Home"
                {...register('location')}
                fullWidth
                placeholder="e.g. Living room sunny window"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Height (cm)"
                type="number"
                {...register('currentHeightCm')}
                fullWidth
                placeholder="e.g. 45"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Width / Canopy Span (cm)"
                type="number"
                {...register('currentWidthCm')}
                fullWidth
                placeholder="e.g. 30"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Special Care Notes"
                {...register('notes')}
                multiline
                rows={4}
                fullWidth
                placeholder="e.g. Sensitive to drafts, likes misting in morning..."
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/plants')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={submitting}
              sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, px: 4 }}
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Plant' : 'Add to Collection'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PlantFormPage;
