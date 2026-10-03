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
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocalFlorist,
  AssignmentTurnedIn,
  Favorite,
  Cloud,
  Add,
  ArrowForward,
  CheckCircle,
  WarningAmber,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { plantService } from '../../services/plantService';
import { careTaskService } from '../../services/careTaskService';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [plantsNeedingCare, setPlantsNeedingCare] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [summaryRes, tasksRes, attentionRes] = await Promise.allSettled([
        plantService.getDashboardSummary(),
        careTaskService.getUpcomingTasks(),
        plantService.getPlantsNeedingAttention(),
      ]);

      const summary =
        summaryRes.status === 'fulfilled' ? summaryRes.value?.data || summaryRes.value : null;
      const tasks =
        tasksRes.status === 'fulfilled' ? tasksRes.value?.data || tasksRes.value || [] : [];
      const attention =
        attentionRes.status === 'fulfilled'
          ? attentionRes.value?.data || attentionRes.value || []
          : [];

      setDashboardData(
        summary || {
          totalPlants: 0,
          plantsNeedingAttention: attention.length || 0,
          upcomingTasks: tasks.length || 0,
          overdueTasks: 0,
          completedTasksThisWeek: 0,
          plantsByHealthStatus: { EXCELLENT: 0, GOOD: 0, FAIR: 0, POOR: 0, CRITICAL: 0 },
        }
      );
      setUpcomingTasks(Array.isArray(tasks) ? tasks : []);
      setPlantsNeedingCare(Array.isArray(attention) ? attention : []);
    } catch (err: any) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const handleCompleteTask = async (taskId: number) => {
    try {
      await careTaskService.completeTask(taskId);
      fetchDashboard();
    } catch (err: any) {
      console.error('Failed to complete task', err);
    }
  };

  const healthChartData = [
    { name: 'Excellent', value: dashboardData?.plantsByHealthStatus?.EXCELLENT || 0, color: '#4CAF50' },
    { name: 'Good', value: dashboardData?.plantsByHealthStatus?.GOOD || 0, color: '#8BC34A' },
    { name: 'Fair', value: dashboardData?.plantsByHealthStatus?.FAIR || 0, color: '#FFC107' },
    { name: 'Poor', value: dashboardData?.plantsByHealthStatus?.POOR || 0, color: '#FF9800' },
    { name: 'Critical', value: dashboardData?.plantsByHealthStatus?.CRITICAL || 0, color: '#F44336' },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading your plant garden overview...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" variant="body2" fontWeight={600}>
                  TOTAL PLANTS
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#E8F5E9', color: '#2E7D32' }}>
                  <LocalFlorist />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#1B5E20' }}>
                {dashboardData?.totalPlants ?? 0}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/plants')}
                sx={{ mt: 1, p: 0, textTransform: 'none' }}
              >
                View all plants
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" variant="body2" fontWeight={600}>
                  NEEDS ATTENTION
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#FFF3E0', color: '#E65100' }}>
                  <WarningAmber />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#E65100' }}>
                {dashboardData?.plantsNeedingAttention ?? plantsNeedingCare.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Require watering or checkup
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" variant="body2" fontWeight={600}>
                  UPCOMING TASKS
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#E3F2FD', color: '#1565C0' }}>
                  <AssignmentTurnedIn />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#1565C0' }}>
                {dashboardData?.upcomingTasks ?? upcomingTasks.length}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/tasks')}
                sx={{ mt: 1, p: 0, textTransform: 'none' }}
              >
                View task list
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" variant="body2" fontWeight={600}>
                  COMPLETED THIS WEEK
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EDE7F6', color: '#512DA8' }}>
                  <CheckCircle />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#512DA8' }}>
                {dashboardData?.completedTasksThisWeek ?? 4}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Great job caring for your plants!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule color="primary" /> Upcoming Care Tasks
              </Typography>
              <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {upcomingTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No upcoming tasks scheduled for today.
                </Typography>
                <Button size="small" variant="text" sx={{ mt: 1 }} onClick={() => navigate('/tasks/new')}>
                  Schedule a task
                </Button>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {upcomingTasks.slice(0, 5).map((t: any, idx: number) => (
                  <Box
                    key={t.id || idx}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#F9FBE7',
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {t.plantNickname || t.plantName || `Plant #${t.plantId}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.taskType} • Due: {t.scheduledDate || 'Today'}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined" color="success" onClick={() => navigate('/tasks')}>
                      Care Now
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmber color="warning" /> Needs Attention
              </Typography>
              <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/plants')}>
                My Plants
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {plantsNeedingCare.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  All your plants are healthy and hydrated! 🌱
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {plantsNeedingCare.slice(0, 5).map((p: any, idx: number) => (
                  <Box
                    key={p.id || idx}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#FFF8E1',
                      border: '1px solid #FFE082',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {p.nickname}
                      </Typography>
                      <Typography variant="caption" color="error">
                        {p.reason || 'Watering or care overdue'}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => navigate(`/plants/${p.id}`)}
                    >
                      Check
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
