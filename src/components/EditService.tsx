import React, { useEffect, useState } from "react";
import ServiceForm from "@/components/NewServiceForm";
import BackButton from "@/components/BackButton";
import type { ServiceFormData, ImageFile, TabData, PolicyData } from "@/types/serviceTypes";

const EditService: React.FC = () => {
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();
  const [initialImages, setInitialImages] = useState<ImageFile[]>([]);
  const [initialTabs, setInitialTabs] = useState<TabData[]>([]);
  const [initialPolicies, setInitialPolicies] = useState<PolicyData[]>([]);

  useEffect(() => {
    // Fetch service data by ID (mock example)
    const fetchedData: ServiceFormData = {
      serviceName: "Example Service",
      location: "Colombo, Sri Lanka",
      description: "<p>Example description</p>",
      category: "accommodation",
      price: "100",
      duration: "2 hours",
      capacity: "50",
      contactPhone: "+94712345678",
      contactEmail: "example@example.com",
      website: "https://example.com",
      startDate: "2025-08-01",
      endDate: "2025-08-31",
      features: [],
      notes: "<p>Example notes</p>",
      city: "Colombo",
      district: "Colombo",
      province: "Western",
      country: "Sri Lanka",
      postalCode: "00100",
      latitude: 6.9271,
      longitude: 79.8612,
    };

    setInitialData(fetchedData);
    setInitialImages([]); 
    setInitialTabs([{ id: "1", heading: "Info", description: "Details", isExpanded: true }]);
    setInitialPolicies([{ id: "1", heading: "Policy", description: "Rules", isExpanded: true }]);
  }, []);

  const handleBack = () => {
    console.log("Navigate back");
  };

  const handleEditSubmit = (data: any) => {
    console.log("Edit Service Data:", data);
    // API call to update service
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="flex items-center mb-8">
        <BackButton onClick={handleBack} className="mr-4" />
        <h1 className="text-3xl font-bold text-gray-800">Edit Service</h1>
      </div>

      <ServiceForm
        initialData={initialData}
        initialImages={initialImages}
        initialTabs={initialTabs}
        initialPolicies={initialPolicies}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default EditService;
