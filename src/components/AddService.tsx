import React from "react";
import ServiceForm from "@/components/NewServiceForm";
import BackButton from "@/components/BackButton";

const AddService: React.FC = () => {
  const handleBack = () => {
    console.log("Navigate back");
  };

  const handleAddSubmit = (data: any) => {
    console.log("Add Service Data:", data);
    // API call to create service
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="flex items-center mb-8">
        <BackButton onClick={handleBack} className="mr-4" />
        <h1 className="text-3xl font-bold text-gray-800">Add New Service</h1>
      </div>

      <ServiceForm onSubmit={handleAddSubmit} />
    </div>
  );
};

export default AddService;
