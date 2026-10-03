import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material';
import { Cloud, Add, Refresh, Thermostat, WaterDrop, WbSunny, Science } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { environmentService } from '../../services/environmentService';
import { plantService } from '../../services/plantService';
import { EnvironmentalDataResponse } from '../../types/environment';
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

export const EnvironmentHistoryPage = () => {
  const { plantId: routePlantId } = useParams<{ plantId?: string }>();
  const navigate = useNavigate();

  const [plants, setPlants] = useState<PlantResponse[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(
    routePlantId ? Number(routePlantId) : null
  );
  const [envData, setEnvData] = useState<EnvironmentalDataResponse[]>([]);
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

  const loadEnvData = async (pId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await environmentService.getEnvironmentalData(pId);
      const records = res?.data || res || [];
      setEnvData(Array.isArray(records) ? records : []);
    } catch (err: any) {
      setError('Failed to load environmental records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlantId) {
      loadEnvData(selectedPlantId);
    } else {
      setLoading(false);
    }
  }, [selectedPlantId]);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const chartData = envData
    .map((record) => {
      const dateStr = record.recordedDate || new Date().toISOString();
      return {
        date: format(new Date(dateStr), 'MMM d HH:mm'),
        temp: record.temperatureCelsius ?? record.temperatureC ?? null,
        humidity: record.humidityPercentage ?? record.humidityPercent ?? null,
        light: record.lightLevelLux ?? null,
        moisture: record.soilMoisturePercentage ?? record.soilMoisturePercent ?? null,
      };
    })
    .reverse();

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
            Environmental History 🌡️
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyze microclimate data: temperature, humidity, lighting, and soil moisture
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() =>
              navigate(
                selectedPlantId ? `/environment/log?plantId=${selectedPlantId}` : '/environment/log'
              )
            }
          >
            Record New Data
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <FormControl fullWidth size="small">
          <InputLabel id="plant-select-label">Select Plant</InputLabel>
          <Select
            labelId="plant-select-label"
            value={selectedPlantId || ''}
            label="Select Plant"
            onChange={(e) => setSelectedPlantId(Number(e.target.value))}
          >
            {plants.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                🌿 {p.nickname} ({p.speciesCommonName || 'Plant'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : envData.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #E0E0E0' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No environmental records logged yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start monitoring your plant's environment by recording temperature, light, and humidity.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              navigate(selectedPlantId ? `/environment/log?plantId=${selectedPlantId}` : '/environment/log')
            }
          >
            Log Environmental Data
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Thermostat color="warning" /> Temperature (°C) & Humidity (%)
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#FF9800" strokeWidth={2} />
                    <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#2196F3" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              📜 Measurement Log History
            </Typography>
            <Grid container spacing={2}>
              {envData.map((rec) => (
                <Grid item xs={12} sm={6} md={4} key={rec.id}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E0E0E0' }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                      📅 {rec.recordedDate ? format(new Date(rec.recordedDate), 'MMM d, yyyy HH:mm') : 'Now'}
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      <Typography variant="body2">
                        🌡️ <b>Temperature:</b> {rec.temperatureCelsius ?? rec.temperatureC ?? 'N/A'} °C
                      </Typography>
                      <Typography variant="body2">
                        💧 <b>Humidity:</b> {rec.humidityPercentage ?? rec.humidityPercent ?? 'N/A'} %
                      </Typography>
                      <Typography variant="body2">
                        ☀️ <b>Light:</b> {rec.lightLevelLux ?? 'N/A'} Lux
                      </Typography>
                      <Typography variant="body2">
                        🌱 <b>Soil Moisture:</b> {rec.soilMoisturePercentage ?? rec.soilMoisturePercent ?? 'N/A'} %
                      </Typography>
                      {rec.phLevel && (
                        <Typography variant="body2">
                          🧪 <b>pH Level:</b> {rec.phLevel}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default EnvironmentHistoryPage;
