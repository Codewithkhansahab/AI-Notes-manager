import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fab,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Chip,
} from '@mui/material';
import { Add, Search, Notes as NotesIcon } from '@mui/icons-material';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteDialog from '../components/NoteDialog';

const Dashboard: React.FC = () => {
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
    // Filter notes based on search query
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        (note.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.summary?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.image_description?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    }
  }, [notes, searchQuery]);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <NotesIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Notes
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            placeholder="Search notes..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Chip 
            label={`${filteredNotes.length} note${filteredNotes.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {filteredNotes.length === 0 ? (
        <Box textAlign="center" py={8}>
          <NotesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Create your first note to get started'
            }
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <NoteCard
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onSummarize={handleSummarizeNote}
                onUploadImage={handleUploadImage}
                onAnalyzeImage={handleAnalyzeImage}
              />
            </Grid>
          ))}
        </Grid>
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
    </Container>
  );
};

export default Dashboard;