import React, { useState } from "react";
import NewServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";
import { addNewActivity } from "@/services/activityService";
import type { ImageFiles, ServiceFormData } from "@/types/serviceTypes";
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
    files: ImageFiles
  ): Promise<void> => {
    try {
       console.log("Add Service Data:", data);
       addNewActivity(data, files).then((response) => {
       console.log("Response:", response);
      });
      // const result = await addNewActivity(data);
      // console.log("Add Service Result:", result);
      setToast({
        message:"Service added successfully!",
        type: "success"
      });

    } catch (error :any) {
          let message = error.userMessage || error.message || "An unexpected error occurred";

        if (error.details && typeof error.details === "object") {
          const errorMessages ="\n"+ Object.values(error.details).join("\n"); // join all validation messages
          message += `: ${errorMessages}`;
        }

        setToast({
          message,
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
