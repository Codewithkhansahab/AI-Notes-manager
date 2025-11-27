import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Mic } from '@mui/icons-material';
import Dashboard from './Dashboard';

const VoiceNotes: React.FC = () => {
  return <Dashboard filterType="voice" />;
};

export default VoiceNotes;
