export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function getValidationError(email: string, password: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (!password) {
    return 'Password is required';
  }
  if (!validatePassword(password)) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}