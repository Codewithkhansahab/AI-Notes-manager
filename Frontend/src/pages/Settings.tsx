import React from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Divider } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <SettingsIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Settings
          </Typography>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Appearance
            </Typography>
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
              label={`Dark Mode ${mode === 'dark' ? '(On)' : '(Off)'}`}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={<Switch disabled />}
              label="Email Notifications (Coming Soon)"
            />
            <FormControlLabel
              control={<Switch disabled />}
              label="Push Notifications (Coming Soon)"
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Privacy
            </Typography>
            <FormControlLabel
              control={<Switch disabled />}
              label="Make Notes Private by Default (Coming Soon)"
            />
            <FormControlLabel
              control={<Switch disabled />}
              label="Enable Note Encryption (Coming Soon)"
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Data
            </Typography>
            <FormControlLabel
              control={<Switch disabled />}
              label="Auto-save Notes (Coming Soon)"
            />
            <FormControlLabel
              control={<Switch disabled />}
              label="Sync with Cloud (Coming Soon)"
            />
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Settings;
