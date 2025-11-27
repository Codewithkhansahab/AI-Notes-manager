import React from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Favorites: React.FC = () => {
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
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Star sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Favorites
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)'
                : 'rgba(30, 41, 59, 0.5)',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Star sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Favorite Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Star your important notes to see them here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Coming soon: Click the star icon on any note to add it to favorites
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Favorites;
