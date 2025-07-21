export interface BusinessType {
    label: string;
    value: "INDIVIDUAL" | "COMPANY" | "ORGANIZATION";
}

export interface Category {
    label: string;
    value: "ACTIVITY" | "ACCOMMODATION" | "FOOD_BEVERAGE" | "TRANSPORT" | "TOUR_GUIDE";
}

export interface LocationData {
    locationId: number;
    formattedAddress: string;
    city: string | null;
    district: string | null;
    province: string | null;
    country: string | null;
    postalCode: string | null;
    latitude: number;
    longitude: number;
}

export interface ContactPerson {
    name: string;
    email: string;
    phoneNumber: string;
    position: string;
    identityDocumentUrl?: string;
}

export interface BusinessDetails {
    providerId: number;
    businessType: string;
    businessRegistrationNumber: string;
    businessRegistrationUrl: string;
    contactPerson: ContactPerson;
}

export interface License {
    licenseNumber: string;
    expiryDate: string;
    category: string;
    licenseFile: File | null;
}

export interface LicenseData {
    licenseNumber: string;
    expiryDate: string;
    category: string;
}

export interface RegistrationFormData {
    // Basic Details
    businessName: string;
    businessDescription: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessType: string;
    businessRegistrationNumber: string;
    location: LocationData;

    // Contact Person Details
    contactPerson: ContactPerson;

    // Approval Status
    accommodationApprovalStatus: string;
    tourGuideApprovalStatus: string;
    transportApprovalStatus: string;
    activityApprovalStatus: string;
    foodApprovalStatus: string;

    // Licenses
    licenses: License[];

    // Photos and Files (not included in JSON request body)
    profilePhoto: File | null;
    coverPhoto: File | null;
    profilePreview: string | null;
    coverPreview: string | null;
    businessRegistrationFiles: File[];
    licenseFiles: File[];
    contactPersonIdentityFiles: File[];
}

export interface RegistrationRequestBody {
    email: string;
    password: string;
    businessName: string;
    businessDescription: string;
    businessType: string;
    businessRegistrationNumber: string;
    accommodationApprovalStatus: string;
    tourGuideApprovalStatus: string;
    transportApprovalStatus: string;
    activityApprovalStatus: string;
    foodApprovalStatus: string;
    location: LocationData;
    contactPerson: ContactPerson;
    licenses: LicenseData[];
}

export interface RegistrationFiles {
    profilePhoto: File | null;
    coverPhoto: File | null;
    businessRegistrationFile: File | null;
    contactPersonIdentityFile: File | null;
    licenseFiles: File[];
}

export interface StepTitles {
    [key: number]: string;
}

export interface StepIcons {
    [key: number]: React.ComponentType<{ size?: string | number }>;
}