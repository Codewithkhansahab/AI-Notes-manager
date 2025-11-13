export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Note {
  id: number;
  title?: string;
  content: string;
  summary?: string;
  image_path?: string;
  image_description?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface CreateNoteRequest {
  title?: string;
  content: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}