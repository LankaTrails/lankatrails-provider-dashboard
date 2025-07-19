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
  TourGuideType,
  PriceType,
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

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const policies = await fetchAllPolicies();
        console.log("Policies:", policies);

        const options = policies.map((p: any) => ({
          label: p.heading,
          value: p.id.toString(), // Assuming each policy has a unique id
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
        id: option.value,
        heading: option.label,
        description: option.content || "", // Provide default empty string
        isExpanded: true, // Default to expanded
      }));
    setPolicySection(selectedPolicyObjects);
    const backendPolicies: PolicySection[] = selectedPolicyObjects.map(
      ({ id, heading, description }) => ({
        id,
        heading,
        policy: description,
      })
    );
    setFormData((prev) => ({
      ...prev,
      policySection: backendPolicies,
    }));
  }, [preferredPolicies, policyOptions]);

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
      } as TransportFormData;
    } else if (serviceType === "accommodation") {
      return {
        ...baseData,
        accommodationType: "HOTEL" as AccommodationType,
        about: "",
      } as AccommodationFormData;
    } else if (serviceType === "food-beverage") {
      return {
        ...baseData,
        openHours: "",
      } as FoodBeverageFormData;
    } else if (serviceType === "tour-guides") {
      return {
        ...baseData,
        serviceAreas: [],
        languages: [],
        tourGuideType: "NATIONAL" as TourGuideType,
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
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>(
    (formData as TourGuideFormData).serviceAreas || []
  );

  const [tabsSection, setTabsSection] = useState<TabData[]>(
    (initialData?.tabsSection || [{ heading: "", content: "" }]).map((tab, index) => ({
      id: index,
      heading: tab.heading,
      description: tab.content,
      isExpanded: true,
    }))
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
    field: keyof (ServiceFormData & ActivityFormData & TransportFormData & AccommodationFormData & FoodBeverageFormData & TourGuideFormData),
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
      ({ id, heading, description }) => ({
        id,
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUploadComponent
            images={images.serviceImages}
            onImagesChange={(images) =>
              handleImagesChange({ serviceImages: images })
            }
            selectedImageIndex={selectedImageIndex}
            onSelectedImageChange={setSelectedImageIndex}
          />

          {/* Activity Service Form */}
          {serviceType === "activity" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Activity Information
              </h3>
              <InputField
                label="Activity Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
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
                onChange={(value) => handleInputChange("activityType", value)}
                required
              />
              <TextAreaField
                label="Activity Details"
                value={(formData as ActivityFormData).activityDetails}
                onChange={(value) => handleInputChange("activityDetails", value)}
                placeholder="Enter activity details"
                rows={3}
              />
              <TextAreaField
                label="Safety Instructions"
                value={(formData as ActivityFormData).safetyInstructions}
                onChange={(value) => handleInputChange("safetyInstructions", value)}
                placeholder="Enter safety instructions"
                rows={4}
              />
              <InputField
                label="Price"
                value={formData.price.toString()}
                onChange={(value) => handleInputChange("price", Number(value))}
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
                onChange={(value) => handleInputChange("priceType", value)}
                required
              />
            </div>
          )}

          {/* Transportation Service Form */}
          {serviceType === "transportation" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Transportation Information
              </h3>
              <InputField
                label="Service Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter transport service name"
                required
              />
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
                onChange={(value) => handleInputChange("vehicleCategory", value)}
                required
              />
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
              <InputField
                label="Price"
                value={formData.price.toString()}
                onChange={(value) => handleInputChange("price", Number(value))}
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
                onChange={(value) => handleInputChange("priceType", value)}
                required
              />
            </div>
          )}

          {/* Accommodation Service Form */}
          {serviceType === "accommodation" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Accommodation Information
              </h3>
              <InputField
                label="Accommodation Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
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
                value={(formData as AccommodationFormData).accommodationType}
                onChange={(value) => handleInputChange("accommodationType", value)}
                required
              />
              <TextAreaField
                label="About Us"
                value={(formData as AccommodationFormData).about}
                onChange={(value) => handleInputChange("about", value)}
                placeholder="Enter about section"
                rows={4}
              />
              <InputField
                label="Price"
                value={formData.price.toString()}
                onChange={(value) => handleInputChange("price", Number(value))}
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
                onChange={(value) => handleInputChange("priceType", value)}
                required
              />
            </div>
          )}

          {/* Food & Beverage Service Form */}
          {serviceType === "food-beverage" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Food & Beverage Information
              </h3>
              <InputField
                label="Restaurant/Service Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter service name"
                required
              />
              <TextAreaField
                label="Opening Hours"
                value={(formData as FoodBeverageFormData).openHours}
                onChange={(value) => handleInputChange("openHours", value)}
                placeholder="Enter opening hours (e.g., Mon-Sun: 8:00 AM - 10:00 PM)"
                rows={3}
              />
              <InputField
                label="Price"
                value={formData.price.toString()}
                onChange={(value) => handleInputChange("price", Number(value))}
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
                onChange={(value) => handleInputChange("priceType", value)}
                required
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Map Component for location-based services */}
          {(serviceType === "activity" || 
            serviceType === "transportation" || 
            serviceType === "accommodation" ||
            serviceType === "food-beverage") && (
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
          )}

          {/* Tour Guide specific fields */}
          {serviceType === "tour-guides" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Tour Guide Information
              </h3>
              <InputField
                label="Tour Guide Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
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
                onChange={(value) => handleInputChange("tourGuideType", value)}
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
              <InputField
                label="Price"
                value={formData.price.toString()}
                onChange={(value) => handleInputChange("price", Number(value))}
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
                onChange={(value) => handleInputChange("priceType", value)}
                required
              />
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
        </div>
      </div>

      {/* Tabs and Policies Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpandableSectionComponent
          title="Tabs"
          items={tabsSection}
          onItemsChange={handleTabsChange}
          addButtonText="Add Tab"
          itemName="Tab"
        />
        <div>
          {serviceType === "activity" && (
            <MultiSelectField
              label="Available Policies"
              options={policyOptions}
              value={preferredPolicies}
              onChange={setPreferredPolicies}
              icon={<Globe size={16} />}
            />
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

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewServiceForm;
