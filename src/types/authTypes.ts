import type { BusinessType } from "./registration";
import type { ServiceType } from "./serviceTypes";

export type ApprovalStatus = 'NOT_REQUESTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RENEWAL';

export interface ContactPerson {
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  identityDocumentUrl: string;
}

export interface BusinessDetails {
  providerId: number;
  businessType: BusinessType;
  businessRegistrationNumber: string;
  businessRegistrationUrl: string;
  contactPerson: ContactPerson;
}

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
  location?: LocationData;
  accommodationApprovalStatus?: ApprovalStatus;
  tourGuideApprovalStatus?: ApprovalStatus;
  transportApprovalStatus?: ApprovalStatus;
  activityApprovalStatus?: ApprovalStatus;
  foodApprovalStatus?: ApprovalStatus;
}

export interface LocationData {
  locationId: number;
  formattedAddress: string;
  city: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LicenseDTO {
    licenseId: number;
    licenseNumber: string;
    expiryDate: string;
    category: string;
    licenseUrl: string;
}

export interface licenseResponse {
  serviceCategory: ServiceType;
  approvalStatus: ApprovalStatus;
  licenses: LicenseDTO[];
}
