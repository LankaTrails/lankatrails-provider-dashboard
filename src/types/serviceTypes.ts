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

export interface ImageUploadItem {
  id: string;
  file: File;
  url: string;
}

export interface ImageFiles {
  serviceImages: ImageUploadItem[];
}

export interface OptionType {
  label: string;
  value: string;
  content?: string; // used only for policies
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
  pricePerKm : number;
  vehicleCapacity:number;
  vehicleQty:number;
  vehicleCategory:string;
  about:string;
  openHours:string;
}

export interface ServiceFormProps {
  serviceType?: string;
  initialData?: ServiceFormData;
  initialImages?: ImageUploadItem[]; // fixed typo and type
  onSubmit: (data: ServiceFormData, images: ImageFiles) => void;
}
