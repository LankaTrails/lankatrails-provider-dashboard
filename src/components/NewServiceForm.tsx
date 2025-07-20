import React, { useEffect, useState } from "react";
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

import type {
  TabSection,
  PolicySection,
  ServiceFormData,
  LocationData,
  TabData,
  PolicyData,
  ImageFiles,
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
import { fetchAllPolicies } from "@/services/activityService";

const NewServiceForm: React.FC<ServiceFormProps> = ({
  serviceType,
  initialImages,
  initialData,
  onSubmit,
}) => {
  const [images, setImages] = useState<ImageFiles>({
    serviceImages: initialImages || [],
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [selectedCoordinates, setSelectedCoordinates] = useState<
    { latitude: number; longitude: number } | undefined
  >(
    initialData?.locationBased?.latitude &&
      initialData?.locationBased?.longitude
      ? {
          latitude: initialData.locationBased.latitude,
          longitude: initialData.locationBased.longitude,
        }
      : undefined
  );

  const [policyOptions, setPolicyOptions] = useState<OptionType[]>([]);
  const [preferredPolicies, setPreferredPolicies] = useState<string[]>([]);

  // Initialize form data based on service type
  const initializeFormData = (): ServiceFormData => {
    const baseData: ServiceFormData = {
      serviceName: "",
      locationBased: {
        formattedAddress: "",
        city: "",
        district: "",
        province: "",
        country: "",
        postalCode: "",
        latitude: 0,
        longitude: 0,
      },
      contactNo: "",
      status: true,
      price: 0,
      priceType: "FIXED" as PriceType,
      tabsSection: [{ heading: "", content: "" }],
      policySection: [{ heading: "", policy: "" }],
    };

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
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>(
    (formData as TourGuideFormData).serviceAreas || []
  );

  const [tabsSection, setTabsSection] = useState<TabData[]>(
    (initialData?.tabsSection || [{ heading: "", content: "" }]).map(
      (tab, index) => ({
        id: index,
        heading: tab.heading,
        description: tab.content,
        isExpanded: true,
      })
    )
  );

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    (initialData?.policySection || [{ heading: "", policy: "" }]).map(
      (policy, index) => ({
        id: index,
        heading: policy.heading,
        description: policy.policy,
        isExpanded: true,
      })
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
        const policies = await fetchAllPolicies();
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
    const selectedPolicyObjects = policyOptions
      .filter((option) => preferredPolicies.includes(option.value))
      .map((option) => ({
        id: parseInt(option.value),
        heading: option.label,
        description: option.content || "",
        isExpanded: true,
      }));
    setPolicySection(selectedPolicyObjects);
    const backendPolicies: PolicySection[] = selectedPolicyObjects.map(
      ({ heading, description }) => ({
        heading,
        policy: description,
      })
    );
    setFormData((prev) => ({
      ...prev,
      policySection: backendPolicies,
    }));
  }, [preferredPolicies, policyOptions]);

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

  const handleLocationSelect = (locationData: LocationData) => {
    setSelectedCoordinates({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });

    setFormData((prev) => ({
      ...prev,
      locationBased: locationData,
    }));
  };

  const handleTabsChange = (tabs: TabData[]) => {
    setTabsSection(tabs);
    const backendTabs: TabSection[] = tabs.map(({ heading, description }) => ({
      heading,
      content: description,
    }));
    setFormData((prev) => ({
      ...prev,
      tabsSection: backendTabs,
    }));
  };

  const handlePoliciesChange = (policies: PolicyData[]) => {
    setPolicySection(policies);
    const backendPolicies: PolicySection[] = policies.map(
      ({ heading, description }) => ({
        heading,
        policy: description,
      })
    );
    setFormData((prev) => ({
      ...prev,
      policySection: backendPolicies,
    }));
  };

  const handleImagesChange = (imgs: ImageFiles) => {
    setImages(imgs);
  };

  const handleSubmit = () => {
    let updatedData: ServiceFormData = { ...formData };

    // Update specific fields based on service type
    if (serviceType === "tour-guides") {
      updatedData = {
        ...updatedData,
        serviceAreas: preferredDistricts,
        languages: preferredLanguages,
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

    console.log("Submitting updated data:", updatedData);
    onSubmit(updatedData, images);
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

  const districtOptions = [
    { value: "islandWide", label: "Island Wide" },
    { value: "ampara", label: "Ampara" },
    { value: "anuradhapura", label: "Anuradhapura" },
    { value: "badulla", label: "Badulla" },
    { value: "batticaloa", label: "Batticaloa" },
    { value: "colombo", label: "Colombo" },
    { value: "galle", label: "Galle" },
    { value: "gampaha", label: "Gampaha" },
    { value: "hambantota", label: "Hambantota" },
    { value: "jaffna", label: "Jaffna" },
    { value: "kalutara", label: "Kalutara" },
    { value: "kandy", label: "Kandy" },
    { value: "kegalle", label: "Kegalle" },
    { value: "kilinochchi", label: "Kilinochchi" },
    { value: "kurunegala", label: "Kurunegala" },
    { value: "mannar", label: "Mannar" },
    { value: "matale", label: "Matale" },
    { value: "matara", label: "Matara" },
    { value: "monaragala", label: "Monaragala" },
    { value: "mullaitivu", label: "Mullaitivu" },
    { value: "nuwara_eliya", label: "Nuwara Eliya" },
    { value: "polonnaruwa", label: "Polonnaruwa" },
    { value: "puttalam", label: "Puttalam" },
    { value: "ratnapura", label: "Ratnapura" },
    { value: "trincomalee", label: "Trincomalee" },
    { value: "vavuniya", label: "Vavuniya" },
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
                  {/* <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span> */}
                  Service Images
                </h3>
                <ImageUploadComponent
                  images={images.serviceImages}
                  onImagesChange={(images) =>
                    handleImagesChange({ serviceImages: images })
                  }
                  selectedImageIndex={selectedImageIndex}
                  onSelectedImageChange={setSelectedImageIndex}
                />
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
                  {serviceType === "activity" && (
                    <div className="mb-6">
                      <MultiSelectField
                        label="Available Policies"
                        options={policyOptions}
                        value={preferredPolicies}
                        onChange={setPreferredPolicies}
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
                    location={formData.locationBased.formattedAddress}
                    onLocationChange={(value) =>
                      handleInputChange("locationBased", {
                        ...formData.locationBased,
                        formattedAddress: value,
                      })
                    }
                    onLocationSelect={handleLocationSelect}
                    selectedCoordinates={selectedCoordinates}
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
                        value={
                          (formData as ActivityFormData).safetyInstructions
                        }
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
                          value={
                            (formData as TransportFormData).vehicleCategory
                          }
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
                          checked={
                            (formData as TransportFormData).airConditioned
                          }
                          onChange={(value: boolean) =>
                            handleInputChange("airConditioned", value)
                          }
                        />
                        <CheckboxField
                          label="Driver Included"
                          checked={
                            (formData as TransportFormData).driverIncluded
                          }
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
                              (formData as AccommodationFormData)
                                .parkingAvailable
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
                            checked={
                              (formData as AccommodationFormData).freeWifi
                            }
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
                              (formData as FoodBeverageFormData)
                                .vegetarianOptions
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
                            checked={
                              (formData as FoodBeverageFormData).liveMusic
                            }
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
                        options={districtOptions}
                        value={preferredDistricts}
                        onChange={setPreferredDistricts}
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
                Add Service
              </button>
            </div>
        </div>
      </div>
  );
};

export default NewServiceForm;
