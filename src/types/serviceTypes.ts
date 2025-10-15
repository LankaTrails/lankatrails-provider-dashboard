export type ServiceType = 'ACTIVITY' | 'TOUR_GUIDE' | 'TRANSPORT' | 'ACCOMMODATION' | 'FOOD_BEVERAGE';

export type PriceType = 'FIXED' | 'PER_PERSON' | 'PER_UNIT' | 'HYBRID' | 'PER_HOUR' | 'PER_DAY' | 'PER_NIGHT' | 'PER_KM';

export type BookingType =
  | 'TIME_SLOTS'     // Bookings are made for specific time slots
  | 'MULTI_DAY'      // Bookings can span multiple days
  | 'WHOLE_DAY'      // Bookings are for the entire day
  | 'FIXED_TIME'     // Bookings are made for a fixed duration
  | 'FLEXIBLE_HOURS' // Bookings allow customers to choose start and end times
  | 'EVENT_BASED';   // Bookings are tied to specific events

export type ServiceStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export type ActivityType = 'ADVENTURE' | 'CULTURAL' | 'NATURE' | 'RELAXATION' | 'SPORTS' | 'WATER_SPORTS' | 'WELLNESS' | 'EDUCATIONAL' | 'NIGHTLIFE';

export type VehicleType = 'CAR' | 'VAN' | 'BUS' | 'TRUCK' | 'MOTORCYCLE' | 'BICYCLE' | 'SCOOTER' | 'PICKUP' | 'SUV' | 'TUK_TUK';

export type AccommodationType = 'HOTEL' | 'HOSTEL' | 'GUEST_HOUSE' | 'APARTMENT' | 'VILLA' | 'HOMESTAY' | 'CAMPING' | 'RESORT' | 'LODGE';

export type FoodBeverageType = 'RESTAURANT' | 'CAFE' | 'BAR' | 'PUB' | 'FOOD_COURT' | 'FOOD_TRUCK' | 'BAKERY' | 'BREWERY' | 'WINERY' | 'DISTILLERY' | 'STREET_FOOD' | 'BUFFET';

export type TourGuideType = 'NATIONAL' | 'CHAUFFEUR' | 'SITE' | 'AREA';

export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC' | 'SEMI_AUTOMATIC';

export interface BreakTimeDTO {
  breakId: number | null;
  breakStart: string; // Format: "HH:mm"
  breakEnd: string;   // Format: "HH:mm"
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    details?: string;
}

export interface AvailableTimeDTO {
  availableTimeId: number | null;
  dayOfWeek: string;
  openTime: string;     // Format: "HH:mm"
  closeTime: string;    // Format: "HH:mm"
  is24Hours: boolean;
  isClosed: boolean;
  breakTimes: BreakTimeDTO[];
}

export interface BookingConfigDTO {
  bookingType: BookingType;

  // Capacity and unit management
  totalUnits?: number;
  requireChildInfo?: boolean;
  manageCapacity?: boolean;
  unitAdultCapacity?: number;
  unitChildCapacity?: number;
  minUnitsPerBooking?: number;
  maxUnitsPerBooking?: number;
  allowExtraCapacity?: boolean;
  extraAdultCapacity?: number;
  extraChildCapacity?: number;
  extraAdultCapacityLimit?: number;
  extraChildCapacityLimit?: number;

  // For time-based bookings
  slotDuration?: number; // in minutes
  bufferTime?: number;   // in minutes
  allowBackToBackBookings?: boolean;

  // For date-based bookings
  minimumBookingDays?: number;
  maximumBookingDays?: number;
  defaultCheckInTime?: string; // Format: "HH:mm"
  defaultCheckOutTime?: string; // Format: "HH:mm"

  // Common fields
  advanceBookingPeriod?: number; // in days
  lastMinuteBookingPeriod?: number; // in hours
}

export interface PriceConfigDTO {
  fixedPrice?: number;
  pricePerUnit?: number;
  pricePerAdult?: number;
  pricePerChild?: number;
  priceType: PriceType;
  extraChargePerUnit?: number;
  extraPerAdult?: number;
  extraPerChild?: number;
  extraChargeType?: PriceType;
  allowAdvancePayment?: boolean;
  advancePaymentPercentage?: number;
  advancePaymentFixedAmount?: number;
  requiresDeposit?: boolean;
  depositAmount?: number;
}

export interface TabData {
  id: number | null;
  heading: string;
  description: string;
  isExpanded: boolean;
}

export interface PolicyData {
  id: number | null;
  heading: string;
  description: string;
  isExpanded: boolean;
}

export interface LocationData {
  locationId: number | null;
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
  id: number | null;
  heading: string;
  content: string;
}

export interface PolicySection {
  id: number | null;
  heading: string;
  policy: string;
  // id:string;
}

export interface ImageData {
  id: number;
  imageUrl: string;
}

export interface ImageUploadItem extends ImageFile {
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
  locations: LocationData[];
  contactNo: string;
  status: ServiceStatus;
  tabsSection: TabSection[];
  policySection: PolicySection[];
  deletedImages?: ImageData[]; // Images to be deleted (for edit mode)
  deletedTabs?: TabSection[]; // Tabs to be deleted (for edit mode)
  deletedPolicies?: PolicySection[]; // Policies to be deleted (for edit mode)
  availableTimeDTOS: AvailableTimeDTO[];
  priceConfig?: PriceConfigDTO;
  bookingConfig?: BookingConfigDTO;
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
  cuisineType: string;
  vegetarianOptions: boolean;
  halalCertified: boolean;
  alcoholServed: boolean;
  outdoorSeating: boolean;
  liveMusic: boolean;
}

export interface TourGuideFormData extends ServiceFormData {
  languages: string[];
  tourGuideType: TourGuideType;
}

export interface TransportFormData extends ServiceFormData {
  vehicleCategory: VehicleType;
  fuelType: FuelType;
  transmissionType: TransmissionType;
  airConditioned: boolean;
  driverIncluded: boolean;
}

export interface ServiceFormProps {
  serviceType?: string;
  initialData?: ServiceFormData;
  initialImages?: ImageUploadItem[]; // fixed typo and type
  existingImages?: ImageData[]; // For edit mode - existing images from API
  onSubmit: (data: ServiceFormData, images: ImageFiles) => void;
  isEditMode?: boolean; // Indicates if this is an edit operation
  isSubmitting?: boolean; // Indicates if the form is currently being submitted
}

// Utility types for booking configuration validation
export interface TimeSlotConfig {
  slotDuration: number;
  bufferTime?: number;
  allowBackToBackBookings?: boolean;
}

export interface DateRangeConfig {
  minimumBookingDays: number;
  maximumBookingDays?: number;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
}

export interface CapacityConfig {
  totalUnits: number;
  unitAdultCapacity: number;
  unitChildCapacity?: number;
  allowExtraCapacity?: boolean;
  extraAdultCapacity?: number;
  extraChildCapacity?: number;
}

// Helper type for form validation
export type BookingConfigByType = {
  [K in BookingType]: BookingConfigDTO & (
    K extends 'TIME_SLOTS' | 'FIXED_TIME' ? { slotDuration: number } :
    K extends 'MULTI_DAY' ? { minimumBookingDays: number; defaultCheckInTime: string; defaultCheckOutTime: string } :
    {}
  );
};

// Export additional utility types
export type PriceConfigValidation = {
  [K in PriceType]: PriceConfigDTO & (
    K extends 'FIXED' ? { fixedPrice: number } :
    K extends 'PER_PERSON' ? { pricePerAdult: number } :
    K extends 'PER_UNIT' ? { pricePerUnit: number } :
    K extends 'HYBRID' ? { fixedPrice: number; pricePerAdult: number } :
    {}
  );
};

// export interface AddPolicyProps {
//   serviceType: string;
//   onSuccess: () => void;
//   resetTrigger: number;
// }