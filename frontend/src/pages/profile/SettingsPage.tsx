import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Slider,
} from '@mui/material';
import { Save, Notifications, Shield, Palette } from '@mui/icons-material';

export const SettingsPage = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [wateringReminders, setWateringReminders] = useState(true);
  const [reminderLeadHours, setReminderLeadHours] = useState<number>(24);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20' }}>
          Preferences & Settings ⚙️
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure notifications, reminder frequencies, and account preferences
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings successfully saved!
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E0E0E0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield color="primary" /> Community & Privacy
        </Typography>
        <FormControl sx={{ mb: 3 }}>
          <FormLabel id="privacy-radio-label">Profile and Garden Visibility</FormLabel>
          <RadioGroup
            aria-labelledby="privacy-radio-label"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as any)}
          >
            <FormControlLabel value="public" control={<Radio />} label="Public (Anyone in community can view your plant showcase)" />
            <FormControlLabel value="friends" control={<Radio />} label="Friends & Specialists Only" />
            <FormControlLabel value="private" control={<Radio />} label="Private (Only visible to you)" />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications color="primary" /> Notifications & Reminders
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <FormControlLabel
            control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />}
            label="Email Alerts for Urgent Tasks"
          />
          <FormControlLabel
            control={<Switch checked={wateringReminders} onChange={(e) => setWateringReminders(e.target.checked)} />}
            label="Daily Care & Watering Reminders"
          />
          <Box sx={{ mt: 1, px: 1 }}>
            <Typography variant="body2" gutterBottom>
              Reminder Lead Time: {reminderLeadHours} hour(s) before task
            </Typography>
            <Slider
              value={reminderLeadHours}
              onChange={(_, val) => setReminderLeadHours(val as number)}
              min={1}
              max={72}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1h' },
                { value: 24, label: '24h' },
                { value: 48, label: '48h' },
                { value: 72, label: '72h' },
              ]}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Palette color="primary" /> Appearance
        </Typography>
        <FormControl sx={{ mb: 4 }}>
          <RadioGroup
            row
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as any)}
          >
            <FormControlLabel value="light" control={<Radio />} label="Light Theme" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark Theme" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, px: 4, py: 1.2, borderRadius: 2 }}
          >
            Save Preferences
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
