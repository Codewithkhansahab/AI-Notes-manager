import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fab,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  TextField,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Search, Notes as NotesIcon, Mic, Star, TrendingUp } from '@mui/icons-material';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteDialog from '../components/NoteDialog';

interface DashboardProps {
  filterType?: 'all' | 'voice' | 'favorites';
}

const Dashboard: React.FC<DashboardProps> = ({ filterType = 'all' }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    // Filter notes based on search query and filter type
    let filtered = notes;

    // Apply filter type
    if (filterType === 'voice') {
      filtered = filtered.filter(note => note.audio_path);
    } else if (filterType === 'favorites') {
      // For now, show all notes. Later add favorite field
      filtered = filtered;
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(note =>
        (note.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.summary?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.image_description?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, filterType]);

  const fetchNotes = async () => {
    try {
      const data = await notesAPI.getNotes();
      setNotes(data);
    } catch (error) {
      showSnackbar('Failed to fetch notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleSaveNote = async (data: CreateNoteRequest | UpdateNoteRequest) => {
    setDialogLoading(true);
    try {
      if (editingNote) {
        const updatedNote = await notesAPI.updateNote(editingNote.id, data);
        setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
        showSnackbar('Note updated successfully', 'success');
      } else {
        const newNote = await notesAPI.createNote(data);
        setNotes([newNote, ...notes]);
        showSnackbar('Note created successfully', 'success');
      }
      setDialogOpen(false);
    } catch (error) {
      showSnackbar('Failed to save note', 'error');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(id);
        setNotes(notes.filter(note => note.id !== id));
        showSnackbar('Note deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete note', 'error');
      }
    }
  };

  const handleSummarizeNote = async (id: number) => {
    try {
      showSnackbar('AI is generating summary...', 'info');
      const updatedNote = await notesAPI.summarizeNote(id);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      showSnackbar('Summary generated successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to generate summary', 'error');
    }
  };

  const handleUploadImage = async (id: number, file: File) => {
    try {
      showSnackbar('Uploading image...', 'info');
      const updatedNote = await notesAPI.uploadImage(id, file);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      showSnackbar('Image uploaded successfully! AI analysis in progress...', 'success');
    } catch (error) {
      showSnackbar('Failed to upload image', 'error');
    }
  };

  const handleAnalyzeImage = async (id: number) => {
    try {
      showSnackbar('AI is analyzing image...', 'info');
      const updatedNote = await notesAPI.analyzeImage(id);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      showSnackbar('Image analysis completed successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to analyze image', 'error');
    }
  };

  const handleAudioRecorded = async (audioBlob: Blob) => {
    // This will be called from NoteDialog after note is created
    // For now, we'll handle it in the dialog save flow
  };

  const handleUploadAudio = async (id: number, audioBlob: Blob) => {
    try {
      showSnackbar('Uploading audio...', 'info');
      const updatedNote = await notesAPI.uploadAudio(id, audioBlob);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      showSnackbar('Audio uploaded successfully!', 'success');
    } catch (error) {
      showSnackbar('Failed to upload audio', 'error');
    }
  };

  const handleTranscribeAudio = async (id: number) => {
    try {
      showSnackbar('Transcribing audio...', 'info');
      const updatedNote = await notesAPI.transcribeAudio(id);
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
      showSnackbar('Audio transcribed successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to transcribe audio', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const voiceNotesCount = notes.filter(note => note.audio_path).length;
  const summarizedCount = notes.filter(note => note.summary).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <NotesIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              My Notes
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box display="flex" gap={2} mb={3} sx={{ overflowX: 'auto', pb: 1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ flex: 1, minWidth: 200 }}
            >
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                  color: 'white',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700}>
                        {notes.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Notes
                      </Typography>
                    </Box>
                    <NotesIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{ flex: 1, minWidth: 200 }}
            >
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                  color: 'white',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700}>
                        {voiceNotesCount}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Voice Notes
                      </Typography>
                    </Box>
                    <Mic sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              style={{ flex: 1, minWidth: 200 }}
            >
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight={700}>
                        {summarizedCount}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        AI Summaries
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 48, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Search Bar */}
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <TextField
              placeholder="Search notes..."
              variant="outlined"
              size="medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
                maxWidth: 500,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light' ? 'white' : 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Chip
              label={`${filteredNotes.length} note${filteredNotes.length !== 1 ? 's' : ''}`}
              color="primary"
              sx={{
                fontWeight: 600,
                px: 1,
              }}
            />
          </Box>
        </Box>
      </motion.div>

      {filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" py={8}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3,
              }}
            >
              <NotesIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started with your AI-powered note-taking journey'}
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <NoteCard
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onSummarize={handleSummarizeNote}
                onUploadImage={handleUploadImage}
                onAnalyzeImage={handleAnalyzeImage}
                onUploadAudio={handleUploadAudio}
                onTranscribeAudio={handleTranscribeAudio}
              />
            </motion.div>
          ))}
        </Masonry>
      )}

      <Fab
        color="primary"
        aria-label="add note"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={handleCreateNote}
      >
        <Add />
      </Fab>

      <NoteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveNote}
        onAudioRecorded={handleAudioRecorded}
        note={editingNote}
        loading={dialogLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;