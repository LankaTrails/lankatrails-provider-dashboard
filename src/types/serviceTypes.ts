export type ServiceType = 'ACTIVITY' | 'TOUR_GUIDE' | 'TRANSPORT' | 'ACCOMMODATION' | 'FOOD_BEVERAGE';

export type PriceType = 'FIXED' | 'PER_PERSON' | 'PER_KM' | 'PER_HOUR' | 'PER_DAY' | 'PER_NIGHT' | 'PER_WEEK' | 'PER_MONTH';

export type ActivityType = 'ADVENTURE' | 'CULTURAL' | 'NATURE' | 'RELAXATION' | 'SPORTS' | 'WATER_SPORTS' | 'WELLNESS' | 'EDUCATIONAL' | 'NIGHTLIFE';

export type VehicleType = 'CAR' | 'VAN' | 'BUS' | 'TRUCK' | 'MOTORCYCLE' | 'BICYCLE' | 'SCOOTER' | 'PICKUP' | 'SUV' | 'TUK_TUK';

export type AccommodationType = 'HOTEL' | 'HOSTEL' | 'GUEST_HOUSE' | 'APARTMENT' | 'VILLA' | 'HOMESTAY' | 'CAMPING' | 'RESORT' | 'LODGE';

export type FoodBeverageType = 'RESTAURANT' | 'CAFE' | 'BAR' | 'PUB' | 'FOOD_COURT' | 'FOOD_TRUCK' | 'BAKERY' | 'BREWERY' | 'WINERY' | 'DISTILLERY' | 'STREET_FOOD' | 'BUFFET';

export type TourGuideType = 'NATIONAL' | 'CHAUFFEUR' | 'SITE' | 'AREA';

export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC' | 'SEMI_AUTOMATIC';

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

export interface ImageUploadItem  extends ImageFile{
  // id: number;
  // file: File;
  // url: string;
}

export interface ImageFiles {
  serviceImages: ImageFile[];
}

export interface OptionType {
  label: string;
  value: string;
  content?: string; // used only for policies
}

export interface ServiceFormData {
  // Common fields for all service types
  serviceName: string;
  locationBased: LocationData | null;
  locationId: number | null;
  contactNo: string;
  status: boolean;
  price: number;
  priceType: PriceType;
  tabsSection: TabSection[];
  policySection: PolicySection[];
}
// Add this to your existing types
export interface ImageFile {
  id: string;  // Changed from number to string to match your component
  file?: File;  // Make optional since API images won't have File objects
  url: string;
  name?: string; // Optional name property
}
export interface AccommodationFormData extends ServiceFormData {
  accommodationType: AccommodationType;
  numberOfRooms: number;
  maxGuests: number;
  parkingAvailable: boolean;
  petFriendly: boolean;
  freeWifi: boolean;
  breakfastIncluded: boolean;
  airConditioned: boolean;
  swimmingPool: boolean;
  laundryService: boolean;
  roomService: boolean;
  gymAccess: boolean;
  spaServices: boolean;
}

export interface ActivityFormData extends ServiceFormData {
  activityType: ActivityType;
  activityDetails: string;
  safetyInstructions: string;
}

export interface FoodBeverageFormData extends ServiceFormData {
  foodAndBeverageType: FoodBeverageType;
  openHours: string;
  cuisineType: string;
  vegetarianOptions: boolean;
  halalCertified: boolean;
  alcoholServed: boolean;
  outdoorSeating: boolean;
  liveMusic: boolean;
}

export interface TourGuideFormData extends ServiceFormData {
  serviceAreas: string[];
  languages: string[];
  tourGuideType: TourGuideType;
}

export interface TransportFormData extends ServiceFormData {
  vehicleCategory: VehicleType;
  vehicleCapacity: number;
  vehicleQty: number;
  fuelType: FuelType;
  transmissionType: TransmissionType;
  airConditioned: boolean;
  driverIncluded: boolean;
}

export interface ServiceFormProps {
  serviceType?: string;
  initialData?: ServiceFormData;
  initialImages?: ImageUploadItem[]; // fixed typo and type
  onSubmit: (data: ServiceFormData, images: ImageFiles) => void;
}
// export interface AddPolicyProps {
//   serviceType: string;
//   onSuccess: () => void;
//   resetTrigger: number;
// }