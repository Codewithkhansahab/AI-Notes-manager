import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Divider,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Home,
  Mic,
  Star,
  Label,
  BarChart,
  Person,
  Settings,
  DarkMode,
  LightMode,
  ChevronLeft,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { profileAPI } from '../services/api';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  voiceNotesCount?: number;
  favoritesCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  voiceNotesCount = 0,
  favoritesCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const menuItems = [
    { text: 'All Notes', icon: <Home />, path: '/', badge: null, enabled: true },
    { text: 'Voice Notes', icon: <Mic />, path: '/voice', badge: voiceNotesCount || null, enabled: true },
    { text: 'Favorites', icon: <Star />, path: '/favorites', badge: favoritesCount || null, enabled: true },
    { text: 'Tags', icon: <Label />, path: '/tags', badge: null, enabled: true },
    { text: 'Statistics', icon: <BarChart />, path: '/stats', badge: null, enabled: true },
  ];

  const userItems = [
    { text: 'Profile', icon: <Person />, path: '/profile', enabled: true },
    { text: 'Settings', icon: <Settings />, path: '/settings', enabled: true },
  ];

  const handleNavigation = (path: string, enabled: boolean) => {
    if (enabled) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarUrl = () => {
    if (user?.avatar_path) {
      return profileAPI.getAvatarUrl(user.avatar_path);
    }
    return undefined;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 70,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 70,
          boxSizing: 'border-box',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
              : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minHeight: 64,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <Typography variant="h6" color="white" fontWeight={700}>
              N
            </Typography>
          </Box>
        </motion.div>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" fontWeight={700} noWrap>
              AI Notes
            </Typography>
          </motion.div>
        )}
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path && item.enabled}
                onClick={() => handleNavigation(item.path, item.enabled)}
                disabled={!item.enabled}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  opacity: item.enabled ? 1 : 0.5,
                  cursor: item.enabled ? 'pointer' : 'not-allowed',
                  '&.Mui-selected': {
                    background:
                      'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                    },
                  },
                  '&:hover': {
                    background: item.enabled
                      ? (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(99, 102, 241, 0.08)'
                            : 'rgba(129, 140, 248, 0.08)'
                      : 'transparent',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color:
                      location.pathname === item.path && item.enabled
                        ? 'primary.main'
                        : 'text.secondary',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="primary">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path && item.enabled ? 600 : 400,
                    }}
                    secondary={!item.enabled ? 'Coming Soon' : undefined}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      sx: { fontSize: '0.65rem' },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Divider />

      {/* User Section */}
      <Box sx={{ px: 1, py: 2 }}>
        {/* User Profile */}
        {open && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                background: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(99, 102, 241, 0.08)'
                    : 'rgba(129, 140, 248, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Avatar
                src={getAvatarUrl()}
                alt={user.username}
                sx={{ width: 36, height: 36 }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* User Menu Items */}
        <List disablePadding>
          {userItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path, item.enabled)}
                disabled={!item.enabled}
                sx={{
                  borderRadius: 2,
                  minHeight: 40,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                  opacity: item.enabled ? 1 : 0.5,
                  cursor: item.enabled ? 'pointer' : 'not-allowed',
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    secondary={!item.enabled ? 'Coming Soon' : undefined}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      sx: { fontSize: '0.65rem' },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}

          {/* Theme Toggle */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={toggleTheme}
              sx={{
                borderRadius: 2,
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </ListItemIcon>
              {open && (
                <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
              )}
            </ListItemButton>
          </ListItem>

          {/* Logout */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                minHeight: 40,
                justifyContent: open ? 'initial' : 'center',
                px: 2,
                color: 'error.main',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'error.main',
                }}
              >
                <Logout />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Collapse Button */}
      <Box sx={{ p: 1 }}>
        <IconButton
          onClick={onToggle}
          sx={{
            width: '100%',
            borderRadius: 2,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(99, 102, 241, 0.1)'
                : 'rgba(129, 140, 248, 0.1)',
            '&:hover': {
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(99, 102, 241, 0.15)'
                  : 'rgba(129, 140, 248, 0.15)',
            },
          }}
        >
          <ChevronLeft
            sx={{
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
