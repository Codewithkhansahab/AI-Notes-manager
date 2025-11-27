import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { BarChart, TrendingUp, Notes, Mic, AutoAwesome, Image as ImageIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { notesAPI } from '../services/api';
import { Note } from '../types';

const Statistics: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await notesAPI.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalNotes = notes.length;
  const voiceNotes = notes.filter(note => note.audio_path).length;
  const notesWithImages = notes.filter(note => note.image_path).length;
  const summarizedNotes = notes.filter(note => note.summary).length;
  
  // Calculate notes from this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekNotes = notes.filter(note => {
    const noteDate = new Date(note.created_at);
    return noteDate >= oneWeekAgo;
  }).length;

  // Calculate average note length
  const avgLength = notes.length > 0
    ? Math.round(notes.reduce((sum, note) => sum + note.content.length, 0) / notes.length)
    : 0;

  const stats = [
    { label: 'Total Notes', value: totalNotes, icon: <Notes />, color: '#6366f1' },
    { label: 'Voice Notes', value: voiceNotes, icon: <Mic />, color: '#ec4899' },
    { label: 'With Images', value: notesWithImages, icon: <ImageIcon />, color: '#f59e0b' },
    { label: 'AI Summaries', value: summarizedNotes, icon: <AutoAwesome />, color: '#10b981' },
    { label: 'This Week', value: thisWeekNotes, icon: <TrendingUp />, color: '#8b5cf6' },
    { label: 'Avg Length', value: avgLength, icon: <BarChart />, color: '#06b6d4', suffix: ' chars' },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <BarChart sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Statistics
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 16px ${stat.color}30`,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h3" fontWeight={700} sx={{ color: stat.color }}>
                          {stat.value}{stat.suffix || ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {stat.label}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          background: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Additional Insights */}
        {totalNotes > 0 && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      📊 Quick Insights
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          Voice Notes Percentage
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalNotes > 0 ? Math.round((voiceNotes / totalNotes) * 100) : 0}%
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          Notes with AI Summaries
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalNotes > 0 ? Math.round((summarizedNotes / totalNotes) * 100) : 0}%
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          Notes with Images
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalNotes > 0 ? Math.round((notesWithImages / totalNotes) * 100) : 0}%
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Activity This Week
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {totalNotes > 0 ? Math.round((thisWeekNotes / totalNotes) * 100) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      🎯 Your Activity
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          Most Recent Note
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {notes.length > 0
                            ? new Date(notes[0].created_at).toLocaleDateString()
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          Total Characters
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {notes.reduce((sum, note) => sum + note.content.length, 0).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body2" color="text.secondary">
                          Total Words (approx)
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {Math.round(
                            notes.reduce((sum, note) => sum + note.content.split(/\s+/).length, 0)
                          ).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Longest Note
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {notes.length > 0
                            ? Math.max(...notes.map(n => n.content.length)).toLocaleString()
                            : 0}{' '}
                          chars
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        {totalNotes === 0 ? (
          <Box
            sx={{
              mt: 4,
              textAlign: 'center',
              py: 8,
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
              borderRadius: 3,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <BarChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No Notes Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your first note to see statistics and insights
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 4,
              textAlign: 'center',
              py: 6,
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
              borderRadius: 3,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <BarChart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              More Analytics Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activity charts, word clouds, time-based analytics, and more insights
            </Typography>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default Statistics;
