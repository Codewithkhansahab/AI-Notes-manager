import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  AutoAwesome,
  Schedule,
  Image as ImageIcon,
  PhotoCamera,
} from "@mui/icons-material";
import { Note } from "../types";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onSummarize: (id: number) => void;
  onUploadImage: (id: number, file: File) => void;
  onAnalyzeImage: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onSummarize,
  onUploadImage,
  onAnalyzeImage,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(note);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(note.id);
    handleMenuClose();
  };

  const handleSummarize = () => {
    onSummarize(note.id);
    handleMenuClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(note.id, file);
    }
    handleMenuClose();
  };

  const handleAnalyzeImage = () => {
    onAnalyzeImage(note.id);
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {note.title || "Untitled Note"}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {truncateText(note.content, 150)}
        </Typography>

        {note.image_path && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={`http://localhost:8000/${note.image_path}`}
              alt="Note attachment"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => {
                console.error('Image load error:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </Box>
        )}

        {note.image_description && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: (theme) => theme.palette.mode === 'light' ? 'secondary.50' : 'rgba(244, 143, 177, 0.1)', 
            borderRadius: 1,
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(244, 143, 177, 0.2)' : 'none'
          }}>
            <Box display="flex" alignItems="center" mb={1}>
              <ImageIcon
                sx={{ fontSize: 16, mr: 1, color: "secondary.main" }}
              />
              <Typography
                variant="caption"
                color="secondary.main"
                fontWeight="medium"
              >
                AI Image Analysis
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {truncateText(note.image_description, 100)}
            </Typography>
          </Box>
        )}

        {note.summary && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: (theme) => theme.palette.mode === 'light' ? 'primary.50' : 'rgba(144, 202, 249, 0.1)', 
            borderRadius: 1,
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(144, 202, 249, 0.2)' : 'none'
          }}>
            <Box display="flex" alignItems="center" mb={1}>
              <AutoAwesome
                sx={{ fontSize: 16, mr: 1, color: "primary.main" }}
              />
              <Typography
                variant="caption"
                color="primary.main"
                fontWeight="medium"
              >
                AI Summary
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {truncateText(note.summary, 100)}
            </Typography>
          </Box>
        )}

        <Box display="flex" alignItems="center" mt={2}>
          <Schedule sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {formatDate(note.updated_at)}
          </Typography>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleSummarize}>
          <AutoAwesome sx={{ mr: 1, fontSize: 20 }} />
          Summarize with AI
        </MenuItem>
        <MenuItem component="label">
          <PhotoCamera sx={{ mr: 1, fontSize: 20 }} />
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </MenuItem>
        {note.image_path && (
          <MenuItem onClick={handleAnalyzeImage}>
            <ImageIcon sx={{ mr: 1, fontSize: 20 }} />
            Analyze Image with AI
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default NoteCard;
