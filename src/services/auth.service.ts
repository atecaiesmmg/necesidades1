import { LoginCredentials, AuthResponse, ValidationResult } from '../types/auth';
import { fetchApi } from '../utils/api';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static validateCredentials(credentials: LoginCredentials): ValidationResult {
    if (!credentials.email) {
      return { isValid: false, error: 'El correo electrónico es requerido' };
    }

    if (!this.isValidEmail(credentials.email)) {
      return { isValid: false, error: 'El correo electrónico no es válido' };
    }

    if (!credentials.password) {
      return { isValid: false, error: 'La contraseña es requerida' };
    }

    if (credentials.password.length < 6) {
      return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    return { isValid: true };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}