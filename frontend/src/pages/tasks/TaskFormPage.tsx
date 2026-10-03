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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { careTaskService } from '../../services/careTaskService';
import { plantService } from '../../services/plantService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskType, TaskPriority } from '../../types/tasks';
import { PlantResponse } from '../../types/plants';

const taskSchema = z.object({
  plantId: z.number().positive('Please select a plant'),
  taskType: z.nativeEnum(TaskType),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  notes: z.string().max(500).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const TaskFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      plantId: initialPlantId ? Number(initialPlantId) : 0,
      taskType: TaskType.WATERING,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      priority: TaskPriority.MEDIUM,
      notes: '',
    },
  });

  const selectedPlantId = watch('plantId');
  const selectedTaskType = watch('taskType');
  const selectedPriority = watch('priority');

  useEffect(() => {
    const loadPlants = async () => {
      try {
        setLoading(true);
        const res = await plantService.getPlants(0, 100);
        const plantData = res?.data?.content || res?.data || res || [];
        const list = Array.isArray(plantData) ? plantData : [];
        setPlants(list);
        if (list.length > 0 && (!initialPlantId || !selectedPlantId)) {
          setValue('plantId', list[0].id);
        }
      } catch (err) {
        console.error('Failed to load plants', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlants();
  }, [initialPlantId]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      const scheduledDateTime = data.scheduledTime
        ? `${data.scheduledDate}T${data.scheduledTime}:00`
        : `${data.scheduledDate}T09:00:00`;

      await careTaskService.createTask({
        plantId: Number(data.plantId),
        taskType: data.taskType,
        scheduledDate: scheduledDateTime,
        priority: data.priority,
        notes: data.notes || undefined,
      });

      navigate('/tasks');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create care task');
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
          Schedule Care Task 📅
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
              You don't have any plants yet!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/plants/new')}>
              Add a Plant First
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="type-select-label">Care Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    label="Care Type"
                    value={selectedTaskType}
                    onChange={(e) => setValue('taskType', e.target.value as TaskType)}
                  >
                    <MenuItem value={TaskType.WATERING}>Watering</MenuItem>
                    <MenuItem value={TaskType.FERTILIZING}>Fertilizing</MenuItem>
                    <MenuItem value={TaskType.PRUNING}>Pruning</MenuItem>
                    <MenuItem value={TaskType.REPOTTING}>Repotting</MenuItem>
                    <MenuItem value={TaskType.MISTING}>Misting</MenuItem>
                    <MenuItem value={TaskType.OTHER}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-select-label">Priority</InputLabel>
                  <Select
                    labelId="priority-select-label"
                    label="Priority"
                    value={selectedPriority}
                    onChange={(e) => setValue('priority', e.target.value as TaskPriority)}
                  >
                    <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                    <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                    <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
                    <MenuItem value={TaskPriority.URGENT}>Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Scheduled Date"
                  InputLabelProps={{ shrink: true }}
                  {...register('scheduledDate')}
                  error={!!errors.scheduledDate}
                  helperText={errors.scheduledDate?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Scheduled Time"
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
                  rows={4}
                  label="Care Notes & Instructions"
                  placeholder="e.g. Water thoroughly until draining, check underside of leaves..."
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
                startIcon={<Save />}
                disabled={submitting}
                sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, px: 4 }}
              >
                {submitting ? 'Saving...' : id ? 'Update Task' : 'Schedule Task'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TaskFormPage;
