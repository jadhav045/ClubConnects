import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

export const AttendanceCodeDialog = ({
  open,
  onClose,
  onSubmit,
  isOrganizer,
  isLoading
}) => {
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }
    onSubmit(isOrganizer ? { code, duration } : code);
    setCode('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isOrganizer ? 'Open Attendance' : 'Mark Attendance'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Attendance Code"
          type="text"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={!!error}
          helperText={error}
        />
        {isOrganizer && (
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isOrganizer ? 'Open Attendance' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
