import React, { useState } from "react";
import { Calendar, DollarSign, Users, Phone, Mail, Globe } from "lucide-react";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import ImageUploadComponent from "@/components/forms/ImageUploadComponent";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MultiSelectField from "./forms/MultiSelectField";
import TextAreaField from "./forms/TextAreaField";

import type {
  ImageData,
  TabSection,
  PolicySection,
  ServiceFormData,
  LocationBased,
  TabData,
  PolicyData,
  ImageFile,
} from "@/types/serviceTypes";
import { Value } from "@radix-ui/react-select";

interface ServiceFormProps {
  serviceType?: string; // Optional category prop for filtering or categorization
  initialData?: ServiceFormData;
  images?: ImageFile[]; // Optional initial images
  onSubmit: (
    data: ServiceFormData,
    images: ImageFile[] | undefined // Adjusted to accept both ImageData and ImageFile
  ) => void;
}

const NewServiceForm: React.FC<ServiceFormProps> = ({
  serviceType,
  initialData,
  onSubmit,
}) => {
  const [images, setImages] = useState<ImageFile[]>(
    initialData?.images?.map((img) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: new File([], img.imageUrl), // Placeholder, actual file handling should be done
      url: img.imageUrl,
    })) || []
  );

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
      serviceAreas: [],
      languages: [],
    }
  );
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(
    initialData?.languages ? initialData.languages : []
  );
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>(
    initialData?.serviceAreas ? initialData.serviceAreas : []
  );
  const [tabsSection, setTabsSection] = useState<TabData[]>(
    (initialData?.tabsSection || [{ heading: "", content: "" }]).map((tab) => ({
      id: Math.random().toString(36).substr(2, 9),
      heading: tab.heading,
      description: tab.content,
      isExpanded: true,
    }))
  );

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    (initialData?.policySection || [{ heading: "", policy: "" }]).map(
      (policy) => ({
        id: Math.random().toString(36).substr(2, 9),
        heading: policy.heading,
        description: policy.policy,
        isExpanded: true,
      })
    )
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

  const handleImagesChange = (imgs: ImageFile[]) => {
    setImages(imgs); // for UI
  };

  const handleSubmit = () => {
    const updatedData: ServiceFormData = {
      ...formData,
      // languages: preferredLanguages, // Use as array
      serviceAreas: preferredDistricts, // Always use array of strings
    };

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
            images={images}
            onImagesChange={handleImagesChange}
            selectedImageIndex={selectedImageIndex}
            onSelectedImageChange={setSelectedImageIndex}
          />
          {serviceType == "activity" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Basic Information
              </h3>
              <InputField
                label="Name of Activity Service"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter tour guide name"
                required
              />
              <SelectField
                label="Activity Category"
                options={[
                  { value: "adventure", label: "Adventure" },
                  { value: "water_sports", label: "Water Sports" },
                  { value: "hiking", label: "Hiking & Trekking" },
                  { value: "safari", label: "Safari Tours" },
                ]}
                value={formData.activityType}
                onChange={(value) => handleInputChange("activityType", value)}
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

              <TextAreaField
                label="Safety Instructions"
                value={formData.safetyInstructions}
                onChange={(value) =>
                  handleInputChange("safetyInstructions", value)
                }
                placeholder="Enter safety instructions"
                rows={4}
              />
            </div>
          )}

          {/* Activity Service Provider */}

          <div className="bg-gray-50 p-4 rounded-lg w-full">
            {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Information
            </h3> */}
            {serviceType == "tour-guides" && (
              <div className="space-y-4">
                        
          
            <div>
                <MultiSelectField
                label="Select Policies"
                options={policyOptions}
                value={preferredPolicies}
                onChange={setPreferredPolicies}
                required
                icon={<Globe size={16} />}
                />
            </div>
         
        
        
        
              </div>
            )}
            {/* <div className="space-y-4"> */}
              

             
            {/* </div> */}
          </div>
        </div>

        <div className="space-y-0">
          {serviceType == "activity" && (
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

          <div className="bg-gray-50 p-4 rounded-lg">
            {serviceType == "tour-guides" && (
              <div className="space-y-4">
                <InputField
                  label="Name of Tour Guide"
                  value={formData.serviceName}
                  onChange={(value) => handleInputChange("serviceName", value)}
                  placeholder="Enter tour guide name"
                  required
                />
              </div>
            )}
            {serviceType == "tour-guides" && (
              <>
                <SelectField
                  label="Guiding Category"
                  options={[
                    { value: "national", label: "National" },
                    { value: "chauffer", label: "Chauffeur" },
                    { value: "site", label: "Site" },
                    { value: "area", label: "Area" },
                  ]}
                  value={formData.activityType}
                  onChange={(value) => handleInputChange("activityType", value)}
                  required
                />
              </>
            )}
            {serviceType == "tour-guides" && (
              <MultiSelectField
                label="Service Areas"
                options={districtOptions}
                value={preferredDistricts}
                onChange={setPreferredDistricts}
                required
                icon={<Globe size={16} />}
              />
            )}
            {serviceType == "tour-guides" && (
              <MultiSelectField
                label="Preferred Languages"
                options={languageOptions}
                value={preferredLanguages}
                onChange={setPreferredLanguages}
                required
                icon={<Globe size={16} />}
              />
            )}
            {/* <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-5">
              Contact Information
            </h3> */}
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
