import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UnifiedServiceForm from "@/components/UnifiedServiceForm";
import BackButton from "@/components/BackButton";
import type {
  ServiceFormData,
  ImageUploadItem,
  ImageFiles,
  ImageData,
  TabData,
  PolicyData,
} from "@/types/serviceTypes";
import { findServiceById, updateService } from "@/services/services";
import StepWizardServiceForm from "@/components/StepWizardServiceForm";

const ServiceEditPage: React.FC = () => {
  const { id, serviceType } = useParams();
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [initialImages, setInitialImages] = useState<ImageUploadItem[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!id || !serviceType) return;

      try {
        const data = await findServiceById(serviceType, Number(id));
        // Map data to match the form structure
        if (data) {
          const mappedData = {
            ...data,
            // Ensure all required fields are present
            serviceName: data.serviceName || "",
            contactNo: data.contactNo || "",
            price: data.price || 0,
            priceType: data.priceType || "PER_NIGHT",
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
            accommodationType: data.accommodationType || "HOTEL",
            numberOfRooms: data.numberOfRooms || 1,
            maxGuests: data.maxGuests || 1,
            parkingAvailable: data.parkingAvailable || false,
            petFriendly: data.petFriendly || false,
            freeWifi: data.freeWifi || false,
            breakfastIncluded: data.breakfastIncluded || false,
            airConditioned: data.airConditioned || false,
            swimmingPool: data.swimmingPool || false,
            laundryService: data.laundryService || false,
            roomService: data.roomService || false,
            gymAccess: data.gymAccess || false,
            spaServices: data.spaServices || false,
          };

          if (data.images) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, serviceType]);

  const handleBack = () => {
    console.log("Navigate back");
  };

  const handleEditSubmit = async (data: any, images: ImageFiles) => {
    if (!id || !serviceType) return;

    try {
      console.log("Updating service with data:", data);
      const result = await updateService(serviceType, Number(id), data, images);
      console.log("Update result:", result);
      // TODO: Add success notification and navigation
    } catch (error) {
      console.error("Error updating service:", error);
      // TODO: Add error notification
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4 bg-white">
      <div className="flex items-center mb-8">
        <BackButton onClick={handleBack} className="mr-4" />
        <h1 className="text-3xl font-bold text-gray-800">
          Edit {serviceType} Service
        </h1>
      </div>

      <StepWizardServiceForm
        serviceType={serviceType}
        initialData={initialData}
        initialImages={initialImages}
        existingImages={existingImages}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default ServiceEditPage;
