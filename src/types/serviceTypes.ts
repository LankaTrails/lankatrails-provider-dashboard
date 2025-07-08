export interface TabData {
    id: string;
    heading: string;
    description: string;
    isExpanded: boolean;
}

export interface PolicyData {
    id: string;
    heading: string;
    description: string;
    isExpanded: boolean;
}

export interface LocationBased {
  formattedAddress: string;
  city: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface TabSection {
  heading: string;
  content: string;
}

export interface PolicySection {
  heading: string;
  policy: string;
}

export interface ImageData {
  imageUrl: string;
}

export interface ServiceFormData {
  serviceName: string;
  locationBased: LocationBased;
  contactNo: string;
  status: boolean;
  activityType: string;
  activityDetails: string;
  safetyInstructions: string;
  tabsSection: TabSection[];
  policySection: PolicySection[];
  images: ImageData[];
}