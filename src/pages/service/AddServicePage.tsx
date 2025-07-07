import React from "react";
import ServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
const AddServicePage: React.FC = () => {
  const handleAddSubmit = (data: any) => {
    console.log("Add Service Data:", data);
    // API call to create service
  };

  const { serviceType } = useParams();

  const title = formatServiceTitle(serviceType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <ServiceForm onSubmit={handleAddSubmit} />
    </div>
  );
};

export default AddServicePage;
