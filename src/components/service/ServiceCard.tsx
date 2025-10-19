import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Star, Phone, PowerOff, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ServiceFormData } from "@/types/serviceTypes";

interface ServiceCardProps {
  service: ServiceFormData;
  serviceType: string;
  onToggleStatus: (id: number, currentStatus: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  serviceType,
  onToggleStatus,
}) => {
  const navigate = useNavigate();

  // Get the main image
  const mainImage = service.images?.[0]?.imageUrl
    ? `http://localhost:8080${service.images[0].imageUrl}`
    : null;

  // Check if service is active
  const isServiceActive = service.status === "ACTIVE";

  // Format the service type for display
  const formatServiceType = (type: string) => {
    return type
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={service.serviceName || "Service image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm text-gray-500">No image available</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={isServiceActive ? "default" : "secondary"}
            className={`${
              isServiceActive
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600"
            } text-white border-0`}
          >
            {service.status}
          </Badge>
        </div>

        {/* Toggle Status Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (service.serviceId !== null) {
              onToggleStatus(service.serviceId, service.status);
            }
          }}
          className={`absolute top-3 right-3 p-2 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg ${
            isServiceActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
          title={isServiceActive ? "Deactivate Service" : "Activate Service"}
        >
          {isServiceActive ? (
            <PowerOff className="w-4 h-4" />
          ) : (
            <Power className="w-4 h-4" />
          )}
        </button>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight text-ellipsis overflow-hidden">
              {service.serviceName || "Unnamed Service"}
            </h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {formatServiceType(serviceType)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-4">
          {/* Rating */}
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-1" />
              <span>Rating</span>
            </div>
            <div className="flex items-center">
              {service.reviewCount && service.averageRating ? (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">
                    {service.averageRating ?? 0}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({service.reviewCount})
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No reviews</span>
              )}
            </div>
          </div>

          {/* Past Bookings */}
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <span>Bookings (past)</span>
            </div>
            <p className="font-semibold">{service.pastBookingCount}</p>
          </div>

          {/* future Bookings */}
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <span>Bookings (future)</span>
            </div>
            <p className="font-semibold">{service.futureBookingCount}</p>
          </div>
        </div>

        {/* Contact Info */}
        {service.contactNo && (
          <div className="flex items-center text-sm text-gray-600 pt-2 border-t">
            <Phone className="w-4 h-4 mr-2" />
            <span>{service.contactNo}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-blue-50 hover:border-blue-200"
            onClick={() =>
              navigate(`/provider/${serviceType}/${service.serviceId}/view`)
            }
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-green-50 hover:border-green-200"
            onClick={() =>
              navigate(`/provider/${serviceType}/${service.serviceId}/edit`)
            }
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
