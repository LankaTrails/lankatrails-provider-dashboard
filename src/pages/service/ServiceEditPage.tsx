import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceForm from "@/components/NewServiceForm";
import BackButton from "@/components/BackButton";
import type { ServiceFormData, ImageData, TabData, PolicyData } from "@/types/serviceTypes";
import { findActivityById, findGuideById } from "@/services/activityService";
import { findAccommodationById } from "@/services/accomodation";
import { findTransportationById } from "@/services/transportationService";
import { findFoodBeverageById } from "@/services/FoodBeverage";

const ServiceEditPage: React.FC = () => {
  const { id, serviceType } = useParams();
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [initialImages, setInitialImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchActivityService = async () => {
      if (!id) return;

      try {
        let data;
        if (serviceType === 'activity') {
          data = await findActivityById(id);
        } else if (serviceType === 'tour-guides') {
          data = await findGuideById(id);
        } else if (serviceType === "accommodation") {
          data = await findAccommodationById(id);
        } else if (serviceType === "transportation"){
          data = await findTransportationById(id);
        } else if (serviceType === "food-beverage"){
          data = await findFoodBeverageById(id);
        }
          // Map data to match the form structure
          if (data) {
            const mappedData = {
              ...data,
              // Ensure all required fields are present
              serviceName: data.serviceName || "",
              contactNo: data.contactNo || "",
              price: data.price || 0,
              priceType: data.priceType || "PER_NIGHT",
              locationBased: data.locationBased || {
                formattedAddress: "",
                city: "",
                district: "",
                province: "",
                country: "",
                postalCode: "",
                latitude: 0,
                longitude: 0,
              },
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
  setInitialImages(
    data.images.map((img: any, index: number) => ({
      id: `img-${index}`, // Generate unique string ID
      url: img.imageUrl,  // Rename property
      name: `Image ${index + 1}` // Optional but helpful
    }))
  );
}



            data = mappedData;
          }
        setInitialData(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
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
        <h1 className="text-3xl font-bold text-gray-800">Edit {serviceType} Service</h1>
      </div>

      <ServiceForm
        serviceType={serviceType}
        initialData={initialData}
        initialImages={initialImages}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default ServiceEditPage;