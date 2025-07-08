import React, { useState } from "react";
import { Calendar, DollarSign, Users, Phone, Mail, Globe } from "lucide-react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import ImageUploadComponent from "@/components/forms/ImageUploadComponent";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import type {
  ImageData,
  TabSection,
  PolicySection,
  ServiceFormData,
  LocationBased,
  TabData,
  PolicyData,
} from "@/types/serviceTypes";

interface ServiceFormProps {
  initialData?: ServiceFormData;
  initialImages?: ImageData[];
  initialTabs?: TabSection[];
  initialPolicies?: PolicySection[];
  onSubmit: (data: ServiceFormData) => void;
}

const categories = [
  { value: "accommodation", label: "Accommodation" },
  { value: "transportation", label: "Transportation" },
  { value: "adventure", label: "Adventure Sports" },
  { value: "cultural", label: "Cultural Tours" },
  { value: "food", label: "Food & Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "wellness", label: "Wellness & Spa" },
];

const NewServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  initialImages = [],
  initialTabs = [{ heading: "", content: "" }],
  initialPolicies = [{ heading: "", policy: "" }],
  onSubmit,
}) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
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

  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || {
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
      activityType: "",
      activityDetails: "",
      safetyInstructions: "",
      tabsSection: [{ heading: "", content: "" }],
      policySection: [{ heading: "", policy: "" }],
      images: [{ imageUrl: "" }],
    }
  );

  const [tabsSection, setTabsSection] = useState<TabData[]>(
    initialTabs.map((tab) => ({
      id: Math.random().toString(36).substr(2, 9),
      heading: tab.heading,
      description: tab.content,
      isExpanded: true,
    }))
  );

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    initialPolicies.map((policy) => ({
      id: Math.random().toString(36).substr(2, 9),
      heading: policy.heading,
      description: policy.policy,
      isExpanded: true,
    }))
  );

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (locationData: LocationBased) => {
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
    setTabsSection(tabs); // for UI
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
    setPolicySection(policies); // for UI
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

  const handleImagesChange = (imgs: ImageData[]) => {
    setImages(imgs);
    setFormData((prev) => ({
      ...prev,
      images: imgs,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUploadComponent
            images={images}
            onImagesChange={handleImagesChange}
            selectedImageIndex={selectedImageIndex}
            onSelectedImageChange={setSelectedImageIndex}
          />

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <InputField
                label="Service Name"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter service name"
                required
              />

              <InputField
                label="Activity Type"
                value={formData.activityType}
                onChange={(value) => handleInputChange("activityType", value)}
                placeholder="Enter activity type"
                required
              />

              <InputField
                label="Activity Details"
                value={formData.activityDetails}
                onChange={(value) =>
                  handleInputChange("activityDetails", value)
                }
                placeholder="Enter activity details"
              />

              <InputField
                label="Safety Instructions"
                value={formData.safetyInstructions}
                onChange={(value) =>
                  handleInputChange("safetyInstructions", value)
                }
                placeholder="Enter safety instructions"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <InputField
                label="Phone Number"
                value={formData.contactNo}
                onChange={(value) => handleInputChange("contactNo", value)}
                type="tel"
                placeholder="+94 xxx xxx xxxx"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpandableSectionComponent
          title="Tabs"
          items={tabsSection}
          onItemsChange={handleTabsChange}
          addButtonText="Add Tab"
          itemName="Tab"
        />

        <ExpandableSectionComponent
          title="Policies"
          items={policySection}
          onItemsChange={handlePoliciesChange}
          addButtonText="Add Policy"
          itemName="Policy"
        />
      </div>

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