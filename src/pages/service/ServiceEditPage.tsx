import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServiceForm from "@/components/NewServiceForm";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Mountain, Users, Car, UtensilsCrossed, Bed, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type {
  ServiceFormData,
  ImageUploadItem,
  ImageFiles,
  ImageData
} from "@/types/serviceTypes";
import { findServiceById, updateService } from "@/services/services";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string): string => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const providerTypeIcons = {
  'activity': Mountain,
  'tour-guides': Users,
  'transportation': Car,
  'food-beverage': UtensilsCrossed,
  'accommodation': Bed
};

const providerTypeColors = {
  'activity': 'bg-gradient-to-r from-green-500 to-emerald-600',
  'tour-guides': 'bg-gradient-to-r from-blue-500 to-indigo-600',
  'transportation': 'bg-gradient-to-r from-purple-500 to-violet-600',
  'food-beverage': 'bg-gradient-to-r from-orange-500 to-red-600',
  'accommodation': 'bg-gradient-to-r from-teal-500 to-cyan-600'
};

const ServiceEditPage: React.FC = () => {
  const { id, serviceType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [initialImages, setInitialImages] = useState<ImageUploadItem[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  
  const title = formatServiceTitle(serviceType);
  const ServiceTypeIcon = providerTypeIcons[serviceType as keyof typeof providerTypeIcons] || Package;
  const gradientClass = providerTypeColors[serviceType as keyof typeof providerTypeColors] || 'bg-gradient-to-r from-gray-500 to-gray-600';

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
        toast({
          title: "Error",
          description: "Failed to load service data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, serviceType]);

  const handleBack = () => {
    navigate(`/provider/${serviceType}`);
  };

  const handleEditSubmit = async (data: any, images: ImageFiles) => {
    if (!id || !serviceType) return;

    setUpdating(true);
    try {
      console.log("Updating service with data:", data);
      const result = await updateService(serviceType, Number(id), data, images);
      console.log("Update result:", result);
      
      toast({
        title: "Success",
        description: "Service updated successfully!",
      });
      
      // Navigate back to service view after success
      setTimeout(() => {
        navigate(`/provider/${serviceType}/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Error updating service:", error);
      
      let message = "Failed to update service";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/provider/${serviceType}`)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${gradientClass} text-white shadow-lg animate-pulse`}>
                <ServiceTypeIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center space-x-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {title} Services</span>
          </Button>
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center ${gradientClass} text-white shadow-lg`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ServiceTypeIcon className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit {title} Service</h1>
              <p className="text-gray-600">Update your {title.toLowerCase()} service information</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="relative overflow-hidden">
          <div className={`absolute inset-0 ${gradientClass} opacity-5`} />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${gradientClass} text-white`}>
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Service Update</h3>
                  <p className="text-sm text-gray-600">Modify the details below to update your service</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Editing Mode</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Live Preview</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Container with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={updating ? "opacity-50 pointer-events-none" : ""}
      >
        <ServiceForm
          serviceType={serviceType}
          initialData={initialData}
          initialImages={initialImages}
          existingImages={existingImages}
          onSubmit={handleEditSubmit}
        />
      </motion.div>

      {/* Enhanced Loading Overlay for Updates */}
      {updating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4"
          >
            <div className="text-center">
              <motion.div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${gradientClass} text-white`}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Edit className="w-8 h-8" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Service</h3>
              <p className="text-gray-600 mb-4">Please wait while we save your changes...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 ${gradientClass} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceEditPage;
