import React from "react";
import NewServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";
import { addNewActivity } from "@/services/activityService";
import type { ServiceFormData } from "@/types/serviceTypes";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
const AddServicePage: React.FC = () => {
  const handleAddSubmit = (data: ServiceFormData) => {
    data.images=[];
    console.log("Add Service Data:", data);
    const response = addNewActivity(data);
    console.log("Response:", response);
  };

  const { serviceType } = useParams();

  const title = formatServiceTitle(serviceType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <NewServiceForm onSubmit={handleAddSubmit} />
    </div>
  );
};

export default AddServicePage;
