import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, Slider, Card, CardContent } from '@mui/material';
import { PlayArrow, Pause, Download, VolumeUp, GraphicEq } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  audioUrl: string;
  transcription?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, transcription }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value as number;
      setCurrentTime(value as number);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio.webm';
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={0}
        sx={{
          mt: 2,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)'
              : 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(129, 140, 248, 0.2)',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VolumeUp sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" fontWeight={600} color="primary">
                Voice Note
              </Typography>
            </Box>
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <GraphicEq color="primary" />
              </motion.div>
            )}
          </Box>

          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Player Controls */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.5)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <IconButton
              onClick={togglePlay}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                color: 'white',
                width: 44,
                height: 44,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Slider
                size="small"
                value={currentTime}
                max={duration || 100}
                onChange={handleSliderChange}
                sx={{
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)',
                    border: 'none',
                  },
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {formatTime(currentTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {formatTime(duration)}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleDownload}
              size="small"
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(129, 140, 248, 0.2)',
                },
              }}
            >
              <Download fontSize="small" color="primary" />
            </IconButton>
          </Box>

          {/* Transcription */}
          {transcription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                }}
              >
                <Typography
                  variant="caption"
                  color="primary"
                  fontWeight={600}
                  display="block"
                  gutterBottom
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Transcription
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                  {transcription}
                </Typography>
              </Box>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AudioPlayer;
