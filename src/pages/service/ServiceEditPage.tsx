import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceForm from "@/components/NewServiceForm";
import BackButton from "@/components/BackButton";
import type { ServiceFormData, ImageData, TabData, PolicyData } from "@/types/serviceTypes";
import { findActivityById, findGuideById } from "@/services/activityService";

const ServiceEditPage: React.FC = () => {
  const { id, serviceType } = useParams();
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [initialImages, setInitialImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchActivityService = async () =>{
      if(!id) return;
      
      try {
        let data;
        if (serviceType === 'activity') {
          data = await findActivityById(id);
          console.log("Fetched Activity Data:", data);
        }else if (serviceType === 'tour-guides') {
          data = await findGuideById(id);
        }
        
        setInitialData(data);
        console.log("Fetched Service Data:", data);
      } catch (error) {
          console.error("Error fetching service data:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchActivityService();
  }, [id, serviceType]);

  const handleBack = () => {
    console.log("Navigate back");
  };

  const handleEditSubmit = (data: any) => {
    console.log("Edit Service Data:", data);
    // API call to update service
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4 bg-white">
      <div className="flex items-center mb-8">
        <BackButton onClick={handleBack} className="mr-4" />
        {/* <h1 className="text-3xl font-bold text-gray-800">Edit {serviceType} Service (ID: {id})</h1> */}
      </div>

      <ServiceForm
        serviceType={serviceType}
        initialData={initialData}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default ServiceEditPage;
