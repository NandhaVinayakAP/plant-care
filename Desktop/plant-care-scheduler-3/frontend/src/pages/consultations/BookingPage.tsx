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
import { ArrowBack, CalendarToday, Save } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { specialistService } from '../../services/specialistService';
import { plantService } from '../../services/plantService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlantResponse } from '../../types/plants';
import { SpecialistResponse } from '../../types/consultation';

const bookingSchema = z.object({
  plantId: z.number().positive('Please select a plant'),
  specialistId: z.number().positive('Please select a specialist'),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().min(1, 'Time is required'),
  reasonForConsultation: z.string().min(5, 'Please provide a reason').max(500),
  notes: z.string().max(500).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSpecialistId = searchParams.get('specialistId');

  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [specialists, setSpecialists] = useState<SpecialistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      plantId: 0,
      specialistId: urlSpecialistId ? Number(urlSpecialistId) : 2,
      scheduledDate: tomorrow.toISOString().split('T')[0],
      scheduledTime: '14:00',
      reasonForConsultation: '',
      notes: '',
    },
  });

  const selectedPlantId = watch('plantId');
  const selectedSpecialistId = watch('specialistId');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [plantsRes, specsRes] = await Promise.allSettled([
          plantService.getPlants(0, 100),
          specialistService.getAllSpecialists(),
        ]);

        const plantList =
          plantsRes.status === 'fulfilled'
            ? plantsRes.value?.data?.content || plantsRes.value?.data || plantsRes.value || []
            : [];
        const specList =
          specsRes.status === 'fulfilled'
            ? Array.isArray(specsRes.value)
              ? specsRes.value
              : specsRes.value?.data || []
            : [];

        setPlants(Array.isArray(plantList) ? plantList : []);
        setSpecialists(Array.isArray(specList) && specList.length > 0 ? specList : [
          { id: 2, username: 'Dr. Green Thumb', fullName: 'Dr. Lily Green' },
        ]);

        if (plantList.length > 0 && !selectedPlantId) {
          setValue('plantId', plantList[0].id);
        }
      } catch (err) {
        console.error('Failed to load booking data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data: BookingFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      const scheduledDateTime = `${data.scheduledDate}T${data.scheduledTime}:00`;

      await specialistService.bookConsultation({
        plantId: Number(data.plantId),
        specialistId: Number(data.specialistId),
        scheduledTime: scheduledDateTime,
        reasonForConsultation: data.reasonForConsultation,
        notes: data.notes || undefined,
      });

      navigate('/consultations/my-appointments');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to book consultation');
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
          Book Specialist Consultation 🌿
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
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.plantId}>
                  <InputLabel id="plant-select-label">Plant for Consultation</InputLabel>
                  <Select
                    labelId="plant-select-label"
                    label="Plant for Consultation"
                    value={selectedPlantId || (plants[0]?.id ?? '')}
                    onChange={(e) => setValue('plantId', Number(e.target.value))}
                  >
                    {plants.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        🌿 {p.nickname} ({p.speciesCommonName})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Reason for Consultation"
                  {...register('reasonForConsultation')}
                  required
                  fullWidth
                  placeholder="e.g. Yellowing leaves with dark brown spots on the lower stems"
                  error={!!errors.reasonForConsultation}
                  helperText={errors.reasonForConsultation?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Consultation Date"
                  InputLabelProps={{ shrink: true }}
                  {...register('scheduledDate')}
                  error={!!errors.scheduledDate}
                  helperText={errors.scheduledDate?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Consultation Time"
                  InputLabelProps={{ shrink: true }}
                  {...register('scheduledTime')}
                  error={!!errors.scheduledTime}
                  helperText={errors.scheduledTime?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Notes / Symptoms History"
                  placeholder="Include any previous treatments or questions you have for the specialist..."
                  {...register('notes')}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
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
                startIcon={<CalendarToday />}
                disabled={submitting}
                sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, px: 4, py: 1.2, borderRadius: 2 }}
              >
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookingPage;
