import React, { useState, useRef } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import { Mic, Stop, Upload } from '@mui/icons-material';

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
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // When recording stops
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
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
    <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        🎤 Voice Note
      </Typography>

      {isRecording && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="error" gutterBottom>
            Recording... {formatTime(recordingTime)}
          </Typography>
          <LinearProgress color="error" />
        </Box>
      )}

      {audioBlob && !isRecording && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="success.main" gutterBottom>
            ✓ Recording complete ({formatTime(recordingTime)})
          </Typography>
          <audio src={URL.createObjectURL(audioBlob)} controls style={{ width: '100%' }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        {!isRecording && !audioBlob && (
          <Button
            variant="contained"
            startIcon={<Mic />}
            onClick={startRecording}
            size="small"
          >
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Stop />}
            onClick={stopRecording}
            size="small"
          >
            Stop Recording
          </Button>
        )}

        {audioBlob && !isRecording && (
          <>
            <Button
              variant="contained"
              color="success"
              startIcon={<Upload />}
              onClick={handleUpload}
              size="small"
            >
              Upload Audio
            </Button>
            <Button
              variant="outlined"
              onClick={() => setAudioBlob(null)}
              size="small"
            >
              Re-record
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AudioRecorder;
