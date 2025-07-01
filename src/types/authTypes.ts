export interface User {
  id: number;
  email: string;
  role: 'ROLE_PROVIDER';
  businessName?: string;
  businessDescription?: string;
  logoUrl?: string;
  profilePictureUrl?: string;
  status?: string;
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
