import React, { useState } from "react";
import NewServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";
import { addNewService } from "@/services/services";
import type {
  AccommodationFormData,
  ActivityFormData,
  FoodBeverageFormData,
  ImageFiles,
  ServiceFormData,
  TourGuideFormData,
  TransportFormData,
} from "@/types/serviceTypes";
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

      // Type assertion based on serviceType for better type safety
      let typedData:
        | TransportFormData
        | ActivityFormData
        | AccommodationFormData
        | FoodBeverageFormData
        | TourGuideFormData;

      switch (serviceType) {
        case "activity":
          typedData = data as ActivityFormData;
          break;
        case "transportation":
          typedData = data as TransportFormData;
          break;
        case "accommodation":
          typedData = data as AccommodationFormData;
          break;
        case "food-beverage":
          typedData = data as FoodBeverageFormData;
          break;
        case "tour-guides":
          typedData = data as TourGuideFormData;
          break;
        default:
          throw new Error(`Unsupported service type: ${serviceType}`);
      }

      const result = await addNewService(serviceType || "", typedData, files);

      console.log("Response:", result);

      setToast({
        message: "Service added successfully!",
        type: "success",
      });

      // Optional: Reset form or redirect after success
      // You might want to redirect to a service list page or clear the form
    } catch (error: any) {
      console.error("Error adding service:", error);

      let message = "An unexpected error occurred";

      // Handle different error types
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.userMessage) {
        message = error.userMessage;
      } else if (error.message) {
        message = error.message;
      }

      // Handle validation errors
      if (error.response?.data?.errors || error.details) {
        const errorDetails = error.response?.data?.errors || error.details;
        if (typeof errorDetails === "object") {
          const errorMessages = Object.values(errorDetails).flat().join(", ");
          message += `: ${errorMessages}`;
        }
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

  // Validate service type
  const validServiceTypes = [
    "activity",
    "transportation",
    "accommodation",
    "food-beverage",
    "tour-guides",
  ];

  if (serviceType && !validServiceTypes.includes(serviceType)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Invalid Service Type</h1>
          <ProviderTopBar />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            The service type "{serviceType}" is not supported. Please use one
            of: {validServiceTypes.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Add {title} Service</h1>
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

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">Submitting service...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddServicePage;
