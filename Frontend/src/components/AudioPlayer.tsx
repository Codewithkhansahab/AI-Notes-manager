import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, Slider } from '@mui/material';
import { PlayArrow, Pause, Download, VolumeUp } from '@mui/icons-material';

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
    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <VolumeUp color="primary" />
        <Typography variant="caption" fontWeight="bold" color="primary">
          Voice Note
        </Typography>
      </Box>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <Box display="flex" alignItems="center" gap={1} mt={1}>
        <IconButton onClick={togglePlay} color="primary" size="small">
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        <Slider
          size="small"
          value={currentTime}
          max={duration || 100}
          onChange={handleSliderChange}
          sx={{ flexGrow: 1 }}
        />

        <Typography variant="caption" sx={{ minWidth: 45 }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>

        <IconButton onClick={handleDownload} size="small">
          <Download fontSize="small" />
        </IconButton>
      </Box>

      {transcription && (
        <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Transcription:
          </Typography>
          <Typography variant="body2">
            {transcription}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AudioPlayer;
