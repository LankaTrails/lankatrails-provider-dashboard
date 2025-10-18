import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  ServiceFormData,
  ImageUploadItem,
  ImageFiles,
  ImageData,
} from "@/types/serviceTypes";
import { findServiceById, updateService } from "@/services/services";
import AlertToast from "@/components/forms/AlertToast";
import StepWizardServiceForm from "@/components/StepWizardServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";

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

const ServiceEditPage: React.FC = () => {
  const { id, serviceType } = useParams<{ id: string; serviceType: string }>();
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialImages, setInitialImages] = useState<ImageUploadItem[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const navigate = useNavigate();
  const title = formatServiceTitle(serviceType);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!id || !serviceType) return;

      try {
        const data = await findServiceById(serviceType, Number(id));
        // Map data to match the form structure
        if (data) {
          const mappedData: ServiceFormData = {
            ...data,
            // Ensure all required fields are present
            serviceName: data.serviceName || "",
            contactNo: data.contactNo || "",
            locations: data.locations || [
              {
                locationId: null,
                formattedAddress: "",
                city: "",
                district: "",
                province: "",
                country: "",
                postalCode: "",
                latitude: 0,
                longitude: 0,
              },
            ],
            tabsSection: data.tabsSection || [{ heading: "", content: "" }],
            policySection: data.policySection || [{ heading: "", policy: "" }],
            // Map accommodation specific fields
            // accommodationType: data.accommodationType || "HOTEL",
            // numberOfRooms: data.numberOfRooms || 1,
            // maxGuests: data.maxGuests || 1,
            // parkingAvailable: data.parkingAvailable || false,
            // petFriendly: data.petFriendly || false,
            // freeWifi: data.freeWifi || false,
            // breakfastIncluded: data.breakfastIncluded || false,
            // airConditioned: data.airConditioned || false,
            // swimmingPool: data.swimmingPool || false,
            // laundryService: data.laundryService || false,
            // roomService: data.roomService || false,
            // gymAccess: data.gymAccess || false,
            // spaServices: data.spaServices || false,
          };

          if (data.images && Array.isArray(data.images)) {
            // Set existing images for deletion tracking
            setExistingImages(
              data.images.map((img: any) => ({
                id: img.id,
                imageUrl: img.imageUrl,
              }))
            );

            // Set initial images for preview (these will be shown as existing)
            setInitialImages(
              data.images.map((img: any, index: number) => ({
                id: `img-${index}`, // Generate unique string ID
                url: img.imageUrl, // Map imageUrl to url
                name: `Image ${index + 1}`, // Optional but helpful
                // file property is optional for existing images
              }))
            );
          }

          setInitialData(mappedData);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        setToast({
          message: "Error loading service data.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, serviceType]);

  const handleCloseToast = (): void => {
    setToast(null);
  };

  const handleEditSubmit = async (data: ServiceFormData, images: ImageFiles) => {
    if (!id || !serviceType) return;

    setIsSubmitting(true);
    try {
      console.log("Updating service with data:", data);
      const result = await updateService(serviceType, Number(id), data, images);
      console.log("Update result:", result);

      // Show success toast
      setToast({
        message: "Service updated successfully!",
        type: "success",
      });

      // Redirect to the service view page after a short delay
      setTimeout(() => {
        navigate(`/provider/${serviceType}/${id}/view`);
      }, 1500);
    } catch (error) {
      console.error("Error updating service:", error);
      setToast({
        message: "Error updating service. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Service not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Edit {title} Service</h1>
        <ProviderTopBar />
      </div>

      <StepWizardServiceForm
        serviceType={serviceType}
        initialData={initialData}
        initialImages={initialImages}
        existingImages={existingImages}
        onSubmit={handleEditSubmit}
        isEditMode={true}
        isSubmitting={isSubmitting}
      />

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

export default ServiceEditPage;
