export interface AuthCredentials {
  email: string;
  password: string;
  displayName?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user?: { userId: string; email: string; displayName: string; isAdmin?: boolean } | null;
  error?: string;
}
