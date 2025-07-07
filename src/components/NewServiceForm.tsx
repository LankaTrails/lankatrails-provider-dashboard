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
  ImageFile,
  TabData,
  PolicyData,
  ServiceFormData,
  LocationData,
} from "@/types/serviceTypes";

interface ServiceFormProps {
  initialData?: ServiceFormData;
  initialImages?: ImageFile[];
  initialTabs?: TabData[];
  initialPolicies?: PolicyData[];
  onSubmit: (data: {
    formData: ServiceFormData;
    images: ImageFile[];
    tabs: TabData[];
    policies: PolicyData[];
  }) => void;
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
  initialTabs = [{ id: "1", heading: "", description: "", isExpanded: true }],
  initialPolicies = [
    { id: "1", heading: "", description: "", isExpanded: true },
  ],
  onSubmit,
}) => {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    { latitude: number; longitude: number } | undefined
  >(
    initialData?.latitude && initialData?.longitude
      ? {
          latitude: initialData.latitude,
          longitude: initialData.longitude,
        }
      : undefined
  );

  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || {
      serviceName: "",
      location: "",
      city: null,
      district: null,
      province: null,
      country: null,
      postalCode: null,
      description: "",
      category: "",
      price: "",
      duration: "",
      capacity: "",
      contactPhone: "",
      contactEmail: "",
      website: "",
      startDate: "",
      endDate: "",
      features: [],
      notes: "",
      latitude: undefined,
      longitude: undefined,
    }
  );

  const [tabs, setTabs] = useState<TabData[]>(initialTabs);
  const [policies, setPolicies] = useState<PolicyData[]>(initialPolicies);

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
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
      location: locationData.formattedAddress,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city,
      district: locationData.district,
      province: locationData.province,
      country: locationData.country,
      postalCode: locationData.postalCode,
    }));
  };

  const handleSubmit = () => {
    onSubmit({ formData, images, tabs, policies });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUploadComponent
            images={images}
            onImagesChange={setImages}
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

              <SelectField
                label="Category"
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
                options={categories}
                placeholder="Select category"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <ReactQuill
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Enter service description"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Pricing & Capacity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Price ($)"
                value={formData.price}
                onChange={(value) => handleInputChange("price", value)}
                type="number"
                placeholder="0.00"
                icon={<DollarSign className="h-4 w-4 text-gray-400" />}
              />

              <InputField
                label="Duration"
                value={formData.duration}
                onChange={(value) => handleInputChange("duration", value)}
                placeholder="e.g., 2 hours, 1 day"
              />

              <InputField
                label="Capacity"
                value={formData.capacity}
                onChange={(value) => handleInputChange("capacity", value)}
                placeholder="Maximum number of people"
                icon={<Users className="h-4 w-4 text-gray-400" />}
                className="md:col-span-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MapSelectorComponent
            location={formData.location}
            onLocationChange={(value) => handleInputChange("location", value)}
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
                value={formData.contactPhone}
                onChange={(value) => handleInputChange("contactPhone", value)}
                type="tel"
                placeholder="+94 xxx xxx xxxx"
                icon={<Phone className="h-4 w-4 text-gray-400" />}
              />

              <InputField
                label="Email"
                value={formData.contactEmail}
                onChange={(value) => handleInputChange("contactEmail", value)}
                type="email"
                placeholder="contact@example.com"
                icon={<Mail className="h-4 w-4 text-gray-400" />}
              />

              <InputField
                label="Website"
                value={formData.website}
                onChange={(value) => handleInputChange("website", value)}
                type="url"
                placeholder="https://example.com"
                icon={<Globe className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Start Date"
                value={formData.startDate}
                onChange={(value) => handleInputChange("startDate", value)}
                type="date"
                icon={<Calendar className="h-4 w-4 text-gray-400" />}
              />

              <InputField
                label="End Date"
                value={formData.endDate}
                onChange={(value) => handleInputChange("endDate", value)}
                type="date"
                icon={<Calendar className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Additional Notes
            </h3>
            <ReactQuill
              value={formData.notes}
              onChange={(value) => handleInputChange("notes", value)}
              placeholder="Any additional information or special instructions"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpandableSectionComponent
          title="Tabs"
          items={tabs}
          onItemsChange={setTabs}
          addButtonText="Add Tab"
          itemName="Tab"
        />

        <ExpandableSectionComponent
          title="Policies"
          items={policies}
          onItemsChange={setPolicies}
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
