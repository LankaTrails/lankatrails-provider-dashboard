export type ServiceType = 'ACTIVITY' | 'TOUR_GUIDE' | 'TRANSPORT' | 'ACCOMMODATION' | 'FOOD_BEVERAGE';

export type PriceType = 'FIXED' | 'PER_PERSON' | 'PER_KM' | 'PER_HOUR' | 'PER_DAY' | 'PER_NIGHT' | 'PER_WEEK' | 'PER_MONTH';

export type ActivityType = 'ADVENTURE' | 'CULTURAL' | 'NATURE' | 'RELAXATION' | 'SPORTS' | 'WATER_SPORTS' | 'WELLNESS' | 'EDUCATIONAL' | 'NIGHTLIFE';

export type VehicleType = 'CAR' | 'VAN' | 'BUS' | 'TRUCK' | 'MOTORCYCLE' | 'BICYCLE' | 'SCOOTER' | 'PICKUP' | 'SUV' | 'TUK_TUK';

export type AccommodationType = 'HOTEL' | 'HOSTEL' | 'GUEST_HOUSE' | 'APARTMENT' | 'VILLA' | 'HOMESTAY' | 'CAMPING' | 'RESORT' | 'LODGE';

export type TourGuideType = 'NATIONAL' | 'CHAUFFEUR' | 'SITE' | 'AREA';

export interface TabData {
  id: number;
  heading: string;
  description: string;
  isExpanded: boolean;
}

export interface PolicyData {
  id: number;
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
  // id:string;
}

export interface ImageData {
  id: number;
  imageUrl: string;
}

export interface ImageUploadItem {
  id: number;
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
  // Common fields for all service types
  serviceName: string;
  locationBased: LocationData;
  contactNo: string;
  status: boolean;
  price : number;
  priceType: PriceType;
  tabsSection: TabSection[];
  policySection: PolicySection[];
}

export interface AccommodationFormData extends ServiceFormData {
  accommodationType: AccommodationType;
  about: string;
}

export interface ActivityFormData extends ServiceFormData {
  activityType: ActivityType;
  activityDetails: string;
  safetyInstructions: string;
}

export interface FoodBeverageFormData extends ServiceFormData {
  openHours: string;
}

export interface TourGuideFormData extends ServiceFormData {
  serviceAreas: string[];
  languages: string[];
  tourGuideType: TourGuideType;
}

export interface TransportFormData extends ServiceFormData {
  vehicleCategory: VehicleType;
  vehicleCapacity:number;
  vehicleQty:number;
}

export interface ServiceFormProps {
  serviceType?: string;
  initialData?: ServiceFormData;
  initialImages?: ImageUploadItem[]; // fixed typo and type
  onSubmit: (data: ServiceFormData, images: ImageFiles) => void;
}
