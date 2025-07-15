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

export interface LocationData {
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
  id: number;
  imageUrl: string;
  
}

export interface ImageFiles {
  serviceImages: File[];
}

export interface ServiceFormData {
  serviceName: string;
  locationBased: LocationData;
  contactNo: string;
  status: boolean;
  activityType: string;
  activityDetails: string;
  safetyInstructions: string;
  tabsSection: TabSection[];
  policySection: PolicySection[];
  serviceAreas: string[];
  languages: string[];
}