import axios from 'axios';
import { AuthResponse, User, Note, CreateNoteRequest, UpdateNoteRequest, RegisterRequest, LoginRequest } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterRequest): Promise<User> =>
    api.post('/auth/register', data).then(res => res.data),
  
  login: (data: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post('/auth/login', formData).then(res => res.data);
  },
  
  getCurrentUser: (): Promise<User> =>
    api.get('/auth/me').then(res => res.data),
};

// Notes API
export const notesAPI = {
  getNotes: (): Promise<Note[]> =>
    api.get('/notes/').then(res => res.data),
  
  getNote: (id: number): Promise<Note> =>
    api.get(`/notes/${id}`).then(res => res.data),
  
  createNote: (data: CreateNoteRequest): Promise<Note> =>
    api.post('/notes/', data).then(res => res.data),
  
  updateNote: (id: number, data: UpdateNoteRequest): Promise<Note> =>
    api.put(`/notes/${id}`, data).then(res => res.data),
  
  deleteNote: (id: number): Promise<void> =>
    api.delete(`/notes/${id}`).then(res => res.data),
  
  summarizeNote: (id: number): Promise<Note> =>
    api.post(`/notes/${id}/summarize`, {}, { timeout: 30000 }).then(res => res.data),
  
  uploadImage: (id: number, file: File): Promise<Note> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/notes/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    }).then(res => res.data);
  },
  
  analyzeImage: (id: number): Promise<Note> =>
    api.post(`/notes/${id}/analyze-image`, {}, { timeout: 30000 }).then(res => res.data),
  
  getImageUrl: (filename: string): string =>
    `${API_BASE_URL}/notes/image/${filename}`,
  
  uploadAudio: (id: number, audioBlob: Blob): Promise<Note> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    return api.post(`/notes/${id}/upload-audio`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    }).then(res => res.data);
  },
  
  transcribeAudio: (id: number): Promise<Note> =>
    api.post(`/notes/${id}/transcribe-audio`, {}, { timeout: 30000 }).then(res => res.data),
  
  getAudioUrl: (audioPath: string): string =>
    `${API_BASE_URL}/${audioPath}`,
};

// Profile API
export const profileAPI = {
  getProfile: (): Promise<User> =>
    api.get('/profile/me').then(res => res.data),
  
  updateProfile: (data: { full_name?: string; bio?: string; email?: string }): Promise<User> =>
    api.put('/profile/me', data).then(res => res.data),
  
  uploadAvatar: (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
  
  deleteAvatar: (): Promise<User> =>
    api.delete('/profile/avatar').then(res => res.data),
  
  getAvatarUrl: (avatarPath: string): string =>
    `${API_BASE_URL}/${avatarPath}`,
};