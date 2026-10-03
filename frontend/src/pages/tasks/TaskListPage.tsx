import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Add,
  Refresh,
  CheckCircle,
  Delete,
  WaterDrop,
  Science,
  ContentCut,
  LocalFlorist,
} from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';
import { careTaskService } from '../../services/careTaskService';
import { CareTaskResponse, TaskStatus, TaskType } from '../../types/tasks';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const TaskListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<CareTaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await careTaskService.getTasks();
      const taskData = res?.data?.content || res?.data || res || [];
      setTasks(Array.isArray(taskData) ? taskData : []);
    } catch (err: any) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleCompleteTask = async (taskId: number) => {
    try {
      await careTaskService.completeTask(taskId);
      loadTasks();
    } catch (err: any) {
      setError('Failed to complete task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Delete this care task?')) return;
    try {
      await careTaskService.deleteTask(taskId);
      loadTasks();
    } catch (err: any) {
      setError('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && t.taskType !== typeFilter) return false;
    return true;
  });

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.WATERING:
        return <WaterDrop color="info" />;
      case TaskType.FERTILIZING:
        return <Science color="warning" />;
      case TaskType.PRUNING:
        return <ContentCut color="secondary" />;
      case TaskType.MISTING:
        return <WaterDrop color="primary" />;
      default:
        return <LocalFlorist color="success" />;
    }
  };

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
            Care Schedule & Tasks 📋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep track of all watering, feeding, and pruning routines
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadTasks}>
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/tasks/new')}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status Filter</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                <MenuItem value={TaskStatus.OVERDUE}>Overdue</MenuItem>
                <MenuItem value={TaskStatus.CANCELLED}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Task Type Filter</InputLabel>
              <Select
                labelId="type-filter-label"
                value={typeFilter}
                label="Task Type Filter"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value={TaskType.WATERING}>Watering</MenuItem>
                <MenuItem value={TaskType.FERTILIZING}>Fertilizing</MenuItem>
                <MenuItem value={TaskType.PRUNING}>Pruning</MenuItem>
                <MenuItem value={TaskType.REPOTTING}>Repotting</MenuItem>
                <MenuItem value={TaskType.MISTING}>Misting</MenuItem>
                <MenuItem value={TaskType.OTHER}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredTasks.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #E0E0E0' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No care tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You're all caught up! Or add a new task to your schedule.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/tasks/new')}>
            Schedule New Task
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid #E0E0E0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTaskTypeIcon(task.taskType)}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {task.plantNickname || `Plant #${task.plantId}`}
                    </Typography>
                  </Box>
                  <Chip
                    label={task.status}
                    size="small"
                    color={
                      task.status === TaskStatus.COMPLETED
                        ? 'success'
                        : task.status === TaskStatus.OVERDUE
                        ? 'error'
                        : 'primary'
                    }
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Type: <strong>{task.taskType}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due: {task.scheduledDate ? format(new Date(task.scheduledDate), 'MMM d, yyyy') : 'No date'}
                  </Typography>
                </Box>

                {task.notes && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    "{task.notes}"
                  </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                  {task.status !== TaskStatus.COMPLETED && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      Complete
                    </Button>
                  )}
                  <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TaskListPage;
