import React, { useEffect, useState, useMemo } from "react";
import { Globe } from "lucide-react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import ImageUploadComponent from "@/components/forms/ImageUploadComponent";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import MultiSelectField from "./forms/MultiSelectField";
import TextAreaField from "./forms/TextAreaField";
import CounterInput from "./forms/CounterInput";
import CheckboxField from "./forms/CheckboxField";
import { useAuth } from "@/hooks/useAuth";

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
  PriceType,
  FuelType,
  TransmissionType,
  FoodBeverageType,
} from "@/types/serviceTypes";
import { fetchAllGuidingAreas } from "@/services/guideService";
import { fetchPoliciesByServiceType } from "@/services/services";

const NewServiceForm: React.FC<ServiceFormProps> = ({
  serviceType,
  initialImages,
  existingImages, // Add existingImages prop
  initialData,
  onSubmit,
}) => {
  const { user } = useAuth(); // Move useAuth to component level

  const [images, setImages] = useState<ImageFiles>({
    // In edit mode, existing images are handled separately, only store new images here
    serviceImages:
      existingImages && existingImages.length > 0 ? [] : initialImages || [],
  });

  // Track which existing images to delete
  const [deletedImages, setDeletedImages] = useState<ImageData[]>([]);

  // Track which existing tabs and policies to delete
  const [deletedTabs, setDeletedTabs] = useState<TabSection[]>([]);
  const [deletedPolicies, setDeletedPolicies] = useState<PolicySection[]>([]);

  // Combine existing and new images for display in ImageUploadComponent
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
        // No file property for existing images
      }));

    const result = [...existingImagesAsFiles, ...images.serviceImages];
    console.log("displayImages result:", result);
    console.log("existingImages:", existingImages);
    console.log("deletedImages:", deletedImages);
    return result;
  }, [existingImages, deletedImages, images.serviceImages]);

  const handleImageDelete = (imageId: string) => {
    console.log("Deleting image with ID:", imageId);
    if (imageId.startsWith("existing-")) {
      // This is an existing image, add it to delete list
      const originalIdStr = imageId.replace("existing-", "");
      console.log("Original ID string:", originalIdStr);

      if (originalIdStr === "undefined" || !originalIdStr) {
        console.error("Invalid image ID - originalId is undefined or empty");
        return;
      }

      const originalId = parseInt(originalIdStr);
      if (isNaN(originalId)) {
        console.error("Invalid image ID - could not parse:", originalIdStr);
        return;
      }

      const existingImage = existingImages?.find(
        (img) => img.id === originalId
      );
      if (existingImage) {
        console.log("Adding existing image to delete list:", existingImage);
        setDeletedImages((prev) => [...prev, existingImage]);
      } else {
        console.error("Could not find existing image with ID:", originalId);
      }
    } else {
      // This is a new image, remove it from serviceImages
      console.log("Removing new image from serviceImages");
      setImages((prev) => ({
        ...prev,
        serviceImages: prev.serviceImages.filter((img) => img.id !== imageId),
      }));
    }

    // Update selected image index if necessary
    const currentImages = displayImages;
    const imageIndex = currentImages.findIndex((img) => img.id === imageId);
    if (imageIndex !== -1 && selectedImageIndex >= imageIndex) {
      const newLength = currentImages.length - 1;
      if (newLength === 0) {
        setSelectedImageIndex(0);
      } else if (selectedImageIndex >= newLength) {
        setSelectedImageIndex(newLength - 1);
      }
    }
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

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

  const [policyOptions, setPolicyOptions] = useState<OptionType[]>([]);
  const [preferredPolicies, setPreferredPolicies] = useState<string[]>([]);
  const [guidingAreas, setGuidingAreas] = useState<LocationData[]>([]);
  const [selectedGuidingAreas, setSelectedGuidingAreas] = useState<
    LocationData[]
  >([]);

  // Initialize form data based on service type
  const initializeFormData = (): ServiceFormData => {
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
      status: true,
      price: 0,
      priceType: "FIXED" as PriceType,
      tabsSection: [{ id: null, heading: "", content: "" }],
      policySection: [{ id: null, heading: "", policy: "" }],
      deletedImages: [],
      deletedTabs: [],
      deletedPolicies: [],
      availabilitySlots: [
  { dayOfWeek: "Monday", openTime: "", closeTime: "" },
  { dayOfWeek: "Tuesday", openTime: "", closeTime: "" },
  { dayOfWeek: "Wednesday", openTime: "", closeTime: "" },
  { dayOfWeek: "Thursday", openTime: "", closeTime: "" },
  { dayOfWeek: "Friday", openTime: "", closeTime: "" },
  { dayOfWeek: "Saturday", openTime: "", closeTime: "" },
  { dayOfWeek: "Sunday", openTime: "", closeTime: "" },
],
    };

    if (serviceType === "activity") {
      return {
        ...baseData,
        activityType: "ADVENTURE" as ActivityType,
        activityDetails: "",
        safetyInstructions: "",
        duration: "", // e.g., "2 hours", "1 day"
      } as ActivityFormData;
    } else if (serviceType === "transportation") {
      return {
        ...baseData,
        vehicleCategory: "CAR" as VehicleType,
        vehicleCapacity: 1,
        vehicleQty: 1,
        fuelType: "PETROL" as FuelType,
        transmissionType: "MANUAL" as TransmissionType,
        airConditioned: false,
        driverIncluded: false,
      } as TransportFormData;
    } else if (serviceType === "accommodation") {
      return {
        ...baseData,
        accommodationType: "HOTEL" as AccommodationType,
        numberOfRooms: 1,
        maxGuests: 1,
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
        openHours: "",
        cuisineType: "",
        vegetarianOptions: false,
        halalCertified: false,
        alcoholServed: false,
        outdoorSeating: false,
        liveMusic: false,
      } as FoodBeverageFormData;
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

  console.log("NewServiceForm initialData:", initialData);
  console.log(
    "NewServiceForm initialData.policySection:",
    initialData?.policySection
  );

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    (initialData?.policySection || [{ heading: "", policy: "" }]).map(
      (policy) => {
        console.log("Initializing policy:", policy);
        return {
          id: "id" in policy && policy.id !== null ? policy.id : null,
          heading: policy.heading,
          description: policy.policy || "",
          isExpanded: true,
        };
      }
    )
  );

  const [capacity, setCapacity] = useState(
    (formData as TransportFormData).vehicleCapacity || 1
  );
  const [count, setCount] = useState(
    (formData as TransportFormData).vehicleQty || 1
  );
  const [numberOfRooms, setNumberOfRooms] = useState(
    (formData as AccommodationFormData).numberOfRooms || 1
  );
  const [maxGuests, setMaxGuests] = useState(
    (formData as AccommodationFormData).maxGuests || 1
  );

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const policies = await fetchPoliciesByServiceType(serviceType ?? "");
        console.log("Policies:", policies);

        const options = policies.map((p: any) => ({
          label: p.heading,
          value: p.id.toString(),
          content: p.policy,
        }));

        setPolicyOptions(options);
      } catch (error) {
        console.error("Failed to load policies", error);
      }
    };
    loadPolicies();
  }, []);

  useEffect(() => {
    // Fetch guiding areas for tour guides
    if (serviceType === "tour-guides") {
      const loadGuidingAreas = async () => {
        try {
          const areas = await fetchAllGuidingAreas();
          console.log("Guiding areas:", areas);
          setGuidingAreas(areas);
        } catch (error) {
          console.error("Failed to load guiding areas", error);
        }
      };
      loadGuidingAreas();
    }
  }, [serviceType]);

  useEffect(() => {
    // Only filter and set policies if we have policy options loaded
    if (policyOptions.length > 0) {
      // Get policies from multiselect (existing policies with IDs)
      const selectedPolicyObjects = policyOptions
        .filter((option) => preferredPolicies.includes(option.value))
        .map((option) => ({
          id: parseInt(option.value),
          heading: option.label,
          description: option.content || "",
          isExpanded: true,
        }));

      // Keep any manually added policies (those with null IDs) that aren't from multiselect
      const manualPolicies = policySection.filter(
        (policy) => policy.id === null
      );

      // Combine selected policies from multiselect with manual policies
      const combinedPolicies = [...selectedPolicyObjects, ...manualPolicies];

      console.log(
        "Setting policies from preferredPolicies:",
        selectedPolicyObjects
      );
      console.log("Manual policies:", manualPolicies);
      console.log("Combined policies:", combinedPolicies);

      setPolicySection(combinedPolicies);
      const backendPolicies: PolicySection[] = combinedPolicies.map(
        ({ id, heading, description }) => ({
          id: id || null,
          heading,
          policy: description,
        })
      );
      setFormData((prev) => ({
        ...prev,
        policySection: backendPolicies,
      }));
    }
  }, [preferredPolicies, policyOptions]);

  // Initialize preferredPolicies when editing a service
  useEffect(() => {
    if (
      initialData?.policySection &&
      Array.isArray(initialData.policySection)
    ) {
      const existingPolicyIds = initialData.policySection
        .filter((policy) => policy.id !== null)
        .map((policy) => policy.id!.toString());
      console.log(
        "Setting preferredPolicies to existing policy IDs:",
        existingPolicyIds
      );
      if (existingPolicyIds.length > 0) {
        setPreferredPolicies(existingPolicyIds);
      }
    }
  }, [initialData]);

  // Initialize selectedGuidingAreas for tour guides when editing
  useEffect(() => {
    if (serviceType === "tour-guides" && initialData && initialData.locations) {
      console.log(
        "Initializing selectedGuidingAreas with:",
        initialData.locations
      );
      // For tour guides, all locations in the array are service areas
      // They all have locationIds and represent the areas where the guide operates
      setSelectedGuidingAreas(initialData.locations);
      console.log("Set selectedGuidingAreas to:", initialData.locations);
    }
  }, [serviceType, initialData]);

  const handleInputChange = (
    field: keyof (ServiceFormData &
      ActivityFormData &
      TransportFormData &
      AccommodationFormData &
      FoodBeverageFormData &
      TourGuideFormData),
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (locationData: LocationData | undefined) => {
    if (!locationData) {
      // Handle case where business location is used (locationData is undefined)
      // Don't update locations array here, it will be handled by handleLocationIdSelect
      return;
    }

    setSelectedCoordinates({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });

    // Update the locations array with the new location data (locationId will be null)
    setFormData((prev) => ({
      ...prev,
      locations: [locationData],
    }));
  };

  const handleLocationIdSelect = (locationId: number) => {
    console.log("handleLocationIdSelect called with locationId:", locationId);

    if (locationId === 0) {
      // Clear location when unchecked
      setFormData((prev) => ({
        ...prev,
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
      }));
      setSelectedCoordinates(undefined);
      return;
    }

    // Use business location - create LocationData with the business location's locationId
    if (user?.location) {
      const businessLocation = user.location as any;
      const locationData: LocationData = {
        locationId: businessLocation.locationId || locationId,
        formattedAddress: businessLocation.formattedAddress || "",
        city: businessLocation.city || "",
        district: businessLocation.district || "",
        province: businessLocation.province || "",
        country: businessLocation.country || "",
        postalCode: businessLocation.postalCode || "",
        latitude: businessLocation.latitude || 0,
        longitude: businessLocation.longitude || 0,
      };

      console.log(
        "Setting location data with locationId:",
        locationData.locationId
      );
      console.log("Full location data:", locationData);

      setFormData((prev) => ({
        ...prev,
        locations: [locationData],
      }));

      setSelectedCoordinates({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });
    }
  };

  const handleTabsChange = (tabs: TabData[]) => {
    // Find deleted tabs by comparing current tabs with new tabs
    const currentTabIds = tabs.map((tab) => tab.id);
    const deletedTabsFromCurrent = tabsSection.filter(
      (currentTab) =>
        currentTab.id !== null &&
        typeof currentTab.id === "number" &&
        !currentTabIds.includes(currentTab.id)
    );

    // Convert deleted tabs to TabSection format and add to delete list
    const deletedTabSections: TabSection[] = deletedTabsFromCurrent.map(
      (tab) => ({
        id: tab.id as number,
        heading: tab.heading,
        content: tab.description,
      })
    );

    // Add newly deleted tabs to the delete list (avoid duplicates)
    setDeletedTabs((prev) => {
      const existingDeleteIds = prev.map((tab) => tab.id);
      const newDeletes = deletedTabSections.filter(
        (tab) => !existingDeleteIds.includes(tab.id)
      );
      return [...prev, ...newDeletes];
    });

    setTabsSection(tabs);
    const backendTabs: TabSection[] = tabs.map(
      ({ id, heading, description }) => ({
        id: id || null, // Keep existing ID or set null for new tabs
        heading,
        content: description,
      })
    );
    setFormData((prev) => ({
      ...prev,
      tabsSection: backendTabs,
    }));
  };

  // Custom handler for multiselect policy changes
  const handleMultiselectPolicyChange = (selectedPolicyIds: string[]) => {
    console.log("Multiselect policy change:", selectedPolicyIds);
    console.log("Previous preferredPolicies:", preferredPolicies);

    // Find newly removed policies (were selected before, not selected now)
    const removedPolicyIds = preferredPolicies.filter(
      (id) => !selectedPolicyIds.includes(id)
    );

    // Find newly added policies (not selected before, selected now)
    const addedPolicyIds = selectedPolicyIds.filter(
      (id) => !preferredPolicies.includes(id)
    );

    console.log("Removed policy IDs:", removedPolicyIds);
    console.log("Added policy IDs:", addedPolicyIds);

    // Handle removed policies - add them to deletion tracking
    if (removedPolicyIds.length > 0) {
      const removedPolicies = policySection.filter(
        (policy) =>
          policy.id !== null && removedPolicyIds.includes(policy.id.toString())
      );

      const deletedPolicySections: PolicySection[] = removedPolicies.map(
        (policy) => ({
          id: policy.id as number,
          heading: policy.heading,
          policy: policy.description,
        })
      );

      // Add to deleted policies list
      setDeletedPolicies((prev) => {
        const existingDeleteIds = prev.map((policy) => policy.id);
        const newDeletes = deletedPolicySections.filter(
          (policy) => !existingDeleteIds.includes(policy.id)
        );
        console.log(
          "Adding removed multiselect policies to deleted list:",
          newDeletes
        );
        return [...prev, ...newDeletes];
      });
    }

    // Update the preferredPolicies state
    setPreferredPolicies(selectedPolicyIds);
  };

  const handlePoliciesChange = (policies: PolicyData[]) => {
    console.log("handlePoliciesChange called with:", policies);

    // Find deleted policies by comparing current policies with new policies
    const currentPolicyIds = policies.map((policy) => policy.id);
    const deletedPoliciesFromCurrent = policySection.filter(
      (currentPolicy) =>
        currentPolicy.id !== null &&
        typeof currentPolicy.id === "number" &&
        !currentPolicyIds.includes(currentPolicy.id)
    );

    console.log("Deleted policies from current:", deletedPoliciesFromCurrent);

    // Convert deleted policies to PolicySection format and add to delete list
    const deletedPolicySections: PolicySection[] =
      deletedPoliciesFromCurrent.map((policy) => ({
        id: policy.id as number,
        heading: policy.heading,
        policy: policy.description,
      }));

    // Add newly deleted policies to the delete list (avoid duplicates)
    setDeletedPolicies((prev) => {
      const existingDeleteIds = prev.map((policy) => policy.id);
      const newDeletes = deletedPolicySections.filter(
        (policy) => !existingDeleteIds.includes(policy.id)
      );
      console.log("Adding to deleted policies:", newDeletes);
      return [...prev, ...newDeletes];
    });

    // Update preferredPolicies to remove any policies that were deleted from multiselect options
    const deletedMultiselectPolicyIds = deletedPoliciesFromCurrent
      .filter((policy) => policy.id !== null)
      .map((policy) => policy.id!.toString());

    if (deletedMultiselectPolicyIds.length > 0) {
      setPreferredPolicies((prev) =>
        prev.filter((id) => !deletedMultiselectPolicyIds.includes(id))
      );
    }

    setPolicySection(policies);
    const backendPolicies: PolicySection[] = policies.map(
      ({ id, heading, description }) => ({
        id: id || null, // Keep existing ID or set null for new policies
        heading,
        policy: description,
      })
    );
    setFormData((prev) => ({
      ...prev,
      policySection: backendPolicies,
    }));
  };

  const handleSubmit = () => {
    console.log("=== FORM SUBMISSION ===");
    console.log("Current policySection:", policySection);
    console.log("Deleted policies:", deletedPolicies);
    console.log("Preferred policies (multiselect):", preferredPolicies);

    let updatedData: ServiceFormData = {
      ...formData,
      deletedImages: deletedImages,
      deletedTabs: deletedTabs,
      deletedPolicies: deletedPolicies,
    };

    console.log("Form Data Before Updation:", updatedData);

    // Update specific fields based on service type
    if (serviceType === "tour-guides") {
      updatedData = {
        ...updatedData,
        locations: selectedGuidingAreas, // All selected areas are the locations for tour guides
        languages: preferredLanguages,
        tourGuideType: (formData as TourGuideFormData).tourGuideType,
      } as TourGuideFormData;
    } else if (serviceType === "transportation") {
      updatedData = {
        ...updatedData,
        vehicleCapacity: capacity,
        vehicleQty: count,
      } as TransportFormData;
    } else if (serviceType === "accommodation") {
      updatedData = {
        ...updatedData,
        numberOfRooms: numberOfRooms,
        maxGuests: maxGuests,
      } as AccommodationFormData;
    }

    console.log("Final form data locations:", updatedData.locations);
    console.log("Submitting updated data:", updatedData);
    console.log("Images to delete:", deletedImages);
    console.log("Tabs to delete:", deletedTabs);
    console.log("Policies to delete:", deletedPolicies);

    onSubmit(updatedData, images);
  };

  // Handle guiding area selection for tour guides
  const handleGuidingAreaSelection = (selectedValues: string[]) => {
    console.log("Selected district values:", selectedValues);
    console.log("Available guiding areas:", guidingAreas);

    const selectedAreas = guidingAreas.filter((area) =>
      selectedValues.includes(area.district)
    );

    console.log("Filtered selected areas:", selectedAreas);
    setSelectedGuidingAreas(selectedAreas);
  };

  // Get guiding area options for MultiSelect
  const getGuidingAreaOptions = (): OptionType[] => {
    return guidingAreas.map((area) => ({
      label: area.district,
      value: area.district,
    }));
  };

  // Get selected guiding area values
  const getSelectedGuidingAreaValues = (): string[] => {
    return selectedGuidingAreas.map((area) => area.district);
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "si", label: "Sinhala" },
    { value: "ta", label: "Tamil" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "es", label: "Spanish" },
    { value: "zh", label: "Chinese" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Form Container */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[800px]">
          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            {/* Image Upload - Fixed Height */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                Service Images
              </h3>

              {/* New Images Upload Component */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  {existingImages && existingImages.length > 0
                    ? "Add New Images"
                    : "Upload Images"}
                </h4>
                <ImageUploadComponent
                  images={displayImages}
                  onImagesChange={(allImages) => {
                    // Extract only the truly new images that weren't in the original list
                    const currentDisplayImages = displayImages;
                    const genuinelyNewImages = allImages.filter(
                      (newImg) =>
                        !currentDisplayImages.some(
                          (existing) => existing.id === newImg.id
                        )
                    );

                    // Only add genuinely new images to serviceImages
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
                  selectedImageIndex={selectedImageIndex}
                  onSelectedImageChange={setSelectedImageIndex}
                  onImageDelete={handleImageDelete} // Use custom delete handler
                />
              </div>
            </div>

            {/* Contact Information - Fixed Height */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                Contact Details
              </h3>
              <InputField
                label="Phone Number"
                value={formData.contactNo}
                onChange={(value) => handleInputChange("contactNo", value)}
                type="tel"
                placeholder="+94 xxx xxx xxxx"
                required
              />
            </div>

            {/* Tabs and Policies - Flexible Height */}
            <div className="flex-1 space-y-8">
              <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
                <ExpandableSectionComponent
                  title="Tabs"
                  items={tabsSection}
                  onItemsChange={handleTabsChange}
                  addButtonText="Add Tab"
                  itemName="Tab"
                />
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
                {(serviceType === "activity" ||
                  serviceType === "transportation" ||
                  serviceType === "accommodation" ||
                  serviceType === "food-beverage" ||
                  serviceType === "tour-guides") && (
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

          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            {/* Map Component - Fixed Height */}
            {(serviceType === "activity" ||
              serviceType === "transportation" ||
              serviceType === "accommodation" ||
              serviceType === "food-beverage") && (
              <div className="bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100 h-[400px]">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                  Location
                </h3>
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
            )}

            {/* Service Information - Flexible Height */}
            <div className="flex-1 bg-gradient-to-r from-primary-50 to-primary-50 p-4 rounded-xl border border-primary-100">
              {/* Activity Service Form */}
              {serviceType === "activity" && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                    Activity Information
                  </h3>
                  <div className="space-y-5">
                    <InputField
                      label="Activity Name"
                      value={formData.serviceName}
                      onChange={(value) =>
                        handleInputChange("serviceName", value)
                      }
                      placeholder="Enter activity name"
                      required
                    />
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
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Price"
                        value={formData.price.toString()}
                        onChange={(value) =>
                          handleInputChange("price", Number(value))
                        }
                        placeholder="Enter price"
                        type="number"
                      />
                      <SelectField
                        label="Price Type"
                        options={[
                          { value: "FIXED", label: "Fixed Price" },
                          { value: "PER_PERSON", label: "Per Person" },
                          { value: "PER_HOUR", label: "Per Hour" },
                          { value: "PER_DAY", label: "Per Day" },
                        ]}
                        value={formData.priceType}
                        onChange={(value) =>
                          handleInputChange("priceType", value)
                        }
                        required
                      />
                    </div>
                    <InputField
                      label="Duration (e.g., 2 hours, 1.5 hours)"
                      type="text"
                      value={(formData as ActivityFormData).duration || ""}
                      onChange={(value) => handleInputChange("duration", value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Transportation Service Form */}
              {serviceType === "transportation" && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                    Transportation Information
                  </h3>
                  <div className="space-y-5">
                    <InputField
                      label="Service Name"
                      value={formData.serviceName}
                      onChange={(value) =>
                        handleInputChange("serviceName", value)
                      }
                      placeholder="Enter transport service name"
                      required
                    />
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
                        onChange={(value) =>
                          handleInputChange("fuelType", value)
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Vehicle Capacity
                        </label>
                        <CounterInput
                          value={capacity}
                          onChange={setCapacity}
                          min={1}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Number of Vehicles
                        </label>
                        <CounterInput
                          value={count}
                          onChange={setCount}
                          min={1}
                          max={20}
                        />
                      </div>
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
                        onChange={(value: boolean) =>
                          handleInputChange("airConditioned", value)
                        }
                      />
                      <CheckboxField
                        label="Driver Included"
                        checked={(formData as TransportFormData).driverIncluded}
                        onChange={(value: boolean) =>
                          handleInputChange("driverIncluded", value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Price"
                        value={formData.price.toString()}
                        onChange={(value) =>
                          handleInputChange("price", Number(value))
                        }
                        placeholder="Enter price"
                        type="number"
                      />
                      <SelectField
                        label="Price Type"
                        options={[
                          { value: "FIXED", label: "Fixed Price" },
                          { value: "PER_KM", label: "Per KM" },
                          { value: "PER_HOUR", label: "Per Hour" },
                          { value: "PER_DAY", label: "Per Day" },
                        ]}
                        value={formData.priceType}
                        onChange={(value) =>
                          handleInputChange("priceType", value)
                        }
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Accommodation Service Form */}
              {serviceType === "accommodation" && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                    Accommodation Information
                  </h3>
                  <div className="space-y-5">
                    <InputField
                      label="Accommodation Name"
                      value={formData.serviceName}
                      onChange={(value) =>
                        handleInputChange("serviceName", value)
                      }
                      placeholder="Enter accommodation name"
                      required
                    />
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
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Number of Rooms
                        </label>
                        <CounterInput
                          value={numberOfRooms}
                          onChange={setNumberOfRooms}
                          min={1}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Maximum Guests
                        </label>
                        <CounterInput
                          value={maxGuests}
                          onChange={setMaxGuests}
                          min={1}
                          max={200}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
                        Amenities
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <CheckboxField
                          label="Parking Available"
                          checked={
                            (formData as AccommodationFormData).parkingAvailable
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("parkingAvailable", value)
                          }
                        />
                        <CheckboxField
                          label="Pet Friendly"
                          checked={
                            (formData as AccommodationFormData).petFriendly
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("petFriendly", value)
                          }
                        />
                        <CheckboxField
                          label="Free WiFi"
                          checked={(formData as AccommodationFormData).freeWifi}
                          onChange={(value: boolean) =>
                            handleInputChange("freeWifi", value)
                          }
                        />
                        <CheckboxField
                          label="Breakfast Included"
                          checked={
                            (formData as AccommodationFormData)
                              .breakfastIncluded
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("breakfastIncluded", value)
                          }
                        />
                        <CheckboxField
                          label="Air Conditioned"
                          checked={
                            (formData as AccommodationFormData).airConditioned
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("airConditioned", value)
                          }
                        />
                        <CheckboxField
                          label="Swimming Pool"
                          checked={
                            (formData as AccommodationFormData).swimmingPool
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("swimmingPool", value)
                          }
                        />
                        <CheckboxField
                          label="Laundry Service"
                          checked={
                            (formData as AccommodationFormData).laundryService
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("laundryService", value)
                          }
                        />
                        <CheckboxField
                          label="Room Service"
                          checked={
                            (formData as AccommodationFormData).roomService
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("roomService", value)
                          }
                        />
                        <CheckboxField
                          label="Gym Access"
                          checked={
                            (formData as AccommodationFormData).gymAccess
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("gymAccess", value)
                          }
                        />
                        <CheckboxField
                          label="Spa Services"
                          checked={
                            (formData as AccommodationFormData).spaServices
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("spaServices", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Price"
                        value={formData.price.toString()}
                        onChange={(value) =>
                          handleInputChange("price", Number(value))
                        }
                        placeholder="Enter price"
                        type="number"
                      />
                      <SelectField
                        label="Price Type"
                        options={[
                          { value: "PER_NIGHT", label: "Per Night" },
                          { value: "PER_WEEK", label: "Per Week" },
                          { value: "PER_MONTH", label: "Per Month" },
                          { value: "FIXED", label: "Fixed Price" },
                        ]}
                        value={formData.priceType}
                        onChange={(value) =>
                          handleInputChange("priceType", value)
                        }
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Food & Beverage Service Form */}
              {serviceType === "food-beverage" && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                    Food & Beverage Information
                  </h3>
                  <div className="space-y-5">
                    <InputField
                      label="Restaurant/Service Name"
                      value={formData.serviceName}
                      onChange={(value) =>
                        handleInputChange("serviceName", value)
                      }
                      placeholder="Enter service name"
                      required
                    />
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
                    <TextAreaField
                      label="Opening Hours"
                      value={(formData as FoodBeverageFormData).openHours}
                      onChange={(value) =>
                        handleInputChange("openHours", value)
                      }
                      placeholder="Enter opening hours (e.g., Mon-Sun: 8:00 AM - 10:00 PM)"
                      rows={3}
                    />
                    <InputField
                      label="Cuisine Type"
                      value={(formData as FoodBeverageFormData).cuisineType}
                      onChange={(value) =>
                        handleInputChange("cuisineType", value)
                      }
                      placeholder="Enter cuisine type (e.g., Italian, Sri Lankan, Chinese)"
                    />

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-700 border-b pb-2">
                        Restaurant Features
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <CheckboxField
                          label="Vegetarian Options"
                          checked={
                            (formData as FoodBeverageFormData).vegetarianOptions
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("vegetarianOptions", value)
                          }
                        />
                        <CheckboxField
                          label="Halal Certified"
                          checked={
                            (formData as FoodBeverageFormData).halalCertified
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("halalCertified", value)
                          }
                        />
                        <CheckboxField
                          label="Alcohol Served"
                          checked={
                            (formData as FoodBeverageFormData).alcoholServed
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("alcoholServed", value)
                          }
                        />
                        <CheckboxField
                          label="Outdoor Seating"
                          checked={
                            (formData as FoodBeverageFormData).outdoorSeating
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("outdoorSeating", value)
                          }
                        />
                        <CheckboxField
                          label="Live Music"
                          checked={(formData as FoodBeverageFormData).liveMusic}
                          onChange={(value: boolean) =>
                            handleInputChange("liveMusic", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Price"
                        value={formData.price.toString()}
                        onChange={(value) =>
                          handleInputChange("price", Number(value))
                        }
                        placeholder="Enter average price"
                        type="number"
                      />
                      <SelectField
                        label="Price Type"
                        options={[
                          { value: "FIXED", label: "Fixed Price" },
                          { value: "PER_PERSON", label: "Per Person" },
                        ]}
                        value={formData.priceType}
                        onChange={(value) =>
                          handleInputChange("priceType", value)
                        }
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Tour Guide Service Form */}
              {serviceType === "tour-guides" && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                    Tour Guide Information
                  </h3>
                  <div className="space-y-5">
                    <InputField
                      label="Tour Guide Name"
                      value={formData.serviceName}
                      onChange={(value) =>
                        handleInputChange("serviceName", value)
                      }
                      placeholder="Enter tour guide name"
                      required
                    />
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
                      label="Service Areas"
                      options={getGuidingAreaOptions()}
                      value={getSelectedGuidingAreaValues()}
                      onChange={handleGuidingAreaSelection}
                      required
                      icon={<Globe size={16} />}
                    />
                    <MultiSelectField
                      label="Languages"
                      options={languageOptions}
                      value={preferredLanguages}
                      onChange={setPreferredLanguages}
                      required
                      icon={<Globe size={16} />}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Price"
                        value={formData.price.toString()}
                        onChange={(value) =>
                          handleInputChange("price", Number(value))
                        }
                        placeholder="Enter price"
                        type="number"
                      />
                      <SelectField
                        label="Price Type"
                        options={[
                          { value: "PER_HOUR", label: "Per Hour" },
                          { value: "PER_DAY", label: "Per Day" },
                          { value: "FIXED", label: "Fixed Price" },
                        ]}
                        value={formData.priceType}
                        onChange={(value) =>
                          handleInputChange("priceType", value)
                        }
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              <h2 className="mt-5 mb-3text-lg font-medium text-gray-700">
                Weekly Opening & Closing Hours
              </h2>
              <div className="space-y-3">
  {(formData as ActivityFormData).availabilitySlots?.map((slot, index) => (
    <div key={slot.dayOfWeek} className="grid grid-cols-3 gap-4 items-center">
      <label className="font-medium text-gray-600">{slot.dayOfWeek}</label>

      <InputField
        type="time"
        label=""
        value={slot.openTime}
        onChange={(value) => {
          const updated = [...(formData as ActivityFormData).availabilitySlots];
          updated[index].openTime = value;
          handleInputChange("availabilitySlots", updated);
        }}
        // required
      />

      <InputField
        type="time"
        label=""
        value={slot.closeTime}
        onChange={(value) => {
          const updated = [...(formData as ActivityFormData).availabilitySlots];
          updated[index].closeTime = value;
          handleInputChange("availabilitySlots", updated);
        }}
        // required
      />
    </div>
  ))}
</div>

            </div>
          </div>
        </div>

        {/* submit button */}
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
    </div>
  );
};

export default NewServiceForm;
