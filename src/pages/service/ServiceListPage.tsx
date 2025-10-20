import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import ServiceCard from "@/components/service/ServiceCard";
import { useState, useEffect } from "react";
import ConfirmActionModal from "@/components/forms/ConfirmActionModal";
import {
  fetchAllServices,
  deactivateService,
  activateService,
} from "@/services/services";
import type { ServiceFormData } from "@/types/serviceTypes";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const ServiceListPage = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();

  // Use the unified ServiceListItem interface for all service types
  const [services, setServices] = useState<ServiceFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = formatServiceTitle(serviceType);

  const [isToggleModalOpen, setToggleModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [selectedServiceStatus, setSelectedServiceStatus] =
    useState<string>("");

  // Handle toggle status click
  const handleToggleStatusClick = (id: number, currentStatus: string) => {
    setSelectedServiceId(id);
    setSelectedServiceStatus(currentStatus);
    setToggleModalOpen(true);
  };

  // Confirm and perform status toggle
  const confirmToggleStatus = async () => {
    if (selectedServiceId != null && serviceType) {
      try {
        const isCurrentlyActive = selectedServiceStatus === "ACTIVE";
        console.log(
          `${isCurrentlyActive ? "Deactivating" : "Activating"} service:`,
          selectedServiceId
        );

        if (isCurrentlyActive) {
          await deactivateService(serviceType, selectedServiceId);
        } else {
          await activateService(serviceType, selectedServiceId);
        }

        // Update the service status in the state
        setServices((prev) =>
          prev.map((service) =>
            service.serviceId === selectedServiceId
              ? {
                  ...service,
                  status: isCurrentlyActive ? "INACTIVE" : "ACTIVE",
                }
              : service
          )
        );

        console.log(
          `Service ${
            isCurrentlyActive ? "deactivated" : "activated"
          } successfully`
        );
      } catch (error) {
        console.error("Error toggling service status:", error);
        setError(
          `Failed to ${
            selectedServiceStatus === "ACTIVE" ? "deactivate" : "activate"
          } service. Please try again.`
        );
      }

      setToggleModalOpen(false);
      setSelectedServiceId(null);
      setSelectedServiceStatus("");
    }
  };

  // Fetch services based on service type
  useEffect(() => {
    const loadServices = async () => {
      if (!serviceType) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await fetchAllServices(serviceType, 0, 50); // Increased page size
        console.log(`Fetched ${serviceType}:`, result);

        // Filter out services without serviceId and ensure serviceId is not null
        const validServices = result.filter(
          (service: ServiceFormData) =>
            service.serviceId !== null && service.serviceId !== undefined
        );

        setServices(validServices);
      } catch (error) {
        console.error(`Error fetching ${serviceType}:`, error);
        setError(
          `Failed to load ${title.toLowerCase()} services. Please try again.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [serviceType, title]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
          <ProviderTopBar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
          <ProviderTopBar />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p className="font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
          </div>
          <div className="p-2">
            <Button
              onClick={() => navigate(`/provider/${serviceType}/add`)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {title}
            </Button>
          </div>
        </div>
        <ProviderTopBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard
              key={service.serviceId || `service-${Math.random()}`}
              service={service}
              serviceType={serviceType || ""}
              onToggleStatus={(id, currentStatus) =>
                handleToggleStatusClick(id, currentStatus)
              }
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center space-y-4 py-16 bg-white border-2 border-dashed border-gray-200 rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700">
              No {title.toLowerCase()} services yet
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Start building your service portfolio by adding your first{" "}
              {title.toLowerCase()} service. Customers will be able to discover
              and book your services.
            </p>
            <Button
              onClick={() => navigate(`/provider/${serviceType}/add`)}
              className="bg-primary hover:bg-primary/90 mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First {title}
            </Button>
          </div>
        )}
      </div>

      <ConfirmActionModal
        isOpen={isToggleModalOpen}
        onClose={() => {
          setToggleModalOpen(false);
          setSelectedServiceId(null);
          setSelectedServiceStatus("");
        }}
        onConfirm={confirmToggleStatus}
        title={`${
          selectedServiceStatus === "ACTIVE" ? "Deactivate" : "Activate"
        } Service`}
        description={`Are you sure you want to ${
          selectedServiceStatus === "ACTIVE" ? "deactivate" : "activate"
        } this service? ${
          selectedServiceStatus === "ACTIVE"
            ? "This will make the service unavailable to customers."
            : "This will make the service available to customers again."
        }`}
        actionType={
          selectedServiceStatus === "ACTIVE" ? "deactivate" : "activate"
        }
      />
    </div>
  );
};

export default ServiceListPage;
