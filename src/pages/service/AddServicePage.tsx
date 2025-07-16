import React, { useState } from "react";
import NewServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";
import { addNewService } from "@/services/activityService";
import type { ImageFiles, ServiceFormData } from "@/types/serviceTypes";
import AlertToast from "@/components/forms/AlertToast";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string): string => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

interface ToastState {
  message: string;
  type: "success" | "error";
}

const AddServicePage: React.FC = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  console.log("Service Type:", serviceType);

  const title = formatServiceTitle(serviceType);

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddSubmit = async (
    data: ServiceFormData,
    files: ImageFiles
  ): Promise<void> => {
    console.log("Submitting data:", data);
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    try {
      console.log("Add Service Data:", data);
      console.log("Add Service Files:", files);

      const result = await addNewService(
        serviceType || "activity",
        data,
        files
      );
      console.log("Response:", result);

      setToast({
        message: "Service added successfully!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error adding service:", error);

      let message =
        error.userMessage || error.message || "An unexpected error occurred";

      if (error.details && typeof error.details === "object") {
        const errorMessages = Object.values(error.details).join("\n");
        message += `:\n${errorMessages}`;
      }

      setToast({
        message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseToast = (): void => {
    setToast(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>

      <div className={isSubmitting ? "opacity-50 pointer-events-none" : ""}>
        <NewServiceForm serviceType={serviceType} onSubmit={handleAddSubmit} />
      </div>

      {toast && (
        <AlertToast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default AddServicePage;
