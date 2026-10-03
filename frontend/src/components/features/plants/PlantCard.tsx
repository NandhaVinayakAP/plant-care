import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button } from '@mui/material';
import { LocalFlorist, AssignmentTurnedIn, Favorite } from '@mui/icons-material';
import { PlantResponse } from '../../../types/plants';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface PlantCardProps {
  plant: PlantResponse;
  size?: 'small' | 'medium';
}

export const PlantCard = ({ plant, size = 'medium' }: PlantCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plants/${plant.id}`);
  };

  const getHealthColor = (status: string) => {
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

  const formatDate = (date?: string) => {
    if (!date) return 'Not recorded';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch {
      return date;
    }
  };

  return (
    <Card
      elevation={0}
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        border: '1px solid #E0E0E0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(46, 125, 50, 0.12)',
          borderColor: '#2E7D32',
        },
      }}
    >
      <Box>
        {plant.imageUrl ? (
          <CardMedia
            component="img"
            height={size === 'small' ? 120 : 160}
            image={plant.imageUrl}
            alt={plant.nickname}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: size === 'small' ? 120 : 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#E8F5E9',
            }}
          >
            <LocalFlorist sx={{ fontSize: 64, color: '#A5D6A7' }} />
          </Box>
        )}

        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>
              {plant.nickname}
            </Typography>
            <Chip
              size="small"
              label={plant.healthStatus ?? 'GOOD'}
              sx={{
                bgcolor: getHealthColor(plant.healthStatus ?? 'GOOD'),
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.65rem',
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" noWrap>
            {plant.speciesName ?? 'Unknown species'}
          </Typography>

          {size === 'medium' && (
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Favorite sx={{ fontSize: 14, color: '#90A4AE' }} />
                <Typography variant="caption" color="text.secondary">
                  Last watered: {formatDate(plant.lastWateredDate)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AssignmentTurnedIn sx={{ fontSize: 14, color: '#90A4AE' }} />
                <Typography variant="caption" color="text.secondary">
                  Last fertilized: {formatDate(plant.lastFertilizedDate)}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/plants/${plant.id}`);
          }}
          sx={{
            borderColor: '#2E7D32',
            color: '#2E7D32',
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#E8F5E9',
              borderColor: '#1B5E20',
            },
          }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default PlantCard;
