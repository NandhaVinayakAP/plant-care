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
  Chip,
  CircularProgress,
  Avatar,
  Stack,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from '@mui/material';
import { CalendarToday, Add, Refresh, CheckCircle, Cancel, Person, LocalFlorist } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { specialistService } from '../../services/specialistService';
import { ConsultationResponse, ConsultationStatus } from '../../types/consultation';
import { format } from 'date-fns';

export const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<ConsultationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number | null>(5);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await specialistService.getMyConsultations();
      const list = Array.isArray(res) ? res : res?.data || [];
      setAppointments(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError('Failed to load consultation appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleOpenComplete = (id: number) => {
    setSelectedAppointmentId(id);
    setCompleteDialogOpen(true);
  };

  const handleSaveComplete = async () => {
    if (!selectedAppointmentId) return;
    try {
      await specialistService.completeConsultation(selectedAppointmentId, {
        notes,
        rating: rating || 5,
      });
      setCompleteDialogOpen(false);
      loadAppointments();
    } catch (err) {
      console.error('Complete consultation error', err);
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
            My Specialist Consultations 🩺
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your booked plant doctor appointments and advice notes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadAppointments}>
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/consultations/book')}
          >
            Book New Session
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed #C8E6C9',
            bgcolor: '#F9FAF9',
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No appointments booked yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get expert guidance on troubleshooting, lighting, or repotting from certified specialists.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/consultations/specialists')}>
            Explore Specialists
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {appointments.map((apt) => (
            <Paper
              key={apt.id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E0E0E0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: '#2E7D32', width: 48, height: 48, mt: 0.5 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B5E20' }}>
                    {apt.reasonForConsultation || 'Plant Care Checkup'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    🌿 <b>Plant:</b> {apt.plantNickname || `Plant #${apt.plantId}`} &nbsp;|&nbsp; 👨‍⚕️{' '}
                    <b>Specialist:</b> {apt.specialistUsername || `Specialist #${apt.specialistId}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    📅 <b>Scheduled Time:</b>{' '}
                    {apt.scheduledTime ? format(new Date(apt.scheduledTime), 'MMMM d, yyyy @ h:mm a') : 'Scheduled'}
                  </Typography>

                  {apt.notes && (
                    <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#F1F8E9', borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="#1B5E20" display="block">
                        Specialist Notes:
                      </Typography>
                      <Typography variant="body2">{apt.notes}</Typography>
                    </Box>
                  )}

                  {apt.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                      <Rating value={apt.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        ({apt.rating}/5 rating)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Chip
                  label={apt.status}
                  size="small"
                  sx={{
                    bgcolor: apt.status === ConsultationStatus.COMPLETED ? '#E8F5E9' : '#FFF3E0',
                    color: apt.status === ConsultationStatus.COMPLETED ? '#2E7D32' : '#E65100',
                    fontWeight: 700,
                  }}
                />
                {apt.status === ConsultationStatus.SCHEDULED && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<CheckCircle />}
                    onClick={() => handleOpenComplete(apt.id)}
                  >
                    Complete & Rate
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Consultation</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              How would you rate the specialist advice?
            </Typography>
            <Rating
              value={rating}
              onChange={(_, val) => setRating(val)}
              size="large"
            />
            <TextField
              multiline
              rows={4}
              label="Doctor Recommendations / Follow-up Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record the care plan or prescriptions provided by the specialist..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveComplete} sx={{ bgcolor: '#2E7D32' }}>
            Save & Finish
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyAppointmentsPage;
