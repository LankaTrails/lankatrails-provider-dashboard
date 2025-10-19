import React, { useState, useMemo, useEffect } from "react";
import { Info, MapPin, Calendar, Globe, FileText } from "lucide-react";
import StepWizard from "./forms/StepWizard";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import MultiSelectField from "@/components/forms/MultiSelectField";
import ImageUploadComponent from "@/components/forms/ImageUploadComponent";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import TextAreaField from "./forms/TextAreaField";
import CheckboxField from "./forms/CheckboxField";
import BookingConfigurationForm from "./forms/BookingConfigurationForm";
import PriceConfigurationForm from "./forms/PriceConfigurationForm";
import AvailableTimeConfiguration from "./forms/AvailableTimeConfiguration";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";

import {
  getServiceTypeRecommendations,
  getDefaultCapacityForServiceType,
} from "@/utils/serviceRecommendations";
import {
  validateBookingConfig,
  validatePriceConfig,
  getServiceTypeHints,
} from "@/utils/serviceValidation";
import { fetchAllGuidingAreas } from "@/services/guideService";
import { fetchPoliciesByServiceType } from "@/services/services";
import type {
  ServiceFormData,
  LocationData,
  ImageFiles,
  ImageData,
  ServiceFormProps,
  AccommodationFormData,
  ActivityFormData,
  FoodBeverageFormData,
  TourGuideFormData,
  TransportFormData,
  ActivityType,
  VehicleType,
  AccommodationType,
  TourGuideType,
  BookingConfigDTO,
  PriceConfigDTO,
  ServiceType,
  FuelType,
  TransmissionType,
  FoodBeverageType,
  TabSection,
  PolicySection,
  TabData,
  PolicyData,
  AvailableTimeDTO,
} from "@/types/serviceTypes";

const StepWizardServiceForm: React.FC<ServiceFormProps> = ({
  serviceType,
  initialImages,
  existingImages,
  initialData,
  onSubmit,
  isEditMode = false,
  isSubmitting = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<ImageFiles>({
    serviceImages:
      existingImages && existingImages.length > 0 ? [] : initialImages || [],
  });
  const [deletedImages, setDeletedImages] = useState<ImageData[]>([]);
  const [deletedTabs, setDeletedTabs] = useState<TabSection[]>([]);
  const [deletedPolicies, setDeletedPolicies] = useState<PolicySection[]>([]);

  // Store original data for tracking deletions
  const [originalTabsSection] = useState<TabSection[]>(
    initialData?.tabsSection || []
  );
  const [originalPolicySection] = useState<PolicySection[]>(
    initialData?.policySection || []
  );
  const [originalPreferredPolicies] = useState<string[]>(() => {
    // Store original preferred policy IDs for deletion tracking
    if (initialData && initialData.policySection) {
      return initialData.policySection
        .filter((policy) => policy.id !== null)
        .map((policy) => policy.id!.toString());
    }
    return [];
  });
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(() => {
    if (initialData && serviceType === "tour-guides") {
      return (initialData as TourGuideFormData).languages || [];
    }
    return [];
  });
  const [selectedGuidingAreas, setSelectedGuidingAreas] = useState<
    LocationData[]
  >(() => {
    if (initialData && serviceType === "tour-guides") {
      return (initialData as TourGuideFormData).locations || [];
    }
    return [];
  });
  const [guidingAreas, setGuidingAreas] = useState<LocationData[]>([]);

  // Tab and Policy sections state
  const [tabsSection, setTabsSection] = useState<TabData[]>(
    (initialData?.tabsSection || [{ heading: "", content: "" }]).map((tab) => ({
      id: "id" in tab && tab.id !== null ? tab.id : null,
      heading: tab.heading,
      description: tab.content,
      isExpanded: true,
    }))
  );

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    (initialData?.policySection || [{ heading: "", policy: "" }])
      .filter((policy) => !("id" in policy) || policy.id === null) // Only include custom policies (null IDs or no ID)
      .map((policy) => ({
        id: null,
        heading: policy.heading,
        description: policy.policy || "",
        isExpanded: true,
      }))
  );

  // Policy-related state
  const [policyOptions, setPolicyOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [fullPolicyData, setFullPolicyData] = useState<any[]>([]);
  const [preferredPolicies, setPreferredPolicies] = useState<string[]>(() => {
    // Initialize with policy IDs from existing data that have non-null IDs
    if (initialData && initialData.policySection) {
      return initialData.policySection
        .filter((policy) => policy.id !== null)
        .map((policy) => policy.id!.toString());
    }
    return [];
  });

  const [attemptedSteps, setAttemptedSteps] = useState<Set<number>>(new Set());

  // Define wizard steps
  const steps = [
    {
      id: "info-images",
      title: "Service Information & Images",
      description: "Enter basic service details and upload images",
      icon: <Info className="w-5 h-5" />,
      isRequired: true,
    },
    {
      id: "booking-pricing",
      title: "Booking & Pricing Configuration",
      description: "Set up capacity, pricing, and booking rules",
      icon: <Calendar className="w-5 h-5" />,
      isRequired: true,
    },
    {
      id: "location-schedule",
      title: "Location, Contact & Schedule",
      description: "Add location, contact details, and operating hours",
      icon: <MapPin className="w-5 h-5" />,
      isRequired: true,
    },
    {
      id: "tabs-policies",
      title: "Additional Information & Policies",
      description: "Add detailed information tabs and service policies",
      icon: <FileText className="w-5 h-5" />,
      isRequired: false,
    },
  ];

  // Initialize form data with the same logic as UnifiedServiceForm
  const initializeFormData = (): ServiceFormData => {
    const getDefaultBookingConfig = (): BookingConfigDTO => {
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

      // Set default values based on booking type
      const baseConfig: BookingConfigDTO = {
        bookingType: recommendedBookingType,
        totalUnits: defaultCapacity.totalUnits,
        unitAdultCapacity: defaultCapacity.unitAdultCapacity,
        unitChildCapacity: defaultCapacity.unitChildCapacity,
        allowExtraCapacity: defaultCapacity.allowExtraCapacity,
        advanceBookingPeriod: 7,
        lastMinuteBookingPeriod: 24,
      };

      // Add specific defaults based on booking type
      if (
        recommendedBookingType === "TIME_SLOTS" ||
        recommendedBookingType === "FIXED_TIME"
      ) {
        baseConfig.slotDuration = 60; // 1 hour default
        baseConfig.bufferTime = 15; // 15 minutes buffer
        baseConfig.allowBackToBackBookings = false;
      }

      if (recommendedBookingType === "MULTI_DAY") {
        baseConfig.minimumBookingDays = 1;
        baseConfig.maximumBookingDays = 30;
        baseConfig.defaultCheckInTime = "14:00";
        baseConfig.defaultCheckOutTime = "11:00";
      }

      if (recommendedBookingType === "FLEXIBLE_HOURS") {
        baseConfig.slotDuration = 60; // Minimum 1 hour
        baseConfig.bufferTime = 480; // Maximum 8 hours
      }

      return baseConfig;
    };

    const getDefaultPriceConfig = (): PriceConfigDTO => {
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

      const baseConfig: PriceConfigDTO = {
        priceType: recommendedPriceType,
        allowAdvancePayment: false,
        requiresDeposit: false,
      };

      // Set default values based on price type
      switch (recommendedPriceType) {
        case "PER_PERSON":
          baseConfig.pricePerAdult = 0;
          baseConfig.pricePerChild = 0;
          break;
        case "PER_UNIT":
        case "PER_HOUR":
        case "PER_DAY":
        case "PER_NIGHT":
        case "PER_KM":
          baseConfig.pricePerUnit = 0;
          break;
        case "FIXED":
          baseConfig.fixedPrice = 0;
          break;
        case "HYBRID":
          baseConfig.fixedPrice = 0;
          baseConfig.pricePerAdult = 0;
          break;
      }

      return baseConfig;
    };

    const baseData: ServiceFormData = {
      serviceId: null,
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
      tabsSection: [],
      policySection: [],
      deletedImages: [],
      availableTimeDTOS: [],
      priceConfig: getDefaultPriceConfig(),
      bookingConfig: getDefaultBookingConfig(),
    };

    // Add service-type specific defaults
    switch (serviceType) {
      case "activity":
        return {
          ...baseData,
          activityType: "ADVENTURE" as ActivityType,
          activityDetails: "",
          safetyInstructions: "",
        } as ActivityFormData;
      case "transportation":
        return {
          ...baseData,
          vehicleCategory: "CAR" as VehicleType,
          fuelType: "PETROL" as FuelType,
          transmissionType: "MANUAL" as TransmissionType,
          airConditioned: false,
          driverIncluded: false,
        } as TransportFormData;
      case "accommodation":
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
      case "food-beverage":
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
      case "tour-guides":
        return {
          ...baseData,
          languages: [],
          tourGuideType: "NATIONAL" as TourGuideType,
        } as TourGuideFormData;
      default:
        return baseData;
    }
  };

  const [formData, setFormData] = useState<ServiceFormData>(
    () => initialData || initializeFormData()
  );

  // Synchronize local language state with form data for tour guides
  useEffect(() => {
    if (serviceType === "tour-guides" && formData) {
      const tourGuideData = formData as TourGuideFormData;
      if (tourGuideData.languages && tourGuideData.languages.length > 0) {
        setPreferredLanguages(tourGuideData.languages);
      }
    }
  }, [formData, serviceType]);

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

  // Load policies for all service types
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        console.log("Loading policies for service type:", serviceType);
        const policies = await fetchPoliciesByServiceType(
          serviceType || "activity"
        );
        console.log("Fetched policies:", policies);
        const policyOptions = policies.map((policy: any) => ({
          label: policy.heading,
          value: policy.id?.toString() || policy.heading,
        }));
        console.log("Policy options:", policyOptions);
        setPolicyOptions(policyOptions);
        setFullPolicyData(policies); // Store full policy data for later use
      } catch (error) {
        console.error("Error loading policies:", error);
      }
    };
    if (serviceType) {
      loadPolicies();
    }
  }, [serviceType]);

  // Handler functions
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBookingConfigChange = (config: BookingConfigDTO) => {
    handleInputChange("bookingConfig", config);
  };

  const handlePriceConfigChange = (config: PriceConfigDTO) => {
    handleInputChange("priceConfig", config);
  };

  const handleAvailableTimesChange = (availableTimes: AvailableTimeDTO[]) => {
    handleInputChange("availableTimeDTOS", availableTimes);
  };

  const handleLocationSelect = (locationData: LocationData | undefined) => {
    if (locationData) {
      handleInputChange("locations", [locationData]);
    } else {
      handleInputChange("locations", [
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
      ]);
    }
  };

  const handleLocationIdSelect = (locationId: number | null) => {
    if (formData.locations && formData.locations[0]) {
      handleInputChange("locations", [
        {
          ...formData.locations[0],
          locationId: locationId,
        },
      ]);
    }
  };

  // Handle guiding area selection for tour guides
  const handleGuidingAreaSelection = (selectedValues: string[]) => {
    const selectedAreas = guidingAreas.filter((area) =>
      selectedValues.includes(area.city)
    );
    setSelectedGuidingAreas(selectedAreas);
    handleInputChange("locations", selectedAreas);
  };

  // Handle tabs and policies changes
  const handleTabsChange = (tabs: TabData[]) => {
    // Convert TabData to TabSection for comparison
    const currentTabSections = tabs.map((tab) => ({
      id: tab.id,
      heading: tab.heading,
      content: tab.description,
    }));

    // Track deleted tabs (ones that exist in original but not in current)
    const currentTabIds = currentTabSections
      .map((tab) => tab.id)
      .filter((id) => id !== undefined);
    const deletedTabsFromOriginal = originalTabsSection.filter(
      (originalTab) => originalTab.id && !currentTabIds.includes(originalTab.id)
    );

    console.log("Tab deletion tracking:", {
      originalTabs: originalTabsSection,
      currentTabs: currentTabSections,
      currentTabIds,
      deletedTabsFromOriginal,
    });

    // Add to deletedTabs if not already there
    setDeletedTabs((prev) => {
      const existingDeletedIds = prev.map((tab) => tab.id);
      const newDeleted = deletedTabsFromOriginal.filter(
        (tab) => tab.id && !existingDeletedIds.includes(tab.id)
      );
      return [...prev, ...newDeleted];
    });

    setTabsSection(tabs);
    setFormData((prev) => ({
      ...prev,
      tabsSection: currentTabSections,
    }));
  };

  const handlePoliciesChange = (updatedPolicies: PolicyData[]) => {
    // Convert PolicyData to PolicySection for comparison
    const currentPolicySections = updatedPolicies.map((policy) => ({
      id: policy.id,
      heading: policy.heading,
      policy: policy.description,
    }));

    // Track deleted policies (ones that exist in original but not in current)
    const currentPolicyIds = currentPolicySections
      .map((policy) => policy.id)
      .filter((id) => id !== undefined);
    const deletedPoliciesFromOriginal = originalPolicySection.filter(
      (originalPolicy) =>
        originalPolicy.id && !currentPolicyIds.includes(originalPolicy.id)
    );

    console.log("Policy deletion tracking:", {
      originalPolicies: originalPolicySection,
      currentPolicies: currentPolicySections,
      currentPolicyIds,
      deletedPoliciesFromOriginal,
    });

    // Add to deletedPolicies if not already there
    setDeletedPolicies((prev) => {
      const existingDeletedIds = prev.map((policy) => policy.id);
      const newDeleted = deletedPoliciesFromOriginal.filter(
        (policy) => policy.id && !existingDeletedIds.includes(policy.id)
      );
      return [...prev, ...newDeleted];
    });

    setPolicySection(updatedPolicies);
    handleInputChange("policySection", currentPolicySections);
  };

  const handleMultiselectPolicyChange = (selectedValues: string[]) => {
    // Track removed policies from multiselect (predefined policies that were unselected)
    const removedPolicyIds = originalPreferredPolicies.filter(
      (originalId) => !selectedValues.includes(originalId)
    );

    // Track re-selected policies (ones that were previously deleted but now selected again)
    const reselectedPolicyIds = selectedValues.filter((selectedId) =>
      originalPreferredPolicies.includes(selectedId)
    );

    // Find the policy data for removed policies and add to deletedPolicies
    const removedPolicies = removedPolicyIds.map((policyId) => {
      const policyData = fullPolicyData.find(
        (policy) => policy.id?.toString() === policyId
      );
      return {
        id: parseInt(policyId, 10),
        heading: policyData?.heading || `Policy ${policyId}`,
        policy:
          policyData?.policy || policyData?.heading || `Policy ${policyId}`,
      };
    });

    console.log("Multiselect policy deletion tracking:", {
      originalPreferredPolicies,
      selectedValues,
      removedPolicyIds,
      reselectedPolicyIds,
      removedPolicies,
    });

    // Update deletedPolicies: add removed ones, remove re-selected ones
    setDeletedPolicies((prev) => {
      // Remove re-selected policies from deleted list
      let updated = prev.filter(
        (policy) => !reselectedPolicyIds.includes(policy.id?.toString() || "")
      );

      // Add newly removed policies if not already there
      const existingDeletedIds = updated.map((policy) => policy.id);
      const newDeleted = removedPolicies.filter(
        (policy) => policy.id && !existingDeletedIds.includes(policy.id)
      );

      return [...updated, ...newDeleted];
    });

    setPreferredPolicies(selectedValues);
    // Note: selectedPolicies are handled as references and may need special backend handling
  };

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

  // Get guiding area options for MultiSelect
  const guidingAreaOptions = useMemo(() => {
    return guidingAreas.map((area) => ({
      label: area.city,
      value: area.city,
    }));
  }, [guidingAreas]);

  // Combined existing and new images for display
  const displayImages = useMemo(() => {
    const existingImagesAsFiles = (existingImages || [])
      .filter(
        (img) =>
          img && img.id && !deletedImages.some((delImg) => delImg.id === img.id)
      )
      .map((img) => ({
        id: String(img.id),
        url: img.imageUrl,
        name: `Image ${img.id}`,
      }));

    return [...existingImagesAsFiles, ...images.serviceImages];
  }, [existingImages, deletedImages, images.serviceImages]);

  const handleImageDelete = (imageId: string) => {
    const existingImage = existingImages?.find(
      (img) => String(img.id) === imageId
    );
    if (existingImage) {
      setDeletedImages((prev) => [...prev, existingImage]);
    } else {
      setImages((prev) => ({
        ...prev,
        serviceImages: prev.serviceImages.filter((img) => img.id !== imageId),
      }));
    }
  };

  // Enhanced step validation
  const validateStep = (
    stepIndex: number
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (stepIndex) {
      case 0: // Service Info & Images
        if (!formData.serviceName.trim()) {
          errors.push("Service name is required");
        } else if (formData.serviceName.trim().length < 3) {
          errors.push("Service name must be at least 3 characters long");
        }

        // Service type specific validations
        if (serviceType === "activity") {
          const activityData = formData as ActivityFormData;
          if (!activityData.activityType) {
            errors.push("Activity type is required");
          }
        } else if (serviceType === "transportation") {
          const transportData = formData as TransportFormData;
          if (!transportData.vehicleCategory) {
            errors.push("Vehicle type is required");
          }
          if (!transportData.fuelType) {
            errors.push("Fuel type is required");
          }
          if (!transportData.transmissionType) {
            errors.push("Transmission type is required");
          }
        } else if (serviceType === "accommodation") {
          const accommodationData = formData as AccommodationFormData;
          if (!accommodationData.accommodationType) {
            errors.push("Accommodation type is required");
          }
        } else if (serviceType === "food-beverage") {
          const foodBeverageData = formData as FoodBeverageFormData;
          if (!foodBeverageData.foodAndBeverageType) {
            errors.push("Food & beverage type is required");
          }
        } else if (serviceType === "tour-guides") {
          const tourGuideData = formData as TourGuideFormData;
          if (!tourGuideData.tourGuideType) {
            errors.push("Guide type is required");
          }
          if (!preferredLanguages || preferredLanguages.length === 0) {
            errors.push("At least one language must be selected");
          }
        }
        break;

      case 1: // Booking & Pricing
        // Use the new validation utilities
        const serviceTypeEnum = getServiceTypeEnum();

        // Validate booking configuration
        const bookingValidation = validateBookingConfig(
          formData.bookingConfig,
          serviceTypeEnum
        );
        if (!bookingValidation.isValid) {
          errors.push(...bookingValidation.errors.map((err) => err.message));
        }

        // Validate price configuration
        const priceValidation = validatePriceConfig(
          formData.priceConfig,
          serviceTypeEnum
        );
        if (!priceValidation.isValid) {
          errors.push(...priceValidation.errors.map((err) => err.message));
        }
        break;

      case 2: // Location, Contact & Schedule
        if (!formData.contactNo.trim()) {
          errors.push("Phone number is required");
        } else {
          // Basic phone number validation
          const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
          if (!phoneRegex.test(formData.contactNo.trim())) {
            errors.push("Please enter a valid phone number");
          }
        }

        // Location validation (except for tour guides)
        if (serviceType !== "tour-guides") {
          if (!formData.locations?.[0]?.formattedAddress?.trim()) {
            errors.push("Service location is required");
          }
        }

        // At least one operating day should be configured
        if (
          !formData.availableTimeDTOS ||
          formData.availableTimeDTOS.length === 0
        ) {
          errors.push("Please configure at least one operating day");
        } else {
          // Check if at least one day has valid opening hours
          const hasValidDay = formData.availableTimeDTOS.some(
            (day) =>
              !day.isClosed && day.openTime && day.closeTime && !day.is24Hours
          );
          const has24HourDay = formData.availableTimeDTOS.some(
            (day) => !day.isClosed && day.is24Hours
          );
          if (!hasValidDay && !has24HourDay) {
            errors.push(
              "Please set opening and closing times for at least one active day"
            );
          }
        }
        break;

      default:
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const isStepValid = (stepIndex: number): boolean => {
    return validateStep(stepIndex).isValid;
  };

  const getStepValidationErrors = (stepIndex: number): string[] => {
    return validateStep(stepIndex).errors;
  };

  // Field validation helpers
  const getFieldError = (fieldName: string): string | undefined => {
    if (!attemptedSteps.has(currentStep)) return undefined;

    const stepErrors = getStepValidationErrors(currentStep);
    return stepErrors.find((error) =>
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  const handleNext = () => {
    const currentStepValidation = validateStep(currentStep);

    if (!currentStepValidation.isValid) {
      // Mark this step as attempted to show validation errors
      setAttemptedSteps((prev) => new Set([...prev, currentStep]));

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (step: number) => {
    // Allow navigation to previous steps
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    // For forward navigation, validate all steps between current and target
    let canNavigate = true;
    for (let i = currentStep; i < step; i++) {
      if (!isStepValid(i)) {
        canNavigate = false;
        // Mark attempted steps to show validation errors
        setAttemptedSteps((prev) => new Set([...prev, i]));
        break;
      }
    }

    if (canNavigate) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = () => {
    // Final validation of all steps
    const allErrors: string[] = [];
    for (let i = 0; i < steps.length; i++) {
      const stepValidation = validateStep(i);
      if (!stepValidation.isValid) {
        allErrors.push(`Step ${i + 1}: ${stepValidation.errors.join(", ")}`);
        setAttemptedSteps((prev) => new Set([...prev, i]));
      }
    }

    if (allErrors.length > 0) {
      // Show validation errors and navigate to first invalid step
      const firstInvalidStep = steps.findIndex(
        (_, index) => !isStepValid(index)
      );
      if (firstInvalidStep !== -1) {
        setCurrentStep(firstInvalidStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    let updatedData: ServiceFormData = {
      ...formData,
      deletedImages: deletedImages,
      deletedTabs: deletedTabs,
      deletedPolicies: deletedPolicies,
      // Add tabs and policies to all service types
      tabsSection: tabsSection.map((tab) => ({
        id: tab.id,
        heading: tab.heading,
        content: tab.description,
      })),
      policySection: [
        // Include selected existing policies with their IDs
        ...preferredPolicies.map((policyId) => {
          const existingPolicy = fullPolicyData.find(
            (policy) => policy.id?.toString() === policyId
          );
          return {
            id: existingPolicy?.id || parseInt(policyId, 10),
            heading: existingPolicy?.heading || `Policy ${policyId}`,
            policy:
              existingPolicy?.policy ||
              existingPolicy?.heading ||
              `Policy ${policyId}`,
          };
        }),
        // Include new custom policies with null IDs
        ...policySection.map((policy) => ({
          id: null, // New policies always have null ID
          heading: policy.heading,
          policy: policy.description,
        })),
      ],
    };

    if (serviceType === "tour-guides") {
      updatedData = {
        ...updatedData,
        locations: selectedGuidingAreas,
        languages: preferredLanguages,
      } as TourGuideFormData;
    }

    console.log("Form submission data:", {
      selectedPolicies: preferredPolicies,
      customPolicies: policySection,
      finalPolicySection: updatedData.policySection,
      deletedTabs: deletedTabs,
      deletedPolicies: deletedPolicies,
    });

    onSubmit(updatedData, images);
  };

  // Render step content
  const renderStepContent = () => {
    const currentStepErrors = attemptedSteps.has(currentStep)
      ? getStepValidationErrors(currentStep)
      : [];

    return (
      <div>
        {/* Validation Errors Display */}
        {currentStepErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors to continue:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    {currentStepErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        {renderCurrentStepContent()}
      </div>
    );
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0: // Service Information & Images
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Service Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Service Information
              </h3>

              <InputField
                label="Service Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter service name"
                required
                error={getFieldError("service name")}
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
                    error={getFieldError("activity type")}
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
                    <CheckboxField
                      label="Laundry Service"
                      checked={
                        (formData as AccommodationFormData).laundryService
                      }
                      onChange={(value) =>
                        handleInputChange("laundryService", value)
                      }
                    />
                    <CheckboxField
                      label="Room Service"
                      checked={(formData as AccommodationFormData).roomService}
                      onChange={(value) =>
                        handleInputChange("roomService", value)
                      }
                    />
                    <CheckboxField
                      label="Gym Access"
                      checked={(formData as AccommodationFormData).gymAccess}
                      onChange={(value) =>
                        handleInputChange("gymAccess", value)
                      }
                    />
                    <CheckboxField
                      label="Spa Services"
                      checked={(formData as AccommodationFormData).spaServices}
                      onChange={(value) =>
                        handleInputChange("spaServices", value)
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
                    <CheckboxField
                      label="Live Music"
                      checked={(formData as FoodBeverageFormData).liveMusic}
                      onChange={(value) =>
                        handleInputChange("liveMusic", value)
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
                    onChange={(values) => {
                      setPreferredLanguages(values);
                      handleInputChange("languages", values);
                    }}
                    placeholder="Select languages you speak"
                    required
                  />
                  {guidingAreaOptions.length > 0 && (
                    <MultiSelectField
                      label="Guiding Areas"
                      options={guidingAreaOptions}
                      value={selectedGuidingAreas.map((area) => area.city)}
                      onChange={handleGuidingAreaSelection}
                      icon={<Globe size={16} />}
                      placeholder="Select areas you can guide"
                    />
                  )}
                </>
              )}
            </div>

            {/* Right Column - Images */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Service Images
              </h3>
              <div className="text-sm text-gray-600 mb-4">
                Upload high-quality images of your service to attract more
                customers.
              </div>
              <ImageUploadComponent
                images={displayImages}
                onImagesChange={(newImages) => {
                  const genuinelyNewImages = newImages.filter(
                    (newImg) =>
                      !displayImages.some(
                        (existing) => existing.id === newImg.id
                      )
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
            </div>
          </div>
        );

      case 1: // Booking & Pricing Configuration
        const serviceHints = getServiceTypeHints(getServiceTypeEnum());

        return (
          <div className="space-y-8">
            {/* Service Type Hints */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">
                    Configuration Guide for{" "}
                    {serviceType
                      ? serviceType.charAt(0).toUpperCase() +
                        serviceType.slice(1).replace("-", " ")
                      : "Service"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Units:</span>{" "}
                      {serviceHints.units}
                    </div>
                    <div>
                      <span className="font-medium">Booking:</span>{" "}
                      {serviceHints.bookingType}
                    </div>
                    <div>
                      <span className="font-medium">Pricing:</span>{" "}
                      {serviceHints.priceType}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Booking Configuration */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Configuration
                </h3>
                <BookingConfigurationForm
                  bookingConfig={formData.bookingConfig}
                  serviceType={getServiceTypeEnum()}
                  onChange={handleBookingConfigChange}
                  priceConfig={formData.priceConfig}
                  onPriceConfigChange={handlePriceConfigChange}
                />
              </div>

              {/* Right Column - Price Configuration */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Price Configuration
                </h3>
                <PriceConfigurationForm
                  priceConfig={formData.priceConfig}
                  serviceType={getServiceTypeEnum()}
                  onChange={handlePriceConfigChange}
                  bookingConfig={formData.bookingConfig}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Location, Contact & Schedule
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Location & Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location & Contact
              </h3>

              <InputField
                label="Phone Number"
                value={formData.contactNo}
                onChange={(value) => handleInputChange("contactNo", value)}
                type="tel"
                placeholder="+94 xxx xxx xxxx"
                required
                error={getFieldError("phone")}
              />

              {serviceType !== "tour-guides" && (
                <div className="h-[400px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Location
                  </label>
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
                    selectedCoordinates={
                      formData.locations?.[0]?.latitude &&
                      formData.locations?.[0]?.longitude
                        ? {
                            latitude: formData.locations[0].latitude,
                            longitude: formData.locations[0].longitude,
                          }
                        : undefined
                    }
                    showBusinessLocationOption={true}
                    required
                    error={getFieldError("service location")}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Available Times */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Operating Hours & Schedule
              </h3>
              <AvailableTimeConfiguration
                availableTimes={formData.availableTimeDTOS}
                onChange={handleAvailableTimesChange}
              />
            </div>
          </div>
        );

      case 3: // Additional Information & Policies
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Tabs Section */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
              <ExpandableSectionComponent
                title="Additional Information Tabs"
                items={tabsSection}
                onItemsChange={handleTabsChange}
                addButtonText="Add Tab"
                itemName="Tab"
              />
            </div>

            {/* Right Column - Policies Section */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
              <div className="mb-6">
                {policyOptions.length > 0 ? (
                  <MultiSelectField
                    label="Available Policies"
                    options={policyOptions}
                    value={preferredPolicies}
                    onChange={handleMultiselectPolicyChange}
                    icon={<Globe size={16} />}
                    placeholder="Select existing policies"
                  />
                ) : (
                  <div className="text-sm text-gray-600 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Policies
                    </label>
                    <p className="text-gray-500 italic">
                      No existing policies found for {serviceType} services. You
                      can create custom policies below.
                    </p>
                  </div>
                )}
              </div>
              <ExpandableSectionComponent
                title="Custom Policies"
                items={policySection}
                onItemsChange={handlePoliciesChange}
                addButtonText="Add Policy"
                itemName="Policy"
              />
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <StepWizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmit}
      isNextDisabled={!isStepValid(currentStep)}
      isSubmitDisabled={
        !steps
          .filter((step) => step.isRequired)
          .every((_, index) => isStepValid(index))
      }
      submitButtonText={isEditMode ? "Update Service" : "Create Service"}
      isSubmitting={isSubmitting}
    >
      {renderStepContent()}
    </StepWizard>
  );
};

export default StepWizardServiceForm;
