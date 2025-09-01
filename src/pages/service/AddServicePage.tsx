import React, { useState } from "react";
import NewServiceForm from "@/components/NewServiceForm";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams, useNavigate } from "react-router-dom";
import { addNewService } from "@/services/services";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Mountain, Users, Car, UtensilsCrossed, Bed, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

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

interface ToastState {
  message: string;
  type: "success" | "error";
}

const AddServicePage: React.FC = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  console.log("Service Type:", serviceType);

  const title = formatServiceTitle(serviceType);
  const ServiceTypeIcon = providerTypeIcons[serviceType as keyof typeof providerTypeIcons] || Package;
  const gradientClass = providerTypeColors[serviceType as keyof typeof providerTypeColors] || 'bg-gradient-to-r from-gray-500 to-gray-600';

  const [toastState, setToastState] = useState<ToastState | null>(null);
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

      setToastState({
        message: "Service added successfully!",
        type: "success",
      });

      toast({
        title: "Success",
        description: "Service added successfully!",
      });

      // Redirect to service list after success
      setTimeout(() => {
        navigate(`/provider/${serviceType}`);
      }, 2000);
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

      setToastState({
        message,
        type: "error",
      });

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseToast = (): void => {
    setToastState(null);
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Invalid Service Type</h3>
              <p className="text-red-700 mb-4">
                The service type "{serviceType}" is not supported.
              </p>
              <p className="text-sm text-red-600">
                Supported types: {validServiceTypes.join(", ")}
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/provider')}
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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
            onClick={() => navigate(`/provider/${serviceType}`)}
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
              <h1 className="text-3xl font-bold text-gray-900">Add {title} Service</h1>
              <p className="text-gray-600">Create a new {title.toLowerCase()} service for your business</p>
            </div>
          </div>
        </div>
        <ProviderTopBar />
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
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Service Creation</h3>
                  <p className="text-sm text-gray-600">Fill in the details below to create your service</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Step 1 of 1</p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div className={`h-2 ${gradientClass} rounded-full transition-all duration-500`} style={{width: '100%'}} />
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
        className={isSubmitting ? "opacity-50 pointer-events-none" : ""}
      >
        <NewServiceForm serviceType={serviceType} onSubmit={handleAddSubmit} />
      </motion.div>

      {toastState && (
        <AlertToast
          message={toastState.message}
          type={toastState.type}
          onClose={handleCloseToast}
        />
      )}

      {/* Enhanced Loading Overlay */}
      {isSubmitting && (
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
                <ServiceTypeIcon className="w-8 h-8" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Service</h3>
              <p className="text-gray-600 mb-4">Please wait while we add your {title.toLowerCase()} service...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 ${gradientClass} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AddServicePage;
