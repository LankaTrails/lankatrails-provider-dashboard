import React, { useEffect, useState, useMemo } from "react";
import {
  Globe,
  Info,
  DollarSign,
  Calendar,
  Camera,
  MapPin,
  Settings,
} from "lucide-react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import ImageUploadComponent from "@/components/forms/ImageUploadComponent";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import MultiSelectField from "./forms/MultiSelectField";
import TextAreaField from "./forms/TextAreaField";
import CheckboxField from "./forms/CheckboxField";
import BookingConfigurationForm from "./forms/BookingConfigurationForm";
import PriceConfigurationForm from "./forms/PriceConfigurationForm";
import AvailableTimeConfiguration from "./forms/AvailableTimeConfiguration";
import CollapsibleSection from "./forms/CollapsibleSection";

import {
  getServiceTypeRecommendations,
  getDefaultCapacityForServiceType,
} from "@/utils/serviceRecommendations";
import type {
  TabSection,
  PolicySection,
  ServiceFormData,
  LocationData,
  TabData,
  PolicyData,
  ImageFiles,
  ImageData,
  OptionType,
  ServiceFormProps,
  AccommodationFormData,
  ActivityFormData,
  FoodBeverageFormData,
  TourGuideFormData,
  TransportFormData,
  ActivityType,
  VehicleType,
  AccommodationType,
  BookingConfigDTO,
  PriceConfigDTO,
  ServiceType,
  FuelType,
  TransmissionType,
  FoodBeverageType,
  AvailableTimeDTO,
} from "@/types/serviceTypes";
import { fetchAllGuidingAreas } from "@/services/guideService";
import { fetchPoliciesByServiceType } from "@/services/services";

const UnifiedServiceForm: React.FC<ServiceFormProps> = ({
  serviceType,
  initialImages,
  existingImages,
  initialData,
  onSubmit,
}) => {
  const [images, setImages] = useState<ImageFiles>({
    serviceImages:
      existingImages && existingImages.length > 0 ? [] : initialImages || [],
  });

  // Track which existing images to delete
  const [deletedImages, setDeletedImages] = useState<ImageData[]>([]);
  const [deletedTabs] = useState<TabSection[]>([]);
  const [deletedPolicies] = useState<PolicySection[]>([]);

  // Initialize form data
  const initializeFormData = (): ServiceFormData => {
    // Get default configurations based on service type
    const getDefaultBookingConfig = (): BookingConfigDTO => {
      // Convert serviceType to ServiceType enum format
      const normalizedServiceType: ServiceType =
        serviceType === "accommodation"
          ? "ACCOMMODATION"
          : serviceType === "transportation"
          ? "TRANSPORT"
          : serviceType === "activity"
          ? "ACTIVITY"
          : serviceType === "food-beverage"
          ? "FOOD_BEVERAGE"
          : serviceType === "tour-guides"
          ? "TOUR_GUIDE"
          : "ACTIVITY";

      const defaultCapacity = getDefaultCapacityForServiceType(
        normalizedServiceType
      );
      const recommendations = getServiceTypeRecommendations(
        normalizedServiceType
      );
      const recommendedBookingType =
        recommendations.bookingTypes.find((bt) => bt.recommended)?.value ||
        recommendations.bookingTypes[0].value;

      switch (serviceType) {
        case "accommodation":
          return {
            bookingType: recommendedBookingType,
            totalUnits: defaultCapacity.totalUnits,
            unitAdultCapacity: defaultCapacity.unitAdultCapacity,
            unitChildCapacity: defaultCapacity.unitChildCapacity,
            allowExtraCapacity: defaultCapacity.allowExtraCapacity,
            minimumBookingDays: 1,
            maximumBookingDays: 30,
            defaultCheckInTime: "14:00",
            defaultCheckOutTime: "11:00",
            advanceBookingPeriod: 30,
            lastMinuteBookingPeriod: 24,
          };
        case "transportation":
          return {
            bookingType: recommendedBookingType,
            totalUnits: defaultCapacity.totalUnits,
            unitAdultCapacity: defaultCapacity.unitAdultCapacity,
            unitChildCapacity: defaultCapacity.unitChildCapacity,
            allowExtraCapacity: defaultCapacity.allowExtraCapacity,
            advanceBookingPeriod: 7,
            lastMinuteBookingPeriod: 12,
          };
        case "activity":
          return {
            bookingType: recommendedBookingType,
            totalUnits: defaultCapacity.totalUnits,
            unitAdultCapacity: defaultCapacity.unitAdultCapacity,
            unitChildCapacity: defaultCapacity.unitChildCapacity,
            allowExtraCapacity: defaultCapacity.allowExtraCapacity,
            slotDuration: 120,
            bufferTime: 30,
            allowBackToBackBookings: false,
            advanceBookingPeriod: 14,
            lastMinuteBookingPeriod: 6,
          };
        case "food-beverage":
          return {
            bookingType: recommendedBookingType,
            totalUnits: defaultCapacity.totalUnits,
            unitAdultCapacity: defaultCapacity.unitAdultCapacity,
            unitChildCapacity: defaultCapacity.unitChildCapacity,
            allowExtraCapacity: defaultCapacity.allowExtraCapacity,
            slotDuration: 90,
            bufferTime: 15,
            allowBackToBackBookings: true,
            advanceBookingPeriod: 7,
            lastMinuteBookingPeriod: 2,
          };
        case "tour-guides":
          return {
            bookingType: recommendedBookingType,
            totalUnits: defaultCapacity.totalUnits,
            unitAdultCapacity: defaultCapacity.unitAdultCapacity,
            unitChildCapacity: defaultCapacity.unitChildCapacity,
            allowExtraCapacity: defaultCapacity.allowExtraCapacity,
            advanceBookingPeriod: 14,
            lastMinuteBookingPeriod: 24,
          };
        default:
          return {
            bookingType: "TIME_SLOTS",
            totalUnits: 1,
            unitAdultCapacity: 1,
            unitChildCapacity: 0,
            slotDuration: 60,
            bufferTime: 15,
            advanceBookingPeriod: 30,
            lastMinuteBookingPeriod: 24,
          };
      }
    };

    const getDefaultPriceConfig = (): PriceConfigDTO => {
      // Convert serviceType to ServiceType enum format
      const normalizedServiceType: ServiceType =
        serviceType === "accommodation"
          ? "ACCOMMODATION"
          : serviceType === "transportation"
          ? "TRANSPORT"
          : serviceType === "activity"
          ? "ACTIVITY"
          : serviceType === "food-beverage"
          ? "FOOD_BEVERAGE"
          : serviceType === "tour-guides"
          ? "TOUR_GUIDE"
          : "ACTIVITY";

      const recommendations = getServiceTypeRecommendations(
        normalizedServiceType
      );
      const recommendedPriceType =
        recommendations.priceTypes.find((pt) => pt.recommended)?.value ||
        recommendations.priceTypes[0].value;

      switch (serviceType) {
        case "accommodation":
          return {
            priceType: recommendedPriceType,
            pricePerUnit: 0,
            allowAdvancePayment: true,
            advancePaymentPercentage: 30,
            requiresDeposit: false,
          };
        case "transportation":
          return {
            priceType: recommendedPriceType,
            pricePerUnit: 0,
            fixedPrice: 0,
            allowAdvancePayment: false,
            requiresDeposit: false,
          };
        case "activity":
          return {
            priceType: recommendedPriceType,
            pricePerAdult: 0,
            pricePerChild: 0,
            allowAdvancePayment: true,
            advancePaymentPercentage: 20,
            requiresDeposit: false,
          };
        case "food-beverage":
          return {
            priceType: recommendedPriceType,
            pricePerAdult: 0,
            pricePerChild: 0,
            allowAdvancePayment: false,
            requiresDeposit: false,
          };
        case "tour-guides":
          return {
            priceType: recommendedPriceType,
            pricePerUnit: 0,
            allowAdvancePayment: true,
            advancePaymentPercentage: 25,
            requiresDeposit: false,
          };
        default:
          return {
            priceType: "FIXED",
            fixedPrice: 0,
            allowAdvancePayment: false,
            requiresDeposit: false,
          };
      }
    };

    const baseData: ServiceFormData = {
      serviceName: "",
      locations: [
        {
          locationId: null,
          formattedAddress: "",
          city: "",
          district: "",
          province: "",
          country: "",
          postalCode: "",
          latitude: 0,
          longitude: 0,
        },
      ],
      contactNo: "",
      status: "ACTIVE",
      tabsSection: [{ id: null, heading: "", content: "" }],
      policySection: [{ id: null, heading: "", policy: "" }],
      deletedImages: [],
      deletedTabs: [],
      deletedPolicies: [],
      availableTimeDTOS: [],
      priceConfig: getDefaultPriceConfig(),
      bookingConfig: getDefaultBookingConfig(),
    };

    // Add service-specific fields
    if (serviceType === "activity") {
      return {
        ...baseData,
        activityType: "ADVENTURE" as ActivityType,
        activityDetails: "",
        safetyInstructions: "",
      } as ActivityFormData;
    } else if (serviceType === "transportation") {
      return {
        ...baseData,
        vehicleCategory: "CAR" as VehicleType,
        fuelType: "PETROL" as FuelType,
        transmissionType: "MANUAL" as TransmissionType,
        airConditioned: false,
        driverIncluded: false,
      } as TransportFormData;
    } else if (serviceType === "accommodation") {
      return {
        ...baseData,
        accommodationType: "HOTEL" as AccommodationType,
        parkingAvailable: false,
        petFriendly: false,
        freeWifi: false,
        breakfastIncluded: false,
        airConditioned: false,
        swimmingPool: false,
        laundryService: false,
        roomService: false,
        gymAccess: false,
        spaServices: false,
      } as AccommodationFormData;
    } else if (serviceType === "food-beverage") {
      return {
        ...baseData,
        foodAndBeverageType: "RESTAURANT" as FoodBeverageType,
        cuisineType: "",
        vegetarianOptions: false,
        halalCertified: false,
        alcoholServed: false,
        outdoorSeating: false,
        liveMusic: false,
      } as FoodBeverageFormData;
    } else if (serviceType === "tour-guides") {
      return {
        ...baseData,
        languages: [],
        tourGuideType: "NATIONAL",
      } as TourGuideFormData;
    }

    return baseData;
  };

  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || initializeFormData()
  );
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(
    (formData as TourGuideFormData).languages || []
  );

  const [tabsSection, setTabsSection] = useState<TabData[]>(
    (initialData?.tabsSection || [{ heading: "", content: "" }]).map((tab) => ({
      id: "id" in tab && tab.id !== null ? tab.id : null,
      heading: tab.heading,
      description: tab.content,
      isExpanded: true,
    }))
  );

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    (initialData?.policySection || [{ heading: "", policy: "" }]).map(
      (policy) => ({
        id: "id" in policy && policy.id !== null ? policy.id : null,
        heading: policy.heading,
        description: policy.policy || "",
        isExpanded: true,
      })
    )
  );

  // State for policies and guiding areas
  const [policyOptions, setPolicyOptions] = useState<OptionType[]>([]);
  const [preferredPolicies, setPreferredPolicies] = useState<string[]>([]);
  const [guidingAreas, setGuidingAreas] = useState<LocationData[]>([]);
  const [selectedGuidingAreas, setSelectedGuidingAreas] = useState<
    LocationData[]
  >([]);

  // Map and location states
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    { latitude: number; longitude: number } | undefined
  >(
    initialData?.locations?.[0]?.latitude &&
      initialData?.locations?.[0]?.longitude
      ? {
          latitude: initialData.locations[0].latitude,
          longitude: initialData.locations[0].longitude,
        }
      : undefined
  );

  // General input change handler
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Booking configuration change handler
  const handleBookingConfigChange = (config: BookingConfigDTO) => {
    handleInputChange("bookingConfig", config);
  };

  // Price configuration change handler
  const handlePriceConfigChange = (config: PriceConfigDTO) => {
    handleInputChange("priceConfig", config);
  };

  // Available times configuration change handler
  const handleAvailableTimesChange = (availableTimes: AvailableTimeDTO[]) => {
    handleInputChange("availableTimeDTOS", availableTimes);
  };

  // Convert serviceType string to ServiceType enum
  const getServiceTypeEnum = (): ServiceType => {
    switch (serviceType) {
      case "activity":
        return "ACTIVITY";
      case "transportation":
        return "TRANSPORT";
      case "accommodation":
        return "ACCOMMODATION";
      case "food-beverage":
        return "FOOD_BEVERAGE";
      case "tour-guides":
        return "TOUR_GUIDE";
      default:
        return "ACTIVITY";
    }
  };

  // Load policies for this service type
  useEffect(() => {
    const loadPolicies = async () => {
      if (serviceType) {
        try {
          const policies = await fetchPoliciesByServiceType(serviceType);
          setPolicyOptions(policies);
        } catch (error) {
          console.error("Error loading policies:", error);
        }
      }
    };
    loadPolicies();
  }, [serviceType]);

  // Load guiding areas for tour guides
  useEffect(() => {
    const loadGuidingAreas = async () => {
      if (serviceType === "tour-guides") {
        try {
          const areas = await fetchAllGuidingAreas();
          setGuidingAreas(areas);
        } catch (error) {
          console.error("Error loading guiding areas:", error);
        }
      }
    };
    loadGuidingAreas();
  }, [serviceType]);

  // Handle location selection
  const handleLocationSelect = (locationData: LocationData | undefined) => {
    if (locationData) {
      handleInputChange("locations", [locationData]);
      setSelectedCoordinates({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });
    }
  };

  // Handle location ID selection
  const handleLocationIdSelect = (locationId: number) => {
    if (formData.locations && formData.locations.length > 0) {
      const updatedLocations = [...formData.locations];
      updatedLocations[0] = {
        ...updatedLocations[0],
        locationId: locationId,
      };
      handleInputChange("locations", updatedLocations);
    }
  };

  // Combined existing and new images for display
  const displayImages = useMemo(() => {
    const existingImagesAsFiles = (existingImages || [])
      .filter(
        (img) =>
          img && img.id && !deletedImages.some((delImg) => delImg.id === img.id)
      )
      .map((img) => ({
        id: `existing-${img.id}`,
        url: img.imageUrl,
        name: `Existing Image`,
      }));

    return [...existingImagesAsFiles, ...images.serviceImages];
  }, [existingImages, deletedImages, images.serviceImages]);

  // Handle image deletion
  const handleImageDelete = (imageId: string) => {
    if (imageId.startsWith("existing-")) {
      const originalIdStr = imageId.replace("existing-", "");
      const originalId = parseInt(originalIdStr);
      if (!isNaN(originalId)) {
        const imageToDelete = existingImages?.find(
          (img) => img.id === originalId
        );
        if (imageToDelete) {
          setDeletedImages((prev) => [...prev, imageToDelete]);
        }
      }
    } else {
      setImages((prev) => ({
        ...prev,
        serviceImages: prev.serviceImages.filter((img) => img.id !== imageId),
      }));
    }
  };

  // Handle tabs changes
  const handleTabsChange = (newTabs: TabData[]) => {
    setTabsSection(newTabs);
    const backendTabs: TabSection[] = newTabs.map(
      ({ id, heading, description }) => ({
        id: id || null,
        heading,
        content: description,
      })
    );
    handleInputChange("tabsSection", backendTabs);
  };

  // Handle policies changes
  const handlePoliciesChange = (newPolicies: PolicyData[]) => {
    setPolicySection(newPolicies);
    const backendPolicies: PolicySection[] = newPolicies.map(
      ({ id, heading, description }) => ({
        id: id || null,
        heading,
        policy: description,
      })
    );
    handleInputChange("policySection", backendPolicies);
  };

  // Handle multiselect policy changes
  const handleMultiselectPolicyChange = (selectedValues: string[]) => {
    setPreferredPolicies(selectedValues);
  };

  // Handle guiding area selection for tour guides
  const handleGuidingAreaSelection = (selectedValues: string[]) => {
    const selectedAreas = guidingAreas.filter((area) =>
      selectedValues.includes(area.district)
    );
    setSelectedGuidingAreas(selectedAreas);
  };

  // Get guiding area options for MultiSelect
  const guidingAreaOptions = useMemo(() => {
    return guidingAreas.map((area) => ({
      label: area.district,
      value: area.district,
    }));
  }, [guidingAreas]);

  // Form submission
  const handleSubmit = () => {
    let updatedData: ServiceFormData = {
      ...formData,
      deletedImages: deletedImages,
      deletedTabs: deletedTabs,
      deletedPolicies: deletedPolicies,
    };

    // Update specific fields based on service type
    if (serviceType === "tour-guides") {
      updatedData = {
        ...updatedData,
        locations: selectedGuidingAreas,
        languages: preferredLanguages,
      } as TourGuideFormData;
    }

    onSubmit(updatedData, images);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Service Information */}
          <CollapsibleSection
            title="Service Information"
            icon={<Info className="w-5 h-5" />}
            colorTheme="primary"
            defaultOpen={true}
            isRequired={true}
          >
            <div className="space-y-5">
              <InputField
                label="Service Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter service name"
                required
              />

              {/* Service Type Specific Fields */}
              {serviceType === "activity" && (
                <>
                  <SelectField
                    label="Activity Type"
                    options={[
                      { value: "ADVENTURE", label: "Adventure" },
                      { value: "CULTURAL", label: "Cultural" },
                      { value: "NATURE", label: "Nature" },
                      { value: "RELAXATION", label: "Relaxation" },
                      { value: "SPORTS", label: "Sports" },
                      { value: "WATER_SPORTS", label: "Water Sports" },
                      { value: "WELLNESS", label: "Wellness" },
                      { value: "EDUCATIONAL", label: "Educational" },
                      { value: "NIGHTLIFE", label: "Nightlife" },
                    ]}
                    value={(formData as ActivityFormData).activityType}
                    onChange={(value) =>
                      handleInputChange("activityType", value)
                    }
                    required
                  />
                  <TextAreaField
                    label="Activity Details"
                    value={(formData as ActivityFormData).activityDetails}
                    onChange={(value) =>
                      handleInputChange("activityDetails", value)
                    }
                    placeholder="Enter activity details"
                    rows={3}
                  />
                  <TextAreaField
                    label="Safety Instructions"
                    value={(formData as ActivityFormData).safetyInstructions}
                    onChange={(value) =>
                      handleInputChange("safetyInstructions", value)
                    }
                    placeholder="Enter safety instructions"
                    rows={4}
                  />
                </>
              )}

              {serviceType === "transportation" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="Vehicle Type"
                      options={[
                        { value: "CAR", label: "Car" },
                        { value: "VAN", label: "Van" },
                        { value: "BUS", label: "Bus" },
                        { value: "TRUCK", label: "Truck" },
                        { value: "MOTORCYCLE", label: "Motorcycle" },
                        { value: "BICYCLE", label: "Bicycle" },
                        { value: "SCOOTER", label: "Scooter" },
                        { value: "PICKUP", label: "Pickup" },
                        { value: "SUV", label: "SUV" },
                        { value: "TUK_TUK", label: "Tuk Tuk" },
                      ]}
                      value={(formData as TransportFormData).vehicleCategory}
                      onChange={(value) =>
                        handleInputChange("vehicleCategory", value)
                      }
                      required
                    />
                    <SelectField
                      label="Fuel Type"
                      options={[
                        { value: "PETROL", label: "Petrol" },
                        { value: "DIESEL", label: "Diesel" },
                        { value: "ELECTRIC", label: "Electric" },
                        { value: "HYBRID", label: "Hybrid" },
                      ]}
                      value={(formData as TransportFormData).fuelType}
                      onChange={(value) => handleInputChange("fuelType", value)}
                      required
                    />
                  </div>
                  <SelectField
                    label="Transmission Type"
                    options={[
                      { value: "MANUAL", label: "Manual" },
                      { value: "AUTOMATIC", label: "Automatic" },
                      { value: "SEMI_AUTOMATIC", label: "Semi Automatic" },
                    ]}
                    value={(formData as TransportFormData).transmissionType}
                    onChange={(value) =>
                      handleInputChange("transmissionType", value)
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <CheckboxField
                      label="Air Conditioned"
                      checked={(formData as TransportFormData).airConditioned}
                      onChange={(value) =>
                        handleInputChange("airConditioned", value)
                      }
                    />
                    <CheckboxField
                      label="Driver Included"
                      checked={(formData as TransportFormData).driverIncluded}
                      onChange={(value) =>
                        handleInputChange("driverIncluded", value)
                      }
                    />
                  </div>
                </>
              )}

              {serviceType === "accommodation" && (
                <>
                  <SelectField
                    label="Accommodation Type"
                    options={[
                      { value: "HOTEL", label: "Hotel" },
                      { value: "HOSTEL", label: "Hostel" },
                      { value: "GUEST_HOUSE", label: "Guest House" },
                      { value: "APARTMENT", label: "Apartment" },
                      { value: "VILLA", label: "Villa" },
                      { value: "HOMESTAY", label: "Homestay" },
                      { value: "CAMPING", label: "Camping" },
                      { value: "RESORT", label: "Resort" },
                      { value: "LODGE", label: "Lodge" },
                    ]}
                    value={
                      (formData as AccommodationFormData).accommodationType
                    }
                    onChange={(value) =>
                      handleInputChange("accommodationType", value)
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {/* Amenities as checkboxes */}
                    <CheckboxField
                      label="Parking Available"
                      checked={
                        (formData as AccommodationFormData).parkingAvailable
                      }
                      onChange={(value) =>
                        handleInputChange("parkingAvailable", value)
                      }
                    />
                    <CheckboxField
                      label="Pet Friendly"
                      checked={(formData as AccommodationFormData).petFriendly}
                      onChange={(value) =>
                        handleInputChange("petFriendly", value)
                      }
                    />
                    <CheckboxField
                      label="Free WiFi"
                      checked={(formData as AccommodationFormData).freeWifi}
                      onChange={(value) => handleInputChange("freeWifi", value)}
                    />
                    <CheckboxField
                      label="Breakfast Included"
                      checked={
                        (formData as AccommodationFormData).breakfastIncluded
                      }
                      onChange={(value) =>
                        handleInputChange("breakfastIncluded", value)
                      }
                    />
                    <CheckboxField
                      label="Air Conditioned"
                      checked={
                        (formData as AccommodationFormData).airConditioned
                      }
                      onChange={(value) =>
                        handleInputChange("airConditioned", value)
                      }
                    />
                    <CheckboxField
                      label="Swimming Pool"
                      checked={(formData as AccommodationFormData).swimmingPool}
                      onChange={(value) =>
                        handleInputChange("swimmingPool", value)
                      }
                    />
                  </div>
                </>
              )}

              {serviceType === "food-beverage" && (
                <>
                  <SelectField
                    label="Food & Beverage Type"
                    options={[
                      { value: "RESTAURANT", label: "Restaurant" },
                      { value: "CAFE", label: "Cafe" },
                      { value: "BAR", label: "Bar" },
                      { value: "PUB", label: "Pub" },
                      { value: "FOOD_COURT", label: "Food Court" },
                      { value: "FOOD_TRUCK", label: "Food Truck" },
                      { value: "BAKERY", label: "Bakery" },
                      { value: "BREWERY", label: "Brewery" },
                      { value: "WINERY", label: "Winery" },
                      { value: "DISTILLERY", label: "Distillery" },
                      { value: "STREET_FOOD", label: "Street Food" },
                      { value: "BUFFET", label: "Buffet" },
                    ]}
                    value={
                      (formData as FoodBeverageFormData).foodAndBeverageType
                    }
                    onChange={(value) =>
                      handleInputChange("foodAndBeverageType", value)
                    }
                    required
                  />
                  <InputField
                    label="Cuisine Type"
                    value={(formData as FoodBeverageFormData).cuisineType}
                    onChange={(value) =>
                      handleInputChange("cuisineType", value)
                    }
                    placeholder="e.g., Italian, Chinese, Local"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <CheckboxField
                      label="Vegetarian Options"
                      checked={
                        (formData as FoodBeverageFormData).vegetarianOptions
                      }
                      onChange={(value) =>
                        handleInputChange("vegetarianOptions", value)
                      }
                    />
                    <CheckboxField
                      label="Halal Certified"
                      checked={
                        (formData as FoodBeverageFormData).halalCertified
                      }
                      onChange={(value) =>
                        handleInputChange("halalCertified", value)
                      }
                    />
                    <CheckboxField
                      label="Alcohol Served"
                      checked={(formData as FoodBeverageFormData).alcoholServed}
                      onChange={(value) =>
                        handleInputChange("alcoholServed", value)
                      }
                    />
                    <CheckboxField
                      label="Outdoor Seating"
                      checked={
                        (formData as FoodBeverageFormData).outdoorSeating
                      }
                      onChange={(value) =>
                        handleInputChange("outdoorSeating", value)
                      }
                    />
                  </div>
                </>
              )}

              {serviceType === "tour-guides" && (
                <>
                  <SelectField
                    label="Guide Type"
                    options={[
                      { value: "NATIONAL", label: "National Guide" },
                      { value: "CHAUFFEUR", label: "Chauffeur Guide" },
                      { value: "SITE", label: "Site Guide" },
                      { value: "AREA", label: "Area Guide" },
                    ]}
                    value={(formData as TourGuideFormData).tourGuideType}
                    onChange={(value) =>
                      handleInputChange("tourGuideType", value)
                    }
                    required
                  />
                  <MultiSelectField
                    label="Languages"
                    options={[
                      { value: "en", label: "English" },
                      { value: "si", label: "Sinhala" },
                      { value: "ta", label: "Tamil" },
                      { value: "fr", label: "French" },
                      { value: "de", label: "German" },
                      { value: "es", label: "Spanish" },
                      { value: "it", label: "Italian" },
                      { value: "ja", label: "Japanese" },
                      { value: "ko", label: "Korean" },
                      { value: "zh", label: "Chinese" },
                    ]}
                    value={preferredLanguages}
                    onChange={setPreferredLanguages}
                    icon={<Globe size={16} />}
                  />
                  {guidingAreaOptions.length > 0 && (
                    <MultiSelectField
                      label="Guiding Areas"
                      options={guidingAreaOptions}
                      value={selectedGuidingAreas.map((area) => area.district)}
                      onChange={handleGuidingAreaSelection}
                      icon={<Globe size={16} />}
                    />
                  )}
                </>
              )}
            </div>
          </CollapsibleSection>

          {/* Booking Configuration */}
          <CollapsibleSection
            title="Booking Configuration"
            icon={<Settings className="w-5 h-5" />}
            colorTheme="blue"
            defaultOpen={false}
            isRequired={true}
          >
            <BookingConfigurationForm
              bookingConfig={formData.bookingConfig}
              serviceType={getServiceTypeEnum()}
              onChange={handleBookingConfigChange}
            />
          </CollapsibleSection>

          {/* Price Configuration */}
          <CollapsibleSection
            title="Price Configuration"
            icon={<DollarSign className="w-5 h-5" />}
            colorTheme="green"
            defaultOpen={false}
            isRequired={true}
          >
            <PriceConfigurationForm
              priceConfig={formData.priceConfig}
              serviceType={getServiceTypeEnum()}
              onChange={handlePriceConfigChange}
              bookingConfig={formData.bookingConfig}
            />
          </CollapsibleSection>

          {/* Available Time Configuration */}
          <CollapsibleSection
            title="Available Times & Schedule"
            icon={<Calendar className="w-5 h-5" />}
            colorTheme="purple"
            defaultOpen={false}
            isRequired={false}
          >
            <AvailableTimeConfiguration
              availableTimes={formData.availableTimeDTOS}
              onChange={handleAvailableTimesChange}
            />
          </CollapsibleSection>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Images */}
          <CollapsibleSection
            title="Images"
            icon={<Camera className="w-5 h-5" />}
            colorTheme="orange"
            defaultOpen={true}
            isRequired={false}
          >
            <ImageUploadComponent
              images={displayImages}
              onImagesChange={(newImages) => {
                const genuinelyNewImages = newImages.filter(
                  (newImg) =>
                    !displayImages.some((existing) => existing.id === newImg.id)
                );
                if (genuinelyNewImages.length > 0) {
                  setImages((prev) => ({
                    ...prev,
                    serviceImages: [
                      ...prev.serviceImages,
                      ...genuinelyNewImages,
                    ],
                  }));
                }
              }}
              selectedImageIndex={0}
              onSelectedImageChange={() => {}}
              onImageDelete={handleImageDelete}
            />
          </CollapsibleSection>

          {/* Contact Information */}
          <CollapsibleSection
            title="Contact Information"
            icon={<MapPin className="w-5 h-5" />}
            colorTheme="primary"
            defaultOpen={true}
            isRequired={true}
          >
            <InputField
              label="Phone Number"
              value={formData.contactNo}
              onChange={(value) => handleInputChange("contactNo", value)}
              type="tel"
              placeholder="+94 xxx xxx xxxx"
              required
            />
          </CollapsibleSection>

          {/* Location */}
          {serviceType !== "tour-guides" && (
            <CollapsibleSection
              title="Location"
              icon={<MapPin className="w-5 h-5" />}
              colorTheme="blue"
              defaultOpen={true}
              isRequired={true}
            >
              <div className="h-[350px]">
                <MapSelectorComponent
                  location={formData.locations?.[0]?.formattedAddress || ""}
                  onLocationChange={(value) => {
                    if (formData.locations) {
                      handleInputChange("locations", [
                        {
                          ...formData.locations[0],
                          formattedAddress: value,
                        },
                      ]);
                    }
                  }}
                  onLocationSelect={handleLocationSelect}
                  onLocationIdSelect={handleLocationIdSelect}
                  selectedCoordinates={selectedCoordinates}
                  showBusinessLocationOption={true}
                />
              </div>
            </CollapsibleSection>
          )}

          {/* Tabs */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
            <ExpandableSectionComponent
              title="Tabs"
              items={tabsSection}
              onItemsChange={handleTabsChange}
              addButtonText="Add Tab"
              itemName="Tab"
            />
          </div>

          {/* Policies */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
            {policyOptions.length > 0 && (
              <div className="mb-6">
                <MultiSelectField
                  label="Available Policies"
                  options={policyOptions}
                  value={preferredPolicies}
                  onChange={handleMultiselectPolicyChange}
                  icon={<Globe size={16} />}
                />
              </div>
            )}
            <ExpandableSectionComponent
              title="Policies"
              items={policySection}
              onItemsChange={handlePoliciesChange}
              addButtonText="Add Policy"
              itemName="Policy"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          {initialData ? "Update Service" : "Add Service"}
        </button>
      </div>
    </div>
  );
};

export default UnifiedServiceForm;
