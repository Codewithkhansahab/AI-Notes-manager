import React, { useState, useRef } from 'react';
import { Box, Button, Typography, IconButton, Chip, Card, CardContent } from '@mui/material';
import { Mic, Stop, Upload, Replay, GraphicEq } from '@mui/icons-material';

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleUpload = () => {
    if (audioBlob) {
      onAudioRecorded(audioBlob);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        mt: 2,
        background: (theme) => 
          theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Mic sx={{ color: 'white', fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="white">
              Voice Note
            </Typography>
          </Box>
          {isRecording && (
            <Chip 
              icon={<GraphicEq sx={{ color: 'white !important' }} />}
              label="LIVE"
              size="small"
              sx={{ 
                bgcolor: 'error.main',
                color: 'white',
                fontWeight: 'bold',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.7 }
                }
              }}
            />
          )}
        </Box>

        {/* Recording State */}
        {isRecording && (
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              color="white" 
              fontWeight="bold"
              sx={{ fontFamily: 'monospace' }}
            >
              {formatTime(recordingTime)}
            </Typography>
            <Typography variant="caption" align="center" display="block" color="rgba(255,255,255,0.8)">
              Recording in progress...
            </Typography>
          </Box>
        )}

        {/* Audio Preview */}
        {audioBlob && !isRecording && (
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="white" fontWeight="medium">
                ✓ Recording Complete
              </Typography>
              <Chip 
                label={formatTime(recordingTime)}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            <audio 
              src={URL.createObjectURL(audioBlob)} 
              controls 
              style={{ 
                width: '100%',
                height: '40px',
                borderRadius: '8px',
                marginTop: '8px'
              }} 
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={1} justifyContent="center">
          {!isRecording && !audioBlob && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Mic />}
              onClick={startRecording}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s'
                }
              }}
            >
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Stop />}
              onClick={stopRecording}
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: 'error.dark',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s'
                }
              }}
            >
              Stop Recording
            </Button>
          )}

          {audioBlob && !isRecording && (
            <>
              <Button
                variant="contained"
                size="large"
                startIcon={<Upload />}
                onClick={handleUpload}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                Upload
              </Button>
              <IconButton
                onClick={() => setAudioBlob(null)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <Replay />
              </IconButton>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
