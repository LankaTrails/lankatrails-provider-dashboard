export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export type ProviderType = 'activity' | 'tour-guide' | 'transportation' | 'food-beverage' | 'accommodation';

export interface BookingSlot {
  date: string;
  start: string;
  end: string;
  duration?: string;
  bookings: number;
  details: string[];
}

export interface BaseBooking {
  id: number;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  service: string;
  serviceId: number;
  serviceType: string;
  providerType: ProviderType;
  dateFrom: string;
  dateTo: string;
  status: BookingStatus;
  amount: string;
  currency?: string;
  slots?: BookingSlot[];
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  specialRequests?: string;
}

export interface ActivityBooking extends BaseBooking {
  providerType: 'activity';
  participants: number;
  activityType: string;
  duration: string;
  safetyBriefing?: boolean;
  equipmentProvided?: boolean;
}

export interface TourGuideBooking extends BaseBooking {
  providerType: 'tour-guide';
  guideType: string;
  languages: string[];
  groupSize: number;
  destinations: string[];
  transportIncluded?: boolean;
}

export interface TransportationBooking extends BaseBooking {
  providerType: 'transportation';
  vehicleType: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance?: number;
  driverIncluded: boolean;
  passengers: number;
  luggage?: boolean;
}

export interface FoodBeverageBooking extends BaseBooking {
  providerType: 'food-beverage';
  restaurantType: string;
  partySize: number;
  tablePreference?: string;
  dietaryRestrictions?: string[];
  specialOccasion?: string;
  mealType?: string;
}

export interface AccommodationBooking extends BaseBooking {
  providerType: 'accommodation';
  accommodationType: string;
  roomType: string;
  guests: number;
  rooms: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  amenities?: string[];
  breakfastIncluded?: boolean;
}

export type UnifiedBooking = 
  | ActivityBooking 
  | TourGuideBooking 
  | TransportationBooking 
  | FoodBeverageBooking 
  | AccommodationBooking;

export interface BookingFilters {
  status?: BookingStatus[];
  providerType?: ProviderType[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageBookingValue: number;
}

export interface BookingResponse {
  bookings: UnifiedBooking[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stats: BookingStats;
}
