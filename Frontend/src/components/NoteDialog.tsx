import React, { useState, useEffect } from 'react';
import {
  Dialog,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Close,
  Title as TitleIcon,
  Notes as NotesIcon,
  Mic,
  Check,
  AutoAwesome,
} from '@mui/icons-material';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';
import AudioRecorder from './AudioRecorder';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateNoteRequest | UpdateNoteRequest) => void;
  onAudioRecorded?: (audioBlob: Blob) => void;
  note?: Note | null;
  loading?: boolean;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  open,
  onClose,
  onSave,
  onAudioRecorded,
  note,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content,
      });
    } else {
      setFormData({
        title: '',
        content: '',
      });
    }
  }, [note, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({ title: '', content: '' });
    onClose();
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = formData.content.length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
          background: (theme: any) =>
            theme.palette.mode === 'light'
              ? '#ffffff'
              : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: (theme: any) =>
            theme.palette.mode === 'light'
              ? 'rgba(248, 250, 252, 0.8)'
              : 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {note ? (
              <NotesIcon sx={{ color: 'white', fontSize: 22 }} />
            ) : (
              <AutoAwesome sx={{ color: 'white', fontSize: 22 }} />
            )}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {note ? 'Edit Note' : 'New Note'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {note ? 'Make your changes below' : 'Capture your thoughts'}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {/* Word/Char Count */}
          {formData.content && (
            <Chip
              size="small"
              label={`${wordCount} words · ${charCount} chars`}
              sx={{
                bgcolor: (theme: any) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'rgba(129, 140, 248, 0.1)',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}

          <Tooltip title="Close (Esc)">
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                bgcolor: (theme: any) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(0,0,0,0.05)'
                    : 'rgba(255,255,255,0.05)',
                '&:hover': {
                  bgcolor: (theme: any) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(0,0,0,0.1)'
                      : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 73px)',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            px: 4,
            py: 3,
            maxHeight: 'calc(80vh - 200px)',
          }}
        >
          {/* Title Input */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TitleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TITLE
              </Typography>
            </Box>
            <TextField
              autoFocus
              name="title"
              fullWidth
              variant="standard"
              value={formData.title}
              onChange={handleChange}
              placeholder="Untitled Note"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: 'text.primary',
                  '&::placeholder': {
                    color: 'text.disabled',
                    opacity: 0.6,
                  },
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Content Input */}
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <NotesIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                CONTENT
              </Typography>
              <Chip
                size="small"
                label="Required"
                color="error"
                sx={{ height: 18, fontSize: '0.65rem' }}
              />
            </Box>
            <TextField
              name="content"
              multiline
              fullWidth
              variant="standard"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Start writing... Press Enter for new line"
              minRows={12}
              maxRows={20}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'text.primary',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  '&::placeholder': {
                    color: 'text.disabled',
                    opacity: 0.6,
                  },
                },
              }}
            />
          </Box>

          {/* Audio Recorder */}
          {onAudioRecorded && !note && (
            <Box sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Mic sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  VOICE NOTE (OPTIONAL)
                </Typography>
              </Box>
              <AudioRecorder onAudioRecorded={onAudioRecorded} />
            </Box>
          )}
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            px: 4,
            py: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            background: (theme: any) =>
              theme.palette.mode === 'light'
                ? 'rgba(248, 250, 252, 0.95)'
                : 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              💡 Tip: Use Ctrl+Enter to save quickly
            </Typography>
          </Box>

          <Box display="flex" gap={1.5}>
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'text.secondary',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.content.trim()}
              startIcon={loading ? null : <Check />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(99, 102, 241, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NoteDialog;
