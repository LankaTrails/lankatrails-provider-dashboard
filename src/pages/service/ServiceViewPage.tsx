import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findServiceById } from "@/services/services";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import ServiceDetails from "@/components/service/ServiceDetails";
import AlertToast from "@/components/forms/AlertToast";
import type { ServiceFormData } from "@/types/serviceTypes";

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

const ServiceViewPage: React.FC = () => {
  const { id, serviceType } = useParams<{ id: string; serviceType: string }>();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<ServiceFormData | undefined>();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const title = formatServiceTitle(serviceType);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!id || !serviceType) {
        setToast({
          message: "Invalid service ID or service type",
          type: "error",
        });
        setLoading(false);
        return;
      }

      try {
        const data = await findServiceById(serviceType, Number(id));
        if (data) {
          setServiceData(data);
        } else {
          setToast({
            message: "Service not found",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        setToast({
          message: "Error loading service data",
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Loading {title} Service...</h1>
          <ProviderTopBar />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">{title} Service Not Found</h1>
          <ProviderTopBar />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            The requested service could not be found or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => navigate(`/provider/${serviceType}/list`)}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Return to service list
          </button>
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
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Service Details</h1>
        <ProviderTopBar />
      </div>

      <ServiceDetails serviceData={serviceData} serviceType={serviceType} />

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

export default ServiceViewPage;
