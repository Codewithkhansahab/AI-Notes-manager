import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateNoteRequest | UpdateNoteRequest) => void;
  note?: Note | null;
  loading?: boolean;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  open,
  onClose,
  onSave,
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

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '60vh',
          backgroundColor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {note ? 'Edit Note' : 'Create New Note'}
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Content"
            multiline
            rows={12}
            fullWidth
            variant="outlined"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Start writing your note..."
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.content.trim()}
          >
            {loading ? 'Saving...' : (note ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default NoteDialog;