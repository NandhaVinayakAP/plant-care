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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { healthService } from '../../services/healthService';
import { plantService } from '../../services/plantService';
import { HealthRecordResponse } from '../../types/health';
import { PlantResponse } from '../../types/plants';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export const HealthHistoryPage = () => {
  const { plantId: routePlantId } = useParams<{ plantId?: string }>();
  const navigate = useNavigate();

  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(
    routePlantId ? Number(routePlantId) : null
  );
  const [healthRecords, setHealthRecords] = useState<HealthRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const res = await plantService.getPlants(0, 100);
        const list = res?.data?.content || res?.data || res || [];
        const plantsArr = Array.isArray(list) ? list : [];
        setPlants(plantsArr);
        if (plantsArr.length > 0 && !selectedPlantId) {
          setSelectedPlantId(plantsArr[0].id);
        }
      } catch (err) {
        console.error('Failed to load plants', err);
      }
    };
    loadPlants();
  }, []);

  const loadHealthRecords = async (pId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await healthService.getHealthRecords(pId);
      const records = res?.data || res || [];
      setHealthRecords(Array.isArray(records) ? records : []);
    } catch (err: any) {
      setError('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlantId) {
      loadHealthRecords(selectedPlantId);
    } else {
      setLoading(false);
    }
  }, [selectedPlantId]);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const chartData = healthRecords
    .map((record) => {
      const status = record.overallHealth || record.healthStatus || 'GOOD';
      let score = 80;
      if (status === 'EXCELLENT') score = 100;
      else if (status === 'GOOD') score = 80;
      else if (status === 'FAIR') score = 60;
      else if (status === 'POOR') score = 40;
      else if (status === 'CRITICAL') score = 20;

      const dateStr = record.assessmentDate || record.recordDate || new Date().toISOString();
      return {
        date: format(new Date(dateStr), 'MMM d'),
        score,
        status,
      };
    })
    .reverse();

  const getHealthColor = (status?: string) => {
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
            Plant Health History 🩺
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review wellness trends, diagnosed issues, and treatments over time
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() =>
              navigate(selectedPlantId ? `/health/log?plantId=${selectedPlantId}` : '/health/log')
            }
          >
            New Health Log
          </Button>
        </Box>
      </Box>

          {chartData.length > 1 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📈 Health Score Trend
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2E7D32"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#2E7D32' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          )}

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Detailed Health Logs
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : healthRecords.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No health logs recorded yet for this plant.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {healthRecords.map((rec) => (
                  <Box
                    key={rec.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #E0E0E0',
                      bgcolor: '#FAFAFA',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {rec.recordDate ? format(new Date(rec.recordDate), 'MMMM d, yyyy') : 'No Date'}
                      </Typography>
                      <Chip
                        label={rec.overallHealth}
                        size="small"
                        color={
                          rec.overallHealth === 'EXCELLENT'
                            ? 'success'
                            : rec.overallHealth === 'CRITICAL'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </Box>
                    {rec.symptoms && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Symptoms:</strong> {rec.symptoms}
                      </Typography>
                    )}
                    {rec.treatmentsApplied && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Treatments:</strong> {rec.treatmentsApplied}
                      </Typography>
                    )}
                    {rec.notes && (
                      <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: 'text.secondary' }}>
                        "{rec.notes}"
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
    </Container>
  );
};

export default HealthHistoryPage;
