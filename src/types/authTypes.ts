export type ApprovalStatus = 'NOT_REQUESTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: number;
  email: string;
  role: 'ROLE_PROVIDER';
  status?: string;
  profilePictureUrl?: string;
  emailVerified?: boolean;
  businessName?: string;
  businessDescription?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  location?: Location;
  accommodationApprovalStatus?: ApprovalStatus;
  tourGuideApprovalStatus?: ApprovalStatus;
  transportApprovalStatus?: ApprovalStatus;
  activityApprovalStatus?: ApprovalStatus;
  foodApprovalStatus?: ApprovalStatus;
}

export interface Location {
  formattedAddress: string;
  city: string | null;
  district: string | null;
  province: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
