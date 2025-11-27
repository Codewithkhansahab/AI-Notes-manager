import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { Label } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Tags: React.FC = () => {
  const sampleTags = [
    { name: 'Work', count: 12, color: '#6366f1' },
    { name: 'Personal', count: 8, color: '#ec4899' },
    { name: 'Ideas', count: 15, color: '#10b981' },
    { name: 'Important', count: 5, color: '#f59e0b' },
  ];

  return (
    <Box sx={{ p: 3 }}>
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Label sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Tags
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)'
                : 'rgba(30, 41, 59, 0.5)',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Label sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Organize with Tags
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Tag your notes to organize them better
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            {sampleTags.map((tag, index) => (
              <Grid item key={tag.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Chip
                    label={`${tag.name} (${tag.count})`}
                    sx={{
                      background: `${tag.color}20`,
                      color: tag.color,
                      fontWeight: 600,
                      px: 1,
                      py: 2,
                      fontSize: '0.9rem',
                    }}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Coming soon: Add tags to your notes and filter by tags
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Tags;
