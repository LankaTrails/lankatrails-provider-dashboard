import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Star,
  Users,
  Calendar,
  Car,
  Wifi,
  Car as Parking,
  Heart,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  DollarSign,
  Clock,
  Settings,
  Info,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  Package,
} from "lucide-react";
import type {
  ServiceFormData,
  ImageData,
  PriceType,
  PriceConfigDTO,
  BookingConfigDTO,
  AvailableTimeDTO,
  LocationData,
} from "@/types/serviceTypes";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";

// Extended interface for API response data (includes additional fields not in form types)
interface ServiceApiResponse extends ServiceFormData {
  // Additional fields from API response
  id?: number;
  price?: number;
  priceType?: PriceType;
  description?: string;
  images?: ImageData[];
  serviceCategory?: string;
  tabs?: Array<{ title: string; content: string }>;
  tabsData?: Array<{ tabTitle: string; tabContent: string }>;
  policies?: Array<{ policyType: string; description: string }>;
  policiesData?: Array<{ type: string; content: string }>;
  maxParticipants?: number;
  duration?: string | number;

  // Transportation specific
  vehicleType?: string;
  vehicleCategory?: string;
  fuelType?: string;
  transmissionType?: string;
  capacity?: number;
  driverIncluded?: boolean;
  hasAirConditioning?: boolean;
  seatingCapacity?: number;

  // Accommodation specific
  accommodationType?: string;
  propertyType?: string;
  roomType?: string;
  checkInTime?: string;
  checkOutTime?: string;
  numberOfRooms?: number;
  maxGuests?: number;
  parkingAvailable?: boolean;
  petFriendly?: boolean;
  freeWifi?: boolean;
  breakfastIncluded?: boolean;
  airConditioned?: boolean;
  swimmingPool?: boolean;
  laundryService?: boolean;
  roomService?: boolean;
  gymAccess?: boolean;
  spaServices?: boolean;

  // Activity specific
  activityType?: string;
  activityDetails?: string;
  safetyInstructions?: string;
  difficultyLevel?: string;
  minimumAge?: number;
  ageRestriction?: string;

  // Food & Beverage specific
  cuisineType?: string;
  dietaryOptions?: string | string[];
  serviceStyle?: string;
  foodAndBeverageType?: string;
  vegetarianOptions?: boolean;
  halalCertified?: boolean;
  alcoholServed?: boolean;
  outdoorSeating?: boolean;
  liveMusic?: boolean;
  serviceType?: string;
  openingHours?: string;

  // Guide specific
  specialization?: string;
  specializations?: string[];
  experienceLevel?: string;
  experienceYears?: number;
  languages?: string[];
  tourGuideType?: string;
}

interface ServiceDetailsProps {
  serviceData: ServiceApiResponse;
  serviceType?: string;
}

// Helper to format service type for display
const formatServiceTitle = (type?: string): string => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

// Helper to format price
const formatPrice = (price?: number, priceType?: PriceType): string => {
  if (price === undefined || price === null) {
    return "Price not specified";
  }

  const formattedPrice = `LKR ${price.toLocaleString()}`;
  if (priceType) {
    const typeMap: { [key in PriceType]: string } = {
      FIXED: "fixed price",
      PER_PERSON: "per person",
      PER_UNIT: "per unit",
      HYBRID: "hybrid pricing",
      PER_HOUR: "per hour",
      PER_DAY: "per day",
      PER_NIGHT: "per night",
      PER_KM: "per kilometer",
    };
    return `${formattedPrice} ${typeMap[priceType] || priceType.toLowerCase()}`;
  }
  return formattedPrice;
};

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceData,
  serviceType,
}) => {
  const [isTabsOpen, setIsTabsOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  if (!serviceData) {
    return <div>No service data available</div>;
  }

  const renderBasicAndServiceInfo = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <Package className="w-5 h-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold">Service Information</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Basic Details
            </h3>
            <div className="space-y-3">
              {serviceData.serviceName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {serviceData.serviceName}
                  </p>
                </div>
              )}

              {serviceData.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {serviceData.description}
                  </p>
                </div>
              )}

              {serviceData.serviceCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {serviceData.serviceCategory}
                  </span>
                </div>
              )}

              {serviceData.maxParticipants && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Participants
                  </label>
                  <p className="text-gray-900">{serviceData.maxParticipants}</p>
                </div>
              )}

              {serviceData.duration && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <p className="text-gray-900">
                    {typeof serviceData.duration === "number"
                      ? `${serviceData.duration} minutes`
                      : serviceData.duration}
                  </p>
                </div>
              )}

              {serviceData.contactNo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{serviceData.contactNo}</p>
                  </div>
                </div>
              )}

              {serviceData.status && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      serviceData.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : serviceData.status === "INACTIVE"
                        ? "bg-red-100 text-red-800"
                        : serviceData.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {serviceData.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service-Specific Information */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Service-Specific Details
            </h3>
            <div className="space-y-3">
              {/* Use serviceType prop or serviceCategory to determine service type */}
              {(serviceType === "transportation" ||
                serviceData.serviceCategory === "TRANSPORTATION") && (
                <>
                  {(serviceData.vehicleType || serviceData.vehicleCategory) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Type
                      </label>
                      <p className="text-gray-900">
                        {serviceData.vehicleType || serviceData.vehicleCategory}
                      </p>
                    </div>
                  )}
                  {serviceData.fuelType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fuel Type
                      </label>
                      <p className="text-gray-900">{serviceData.fuelType}</p>
                    </div>
                  )}
                  {(serviceData.capacity || serviceData.seatingCapacity) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <p className="text-gray-900">
                        {serviceData.capacity || serviceData.seatingCapacity}
                      </p>
                    </div>
                  )}
                  {serviceData.transmissionType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transmission
                      </label>
                      <p className="text-gray-900">
                        {serviceData.transmissionType}
                      </p>
                    </div>
                  )}
                  {serviceData.driverIncluded !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver Included
                      </label>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          serviceData.driverIncluded
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {serviceData.driverIncluded ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                </>
              )}

              {serviceData.serviceCategory === "ACCOMMODATION" && (
                <>
                  {serviceData.propertyType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <p className="text-gray-900">
                        {serviceData.propertyType}
                      </p>
                    </div>
                  )}
                  {serviceData.roomType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                      </label>
                      <p className="text-gray-900">{serviceData.roomType}</p>
                    </div>
                  )}
                  {serviceData.checkInTime && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Time
                      </label>
                      <p className="text-gray-900">{serviceData.checkInTime}</p>
                    </div>
                  )}
                  {serviceData.checkOutTime && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Time
                      </label>
                      <p className="text-gray-900">
                        {serviceData.checkOutTime}
                      </p>
                    </div>
                  )}
                </>
              )}

              {serviceData.serviceCategory === "ACTIVITY" && (
                <>
                  {serviceData.activityType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Type
                      </label>
                      <p className="text-gray-900">
                        {serviceData.activityType}
                      </p>
                    </div>
                  )}
                  {serviceData.difficultyLevel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty Level
                      </label>
                      <p className="text-gray-900">
                        {serviceData.difficultyLevel}
                      </p>
                    </div>
                  )}
                  {serviceData.minimumAge && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Age
                      </label>
                      <p className="text-gray-900">{serviceData.minimumAge}</p>
                    </div>
                  )}
                </>
              )}

              {serviceData.serviceCategory === "FOOD_BEVERAGE" && (
                <>
                  {serviceData.cuisineType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cuisine Type
                      </label>
                      <p className="text-gray-900">{serviceData.cuisineType}</p>
                    </div>
                  )}
                  {serviceData.dietaryOptions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dietary Options
                      </label>
                      <p className="text-gray-900">
                        {Array.isArray(serviceData.dietaryOptions)
                          ? serviceData.dietaryOptions.join(", ")
                          : serviceData.dietaryOptions}
                      </p>
                    </div>
                  )}
                  {serviceData.serviceStyle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Style
                      </label>
                      <p className="text-gray-900">
                        {serviceData.serviceStyle}
                      </p>
                    </div>
                  )}
                </>
              )}

              {serviceData.serviceCategory === "GUIDE" && (
                <>
                  {serviceData.specialization && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>
                      <p className="text-gray-900">
                        {serviceData.specialization}
                      </p>
                    </div>
                  )}
                  {serviceData.experienceLevel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <p className="text-gray-900">
                        {serviceData.experienceLevel}
                      </p>
                    </div>
                  )}
                  {serviceData.languages &&
                    serviceData.languages.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Languages
                        </label>
                        <p className="text-gray-900">
                          {serviceData.languages.join(", ")}
                        </p>
                      </div>
                    )}
                </>
              )}

              {/* Show message if no service-specific details are available */}
              {(!serviceData.serviceCategory ||
                (serviceData.serviceCategory === "TRANSPORTATION" &&
                  !serviceData.vehicleType &&
                  !serviceData.fuelType &&
                  !serviceData.capacity) ||
                (serviceData.serviceCategory === "ACCOMMODATION" &&
                  !serviceData.propertyType &&
                  !serviceData.roomType &&
                  !serviceData.checkInTime &&
                  !serviceData.checkOutTime) ||
                (serviceData.serviceCategory === "ACTIVITY" &&
                  !serviceData.activityType &&
                  !serviceData.difficultyLevel &&
                  !serviceData.minimumAge) ||
                (serviceData.serviceCategory === "FOOD_BEVERAGE" &&
                  !serviceData.cuisineType &&
                  !serviceData.dietaryOptions &&
                  !serviceData.serviceStyle) ||
                (serviceData.serviceCategory === "GUIDE" &&
                  !serviceData.specialization &&
                  !serviceData.experienceLevel &&
                  (!serviceData.languages ||
                    serviceData.languages.length === 0))) && (
                <div className="text-gray-500 italic text-sm">
                  No service-specific details available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCollapsibleTabsAndPolicies = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <button
            onClick={() => setIsTabsOpen(!isTabsOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              <h2 className="text-xl font-semibold">Tabs & Additional Info</h2>
            </div>
            {isTabsOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {isTabsOpen && (
            <div className="px-6 pb-6 border-t">
              {(serviceData.tabs && serviceData.tabs.length > 0) ||
              (serviceData.tabsData && serviceData.tabsData.length > 0) ? (
                <div className="space-y-4 mt-4">
                  {(serviceData.tabs || serviceData.tabsData || []).map(
                    (tab: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <h3 className="font-medium text-lg mb-2">
                          {tab.title || tab.tabTitle || `Tab ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {tab.content ||
                            tab.tabContent ||
                            tab.description ||
                            "No content available"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">
                    No additional tabs configured
                  </p>
                  <p className="text-gray-400 text-sm">
                    Additional information tabs will appear here when added
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Policies Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <button
            onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              <h2 className="text-xl font-semibold">Policies</h2>
            </div>
            {isPoliciesOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {isPoliciesOpen && (
            <div className="px-6 pb-6 border-t">
              {(serviceData.policies && serviceData.policies.length > 0) ||
              (serviceData.policiesData &&
                serviceData.policiesData.length > 0) ? (
                <div className="space-y-4 mt-4">
                  {(serviceData.policies || serviceData.policiesData || []).map(
                    (policy: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <h3 className="font-medium text-lg mb-2">
                          {policy.policyType ||
                            policy.type ||
                            `Policy ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {policy.description ||
                            policy.content ||
                            "No policy details available"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">
                    No policies configured
                  </p>
                  <p className="text-gray-400 text-sm">
                    Service policies and terms will appear here when added
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name
          </label>
          <p className="text-gray-900 font-medium">
            {serviceData.serviceName || "N/A"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            <p className="text-gray-900">{serviceData.contactNo || "N/A"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <p className="text-gray-900">{formatServiceTitle(serviceType)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              serviceData.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : serviceData.status === "INACTIVE"
                ? "bg-red-100 text-red-800"
                : serviceData.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {serviceData.status || "Unknown"}
          </span>
        </div>

        {(serviceData.price || serviceData.priceConfig) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <p className="text-green-600 font-semibold text-lg">
              {serviceData.price
                ? formatPrice(serviceData.price, serviceData.priceType)
                : serviceData.priceConfig?.fixedPrice
                ? `LKR ${serviceData.priceConfig.fixedPrice.toLocaleString()}`
                : "Contact for pricing"}
            </p>
          </div>
        )}

        {serviceData.id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service ID
            </label>
            <p className="text-gray-600 text-sm font-mono">#{serviceData.id}</p>
          </div>
        )}
      </div>

      {serviceData.description && (
        <div className="mt-6 pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {serviceData.description}
          </p>
        </div>
      )}
    </div>
  );

  const renderImages = () => {
    if (!serviceData.images || serviceData.images.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No images available</p>
              <p className="text-sm">
                Images will be displayed here when uploaded
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">
          Images ({serviceData.images.length})
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
            {serviceData.images.map((image: ImageData, index: number) => (
              <div
                key={image.id || index}
                className="relative w-64 h-48 rounded-lg overflow-hidden group border hover:shadow-md transition-shadow flex-shrink-0"
              >
                <img
                  src={image.imageUrl}
                  alt={`Service image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmOWZhMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KICA8L3N2Zz4K";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Image {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLocations = () => {
    if (!serviceData.locations || serviceData.locations.length === 0)
      return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Locations</h2>
        <div className="space-y-6">
          {serviceData.locations.map((location, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location Details */}
                <div>
                  <div className="flex items-start mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-lg mb-2">
                        {location.formattedAddress || "Address not specified"}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <strong>City:</strong> {location.city || "N/A"}
                        </div>
                        <div>
                          <strong>District:</strong>{" "}
                          {location.district || "N/A"}
                        </div>
                        <div>
                          <strong>Province:</strong>{" "}
                          {location.province || "N/A"}
                        </div>
                        <div>
                          <strong>Country:</strong> {location.country || "N/A"}
                        </div>
                        {location.postalCode && (
                          <div>
                            <strong>Postal Code:</strong> {location.postalCode}
                          </div>
                        )}
                      </div>
                      {location.latitude && location.longitude && (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Coordinates:</strong> {location.latitude},{" "}
                          {location.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map Display */}
                <div className="h-64 rounded-lg overflow-hidden">
                  {location.latitude && location.longitude ? (
                    <MapSelectorComponent
                      location={location.formattedAddress || ""}
                      onLocationChange={() => {}} // Read-only
                      selectedCoordinates={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                      label={null}
                    />
                  ) : (
                    <div className="h-full bg-gray-100 flex items-center justify-center border rounded-lg">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p>No coordinates available for map display</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabsSection = () => {
    if (!serviceData.tabsSection || serviceData.tabsSection.length === 0)
      return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <div className="space-y-4">
          {serviceData.tabsSection.map((tab, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">{tab.heading}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{tab.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPolicySection = () => {
    if (!serviceData.policySection || serviceData.policySection.length === 0)
      return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Policies</h2>
        <div className="space-y-4">
          {serviceData.policySection.map((policy, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">{policy.heading}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {policy.policy}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAccommodationSpecific = () => {
    if (serviceType !== "accommodation") return null;

    const data = serviceData; // Use the typed serviceData

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Accommodation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accommodation Type
            </label>
            <p className="text-gray-900 capitalize">
              {data.accommodationType?.toLowerCase() || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rooms
            </label>
            <p className="text-gray-900">{data.numberOfRooms || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Guests
            </label>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-500" />
              <p className="text-gray-900">{data.maxGuests || "N/A"}</p>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-3">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.parkingAvailable && (
            <div className="flex items-center text-green-600">
              <Parking className="w-4 h-4 mr-2" />
              <span className="text-sm">Parking Available</span>
            </div>
          )}
          {data.petFriendly && (
            <div className="flex items-center text-green-600">
              <Heart className="w-4 h-4 mr-2" />
              <span className="text-sm">Pet Friendly</span>
            </div>
          )}
          {data.freeWifi && (
            <div className="flex items-center text-green-600">
              <Wifi className="w-4 h-4 mr-2" />
              <span className="text-sm">Free WiFi</span>
            </div>
          )}
          {data.breakfastIncluded && (
            <div className="flex items-center text-green-600">
              <Coffee className="w-4 h-4 mr-2" />
              <span className="text-sm">Breakfast Included</span>
            </div>
          )}
          {data.airConditioned && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Air Conditioned</span>
            </div>
          )}
          {data.swimmingPool && (
            <div className="flex items-center text-green-600">
              <Waves className="w-4 h-4 mr-2" />
              <span className="text-sm">Swimming Pool</span>
            </div>
          )}
          {data.laundryService && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Laundry Service</span>
            </div>
          )}
          {data.roomService && (
            <div className="flex items-center text-green-600">
              <Utensils className="w-4 h-4 mr-2" />
              <span className="text-sm">Room Service</span>
            </div>
          )}
          {data.gymAccess && (
            <div className="flex items-center text-green-600">
              <Dumbbell className="w-4 h-4 mr-2" />
              <span className="text-sm">Gym Access</span>
            </div>
          )}
          {data.spaServices && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Spa Services</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTransportationSpecific = () => {
    if (serviceType !== "transportation") return null;

    const data = serviceData; // Use the typed serviceData

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Transportation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.vehicleCategory || data.vehicleType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-900 capitalize">
                  {(data.vehicleCategory || data.vehicleType)?.toLowerCase()}
                </p>
              </div>
            </div>
          )}
          {data.fuelType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type
              </label>
              <p className="text-gray-900 capitalize">
                {data.fuelType.toLowerCase()}
              </p>
            </div>
          )}
          {data.transmissionType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <p className="text-gray-900 capitalize">
                {data.transmissionType.toLowerCase()}
              </p>
            </div>
          )}
          {(data.airConditioned !== undefined ||
            data.hasAirConditioning !== undefined) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Air Conditioning
              </label>
              <p
                className={`text-sm ${
                  data.airConditioned || data.hasAirConditioning
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {data.airConditioned || data.hasAirConditioning
                  ? "Available"
                  : "Not Available"}
              </p>
            </div>
          )}
          {data.driverIncluded !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Included
              </label>
              <p
                className={`text-sm ${
                  data.driverIncluded ? "text-green-600" : "text-gray-500"
                }`}
              >
                {data.driverIncluded ? "Yes" : "No"}
              </p>
            </div>
          )}
          {data.seatingCapacity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seating Capacity
              </label>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-900">
                  {data.seatingCapacity} passengers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActivitySpecific = () => {
    if (serviceType !== "activity") return null;

    const data = serviceData; // Use the typed serviceData

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Activity Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.activityType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <p className="text-gray-900 capitalize">
                {data.activityType.toLowerCase()}
              </p>
            </div>
          )}
          {data.duration && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-900">{data.duration}</p>
              </div>
            </div>
          )}
          {data.maxParticipants && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-900">{data.maxParticipants} people</p>
              </div>
            </div>
          )}
          {data.difficultyLevel && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <p className="text-gray-900 capitalize">
                {data.difficultyLevel.toLowerCase()}
              </p>
            </div>
          )}
          {data.ageRestriction && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Restriction
              </label>
              <p className="text-gray-900">{data.ageRestriction}</p>
            </div>
          )}
        </div>
        {data.activityDetails && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Details
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">
              {data.activityDetails}
            </p>
          </div>
        )}
        {data.safetyInstructions && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Instructions
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">
              {data.safetyInstructions}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderTourGuideSpecific = () => {
    if (serviceType !== "tour-guides") return null;

    const data = serviceData; // Use the typed serviceData

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Tour Guide Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.tourGuideType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tour Guide Type
              </label>
              <p className="text-gray-900 capitalize">
                {data.tourGuideType.toLowerCase()}
              </p>
            </div>
          )}
          {data.experienceYears && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <p className="text-gray-900">{data.experienceYears} years</p>
            </div>
          )}
          {data.specializations && data.specializations.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {data.specializations.map((spec: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.languages && data.languages.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFoodBeverageSpecific = () => {
    if (serviceType !== "food-beverage") return null;

    const data = serviceData; // Use the typed serviceData

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Food & Beverage Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.foodAndBeverageType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food & Beverage Type
              </label>
              <p className="text-gray-900 capitalize">
                {data.foodAndBeverageType.toLowerCase()}
              </p>
            </div>
          )}
          {data.cuisineType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Type
              </label>
              <p className="text-gray-900 capitalize">
                {data.cuisineType.toLowerCase()}
              </p>
            </div>
          )}
          {data.seatingCapacity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seating Capacity
              </label>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-900">{data.seatingCapacity} people</p>
              </div>
            </div>
          )}
          {data.openingHours && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <p className="text-gray-900">{data.openingHours}</p>
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium mb-3 mt-6">Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.vegetarianOptions && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Vegetarian Options</span>
            </div>
          )}
          {data.halalCertified && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Halal Certified</span>
            </div>
          )}
          {data.alcoholServed && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Alcohol Served</span>
            </div>
          )}
          {data.outdoorSeating && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Outdoor Seating</span>
            </div>
          )}
          {data.liveMusic && (
            <div className="flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm">Live Music</span>
            </div>
          )}
        </div>

        {data.dietaryOptions && data.dietaryOptions.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Options
            </label>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(data.dietaryOptions)
                ? data.dietaryOptions
                : data.dietaryOptions
                ? [data.dietaryOptions]
                : []
              ).map((option: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPriceConfiguration = () => {
    if (!serviceData.priceConfig) return null;

    const config = serviceData.priceConfig;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          <h2 className="text-xl font-semibold">Price Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Type
            </label>
            <p className="text-gray-900 capitalize">
              {config.priceType?.replace(/_/g, " ").toLowerCase() ||
                "Not specified"}
            </p>
          </div>

          {config.fixedPrice && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fixed Price
              </label>
              <p className="text-green-600 font-semibold">
                LKR {config.fixedPrice.toLocaleString()}
              </p>
            </div>
          )}

          {config.pricePerUnit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Unit
              </label>
              <p className="text-green-600 font-semibold">
                LKR {config.pricePerUnit.toLocaleString()}
              </p>
            </div>
          )}

          {config.pricePerAdult && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Adult
              </label>
              <p className="text-green-600 font-semibold">
                LKR {config.pricePerAdult.toLocaleString()}
              </p>
            </div>
          )}

          {config.pricePerChild && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Child
              </label>
              <p className="text-green-600 font-semibold">
                LKR {config.pricePerChild.toLocaleString()}
              </p>
            </div>
          )}

          {config.extraChargePerUnit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Charge Per Unit
              </label>
              <p className="text-orange-600 font-semibold">
                LKR {config.extraChargePerUnit.toLocaleString()}
              </p>
            </div>
          )}

          {config.extraPerAdult && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Per Adult
              </label>
              <p className="text-orange-600 font-semibold">
                LKR {config.extraPerAdult.toLocaleString()}
              </p>
            </div>
          )}

          {config.extraPerChild && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Per Child
              </label>
              <p className="text-orange-600 font-semibold">
                LKR {config.extraPerChild.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Advance Payment & Deposit Section */}
        {(config.allowAdvancePayment || config.requiresDeposit) && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-lg font-medium mb-3">Payment Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.allowAdvancePayment && (
                <div>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">
                      Advance Payment Allowed
                    </span>
                  </div>
                  {config.advancePaymentPercentage && (
                    <p className="text-sm text-gray-600 ml-6">
                      {config.advancePaymentPercentage}% of total amount
                    </p>
                  )}
                  {config.advancePaymentFixedAmount && (
                    <p className="text-sm text-gray-600 ml-6">
                      LKR {config.advancePaymentFixedAmount.toLocaleString()}{" "}
                      fixed amount
                    </p>
                  )}
                </div>
              )}

              {config.requiresDeposit && (
                <div>
                  <div className="flex items-center mb-2">
                    <Info className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">
                      Deposit Required
                    </span>
                  </div>
                  {config.depositAmount && (
                    <p className="text-sm text-gray-600 ml-6">
                      LKR {config.depositAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBookingConfiguration = () => {
    if (!serviceData.bookingConfig) return null;

    const config = serviceData.bookingConfig;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-xl font-semibold">Booking Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Type
            </label>
            <p className="text-gray-900 capitalize">
              {config.bookingType?.replace(/_/g, " ").toLowerCase() ||
                "Not specified"}
            </p>
          </div>

          {config.totalUnits && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Units Available
              </label>
              <p className="text-gray-900">{config.totalUnits}</p>
            </div>
          )}

          {config.unitAdultCapacity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adult Capacity Per Unit
              </label>
              <p className="text-gray-900">{config.unitAdultCapacity}</p>
            </div>
          )}

          {config.unitChildCapacity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Child Capacity Per Unit
              </label>
              <p className="text-gray-900">{config.unitChildCapacity}</p>
            </div>
          )}

          {config.minUnitsPerBooking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Units Per Booking
              </label>
              <p className="text-gray-900">{config.minUnitsPerBooking}</p>
            </div>
          )}

          {config.maxUnitsPerBooking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Units Per Booking
              </label>
              <p className="text-gray-900">{config.maxUnitsPerBooking}</p>
            </div>
          )}

          {config.slotDuration && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slot Duration
              </label>
              <p className="text-gray-900">{config.slotDuration} minutes</p>
            </div>
          )}

          {config.bufferTime && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buffer Time
              </label>
              <p className="text-gray-900">{config.bufferTime} minutes</p>
            </div>
          )}

          {config.minimumBookingDays && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Booking Days
              </label>
              <p className="text-gray-900">{config.minimumBookingDays} days</p>
            </div>
          )}

          {config.maximumBookingDays && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Booking Days
              </label>
              <p className="text-gray-900">{config.maximumBookingDays} days</p>
            </div>
          )}

          {config.advanceBookingPeriod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advance Booking Period
              </label>
              <p className="text-gray-900">
                {config.advanceBookingPeriod} days
              </p>
            </div>
          )}

          {config.lastMinuteBookingPeriod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Minute Booking Period
              </label>
              <p className="text-gray-900">
                {config.lastMinuteBookingPeriod} hours
              </p>
            </div>
          )}
        </div>

        {/* Booking Options */}
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-medium mb-3">Booking Options</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="flex items-center">
              {config.requireChildInfo ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-gray-400" />
              )}
              <span className="text-sm">Requires Child Info</span>
            </div>

            <div className="flex items-center">
              {config.manageCapacity ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-gray-400" />
              )}
              <span className="text-sm">Manage Capacity</span>
            </div>

            <div className="flex items-center">
              {config.allowExtraCapacity ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-gray-400" />
              )}
              <span className="text-sm">Allow Extra Capacity</span>
            </div>

            <div className="flex items-center">
              {config.allowBackToBackBookings ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-gray-400" />
              )}
              <span className="text-sm">Back-to-Back Bookings</span>
            </div>
          </div>
        </div>

        {/* Check-in/Check-out Times */}
        {(config.defaultCheckInTime || config.defaultCheckOutTime) && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-lg font-medium mb-3">Default Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.defaultCheckInTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Check-in Time
                  </label>
                  <p className="text-gray-900">{config.defaultCheckInTime}</p>
                </div>
              )}
              {config.defaultCheckOutTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Check-out Time
                  </label>
                  <p className="text-gray-900">{config.defaultCheckOutTime}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAvailableTimes = () => {
    if (
      !serviceData.availableTimeDTOS ||
      serviceData.availableTimeDTOS.length === 0
    )
      return null;

    const DAYS_ORDER = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    const sortedTimes = serviceData.availableTimeDTOS.sort(
      (a, b) =>
        DAYS_ORDER.indexOf(a.dayOfWeek) - DAYS_ORDER.indexOf(b.dayOfWeek)
    );

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold">Available Times</h2>
        </div>

        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sortedTimes.map((timeSlot, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <div className="text-center">
                <h3 className="font-medium text-sm capitalize mb-2">
                  {timeSlot.dayOfWeek.toLowerCase()}
                </h3>

                {timeSlot.isClosed ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded block">
                    Closed
                  </span>
                ) : timeSlot.is24Hours ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded block">
                    24 Hours
                  </span>
                ) : (
                  <div className="space-y-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded block">
                      {timeSlot.openTime} - {timeSlot.closeTime}
                    </span>

                    {timeSlot.breakTimes && timeSlot.breakTimes.length > 0 && (
                      <div className="text-xs space-y-1 mt-2">
                        {timeSlot.breakTimes.map((breakTime, breakIndex) => (
                          <div
                            key={breakIndex}
                            className="px-1 py-0.5 bg-orange-100 text-orange-800 rounded text-xs"
                          >
                            <Coffee className="w-3 h-3 inline mr-1" />
                            {breakTime.breakStart} - {breakTime.breakEnd}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderBasicAndServiceInfo()}
      {renderImages()}
      {renderLocations()}
      {renderPriceConfiguration()}
      {renderBookingConfiguration()}
      {renderAvailableTimes()}
      {renderCollapsibleTabsAndPolicies()}
    </div>
  );
};

export default ServiceDetails;
