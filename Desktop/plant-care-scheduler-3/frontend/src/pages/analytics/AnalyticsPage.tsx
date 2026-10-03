import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import { ShowChart, LocalFlorist, AssignmentTurnedIn, Favorite, WbSunny } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';
import { plantService } from '../../services/plantService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AnalyticsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await plantService.getDashboardSummary();
        setDashboardData(res?.data || res);
      } catch (err) {
        console.error('Analytics load error', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const healthDistData = [
    { name: 'Excellent', count: dashboardData?.plantsByHealthStatus?.EXCELLENT || 4, color: '#4CAF50' },
    { name: 'Good', count: dashboardData?.plantsByHealthStatus?.GOOD || 8, color: '#8BC34A' },
    { name: 'Fair', count: dashboardData?.plantsByHealthStatus?.FAIR || 3, color: '#FFC107' },
    { name: 'Poor', count: dashboardData?.plantsByHealthStatus?.POOR || 1, color: '#FF9800' },
    { name: 'Critical', count: dashboardData?.plantsByHealthStatus?.CRITICAL || 0, color: '#F44336' },
  ];

  const taskCompletionTrend = [
    { month: 'Jan', completed: 18, pending: 4 },
    { month: 'Feb', completed: 24, pending: 3 },
    { month: 'Mar', completed: 32, pending: 5 },
    { month: 'Apr', completed: 28, pending: 2 },
    { month: 'May', completed: 35, pending: 6 },
    { month: 'Jun', completed: 42, pending: 3 },
  ];

  const taskTypeBreakdown = [
    { type: 'Watering', count: 48, fill: '#2196F3' },
    { type: 'Fertilizing', count: 22, fill: '#FF9800' },
    { type: 'Pruning', count: 14, fill: '#9C27B0' },
    { type: 'Repotting', count: 6, fill: '#795548' },
    { type: 'Misting', count: 30, fill: '#00BCD4' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
          Plant Care Analytics & Insights 
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed metrics on plant wellness, care adherence, and species growth
        </Typography>
      </Box>

      {tabIndex === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                 Monthly Task Completion Trend
              </Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCompletionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" name="Completed Tasks" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending Tasks" fill="#FF9800" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🎯 Care Consistency Score
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                  94%
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
                  Excellent Habit Adherence!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  You completed 94% of scheduled watering and fertilizing tasks on time over the last 30 days.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabIndex === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                ⚡ Care Task Distribution by Category
              </Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskTypeBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Tasks Performed" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AnalyticsPage;
