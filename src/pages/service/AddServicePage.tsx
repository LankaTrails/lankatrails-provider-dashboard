import React, { useState } from "react";
import NewServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";
import { addNewActivity, saveImgs } from "@/services/activityService";
import type { ImageFile, ServiceFormData } from "@/types/serviceTypes";
import AlertToast from "@/components/forms/AlertToast";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
const AddServicePage: React.FC = () => {
  const { serviceType } = useParams();
  console.log("Service Type:", serviceType);

  const title = formatServiceTitle(serviceType);

  const [toast,setToast] = useState<{
    message:string;
    type: "success" | "error";
  }| null>(null);

  const handleAddSubmit = async(
    data: ServiceFormData, 
    images: ImageFile[] | undefined
  ): Promise<void> => {
    try {
      //  data.images = [];
      //  addNewActivity(data).then((response) => {
      //  console.log("Response:", response);
      //     // if (images) {
      //     //   const imageResponse = saveImgs(response.serviceId, images);
      //     //   console.log("Response:", imageResponse);
      //     // }
      // });
      // console.log("Add Service Data:", data);
      const result = await addNewActivity(data);
      console.log("Add Service Result:", result);
      setToast({
        message:"Service added successfully!",
        type: "success"
      });

    } catch (error :any) {
      setToast({
        message:error.userMessage || error.message ||"An unexpected error occurred",
        type: "error"
      });
    }
   
    


    
  };

 

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <NewServiceForm serviceType={serviceType} onSubmit={handleAddSubmit} />
      {
        toast && (
          <AlertToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null) }
          />
        )
      }
    </div>
  );
};

export default AddServicePage;
