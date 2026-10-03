import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button } from '@mui/material';
import { CheckCircle, AssignmentTurnedIn, WaterDrop, Science, ContentCut, LocalFlorist } from '@mui/icons-material';
import { CareTaskResponse, TaskType, TaskStatus } from '../../types/tasks';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface TaskCardProps {
  task: CareTaskResponse;
  onComplete?: (id: number) => void;
  size?: 'small' | 'medium';
}

export const TaskCard = ({ task, onComplete, size = 'medium' }: TaskCardProps) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return '#F44336';
      case 'MEDIUM':
        return '#FF9800';
      case 'LOW':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Not scheduled';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch {
      return date;
    }
  };

  const getTaskIcon = (type: TaskType) => {
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
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #E0E0E0',
        p: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        '&:hover': { bgcolor: '#F9FAF9' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getTaskIcon(task.taskType)}
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {task.taskType} - {task.plantNickname || 'Plant'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={task.status}
              size="small"
              sx={{
                bgcolor: task.status === TaskStatus.COMPLETED ? '#E8F5E9' : '#FFF3E0',
                color: task.status === TaskStatus.COMPLETED ? '#2E7D32' : '#E65100',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`Priority: ${task.priority}`}
              size="small"
              sx={{
                bgcolor: `${getPriorityColor(task.priority)}20`,
                color: getPriorityColor(task.priority),
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              📅 Due: {formatDate(task.scheduledDate)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {task.status !== TaskStatus.COMPLETED && onComplete && (
        <Button
          variant="contained"
          size="small"
          color="primary"
          startIcon={<CheckCircle fontSize="small" />}
          onClick={() => onComplete(task.id)}
        >
          Done
        </Button>
      )}
    </Card>
  );
};

export default TaskCard;
