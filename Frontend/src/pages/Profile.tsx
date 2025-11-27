import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { PhotoCamera, Delete, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    setLoading(true);
    setError('');
    try {
      const updatedUser = await profileAPI.uploadAvatar(file);
      updateUser(updatedUser);
      setSuccess('Avatar updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Are you sure you want to delete your avatar?')) return;

    setLoading(true);
    setError('');
    try {
      const updatedUser = await profileAPI.deleteAvatar();
      updateUser(updatedUser);
      setAvatarPreview(null);
      setSuccess('Avatar deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const updatedUser = await profileAPI.updateProfile(formData);
      updateUser(updatedUser);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
    });
    setEditing(false);
    setError('');
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar_path) return profileAPI.getAvatarUrl(user.avatar_path);
    return undefined;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Avatar Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={getAvatarUrl()}
              sx={{ width: 150, height: 150, mb: 2 }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            {loading && (
              <CircularProgress
                size={150}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              onClick={handleAvatarClick}
              disabled={loading}
              size="small"
            >
              Change Avatar
            </Button>
            {user?.avatar_path && (
              <IconButton
                color="error"
                onClick={handleDeleteAvatar}
                disabled={loading}
                size="small"
              >
                <Delete />
              </IconButton>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>

          <TextField
            fullWidth
            label="Username"
            value={user?.username || ''}
            disabled
            sx={{ mb: 2 }}
            helperText="Username cannot be changed"
          />

          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            disabled={!editing || loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!editing || loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Bio"
            name="bio"
            multiline
            rows={4}
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!editing || loading}
            placeholder="Tell us about yourself..."
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!editing ? (
            <Button
              variant="contained"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
