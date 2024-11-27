export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'director' | 'profesor';
    avatar?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}