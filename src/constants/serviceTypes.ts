/**
 * Service Type Constants
 * Centralized constants for all service types in the application
 */

export const SERVICE_TYPES = {
  ACTIVITY: 'activity',
  TOUR_GUIDE: 'tour-guide',
  TRANSPORT: 'transport',
  FOOD_BEVERAGE: 'food-beverage',
  ACCOMMODATION: 'accommodation',
} as const;

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [SERVICE_TYPES.ACTIVITY]: 'Activity',
  [SERVICE_TYPES.TOUR_GUIDE]: 'Tour Guide',
  [SERVICE_TYPES.TRANSPORT]: 'Transport',
  [SERVICE_TYPES.FOOD_BEVERAGE]: 'Food & Beverage',
  [SERVICE_TYPES.ACCOMMODATION]: 'Accommodation',
};

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  [SERVICE_TYPES.ACTIVITY]: 'bg-blue-500',
  [SERVICE_TYPES.TOUR_GUIDE]: 'bg-green-500',
  [SERVICE_TYPES.TRANSPORT]: 'bg-purple-500',
  [SERVICE_TYPES.FOOD_BEVERAGE]: 'bg-orange-500',
  [SERVICE_TYPES.ACCOMMODATION]: 'bg-pink-500',
};

// Helper function to get all service types as array
export const getAllServiceTypes = (): ServiceType[] => {
  return Object.values(SERVICE_TYPES);
};

// Helper function to check if a string is a valid service type
export const isValidServiceType = (type: string): type is ServiceType => {
  return Object.values(SERVICE_TYPES).includes(type as ServiceType);
};
