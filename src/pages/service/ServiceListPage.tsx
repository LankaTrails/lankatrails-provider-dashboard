import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  Edit, 
  Star, 
  Package, 
  Plus, 
  Trash2, 
  Search, 
  Filter,
  MapPin,
  Phone,
  DollarSign,
  Calendar,
  Users,
  Car,
  UtensilsCrossed,
  Bed,
  Mountain,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "@/components/forms/ConfirmDeleteModal";
import { fetchAllServices, deleteService } from "@/services/services";
import { useToast } from "@/hooks/use-toast";


// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

type Activity = {
  serviceId: number;
  serviceName?: string;
  status: boolean;
  // add other properties if needed
};

type TourGuide = {
  serviceId: number;
  serviceName?: string;
  status: boolean;
};

type Transportation = {
  serviceId: number;
  serviceName?: string;
  status: boolean;
};

type Accommodation = {
  serviceId: number;
  serviceName?: string;
  status: boolean;
};

type FoodBeverage = {
  serviceId: number;
  serviceName?: string;
  status: boolean;
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

const ServiceListPage = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [fetchedActivities, setFetchedActivities] = useState<Activity[]>([]);
  const [fetchedGuides, setFetchedGuides] = useState<TourGuide[]>([]);
  const [fetchedTransports, setFetchedTransports] = useState<Transportation[]>([]);
  const [fetchedAccommodations, setFetchedAccommodations] = useState<Accommodation[]>([]);
  const [fetchedFoodBeverages, setFetchedFoodBeverages] = useState<FoodBeverage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Transform and filter services
  const allServices = serviceType === "activity"
    ? fetchedActivities.map((item) => ({
        id: item.serviceId,
        title: item.serviceName ?? "Untitled Activity",
        type: "Activity",
        category: "activity",
        bookings: Math.floor(Math.random() * 50) + 1, // Mock data
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        status: item.status ? "active" : "inactive",
        rawData: item
      }))
    : serviceType === "tour-guides"
    ? fetchedGuides.map((item) => ({
        id: item.serviceId,
        title: item.serviceName ?? "Unnamed Guide",
        type: "Tour Guide",
        category: "tour-guide",
        bookings: Math.floor(Math.random() * 30) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: item.status ? "active" : "inactive",
        rawData: item
      }))
    : serviceType === "transportation"
    ? fetchedTransports.map((item) => ({
        id: item.serviceId,
        title: item.serviceName ?? "Unnamed Transport",
        type: "Transport",
        category: "transportation",
        bookings: Math.floor(Math.random() * 40) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: item.status ? "active" : "inactive",
        rawData: item
      }))
    : serviceType === "accommodation"
    ? fetchedAccommodations.map((item) => ({
        id: item.serviceId,
        title: item.serviceName ?? "Unnamed Accommodation",
        type: "Accommodation",
        category: "accommodation",
        bookings: Math.floor(Math.random() * 60) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: item.status ? "active" : "inactive",
        rawData: item
      }))
    : serviceType === "food-beverage"
    ? fetchedFoodBeverages.map((item) => ({
        id: item.serviceId,
        title: item.serviceName ?? "Unnamed Food/Beverage Service",
        type: "food-beverage",
        category: "food-beverage",
        bookings: Math.floor(Math.random() * 35) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: item.status ? "active" : "inactive",
        rawData: item
      }))
    : [];

  // Filter services based on search and status
  const services = allServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const title = formatServiceTitle(serviceType);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  //handle delete click
  const handleDeleteClick = (id: number) => {
    setSelectedServiceId(id);
    setDeleteModalOpen(true);
  };

  //doing the backend process for deletion
  const confirmDelete = async () => {
    if (selectedServiceId != null && serviceType) {
      try {
        setLoading(true);
        await deleteService(serviceType, selectedServiceId);
        
        // Update the appropriate state based on service type
        if (serviceType === "activity") {
          setFetchedActivities((prev) =>
            prev.filter((service) => service.serviceId !== selectedServiceId)
          );
        } else if (serviceType === "tour-guides") {
          setFetchedGuides((prev) =>
            prev.filter((service) => service.serviceId !== selectedServiceId)
          );
        } else if (serviceType === "transportation") {
          setFetchedTransports((prev) =>
            prev.filter((service) => service.serviceId !== selectedServiceId)
          );
        } else if (serviceType === "accommodation") {
          setFetchedAccommodations((prev) =>
            prev.filter((service) => service.serviceId !== selectedServiceId)
          );
        } else if (serviceType === "food-beverage") {
          setFetchedFoodBeverages((prev) =>
            prev.filter((service) => service.serviceId !== selectedServiceId)
          );
        }
        
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting service:", error);
        toast({
          title: "Error",
          description: "Failed to delete service",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setDeleteModalOpen(false);
      }
    }
  };

  // Load services based on category
  useEffect(() => {
    const loadServices = async () => {
      if (!serviceType) return;

      try {
        setLoading(true);
        const result = await fetchAllServices(serviceType, 0, 50);
        
        if (serviceType === "activity") {
          setFetchedActivities(result.content || []);
        } else if (serviceType === "tour-guides") {
          setFetchedGuides(result.content || []);
        } else if (serviceType === "transportation") {
          setFetchedTransports(result.content || []);
        } else if (serviceType === "accommodation") {
          setFetchedAccommodations(result.content || []);
        } else if (serviceType === "food-beverage") {
          setFetchedFoodBeverages(result.content || []);
        }
      } catch (error) {
        console.error(`Error fetching ${serviceType}:`, error);
        toast({
          title: "Error",
          description: `Failed to load ${formatServiceTitle(serviceType)} services`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [serviceType, toast]);

  // Statistics
  const stats = {
    total: allServices.length,
    active: allServices.filter(s => s.status === 'active').length,
    inactive: allServices.filter(s => s.status === 'inactive').length,
    avgRating: allServices.length > 0 
      ? (allServices.reduce((sum, s) => sum + parseFloat(s.rating), 0) / allServices.length).toFixed(1)
      : '0.0',
    totalBookings: allServices.reduce((sum, s) => sum + s.bookings, 0)
  };

  const ServiceTypeIcon = providerTypeIcons[serviceType as keyof typeof providerTypeIcons] || Package;
  const gradientClass = providerTypeColors[serviceType as keyof typeof providerTypeColors] || 'bg-gradient-to-r from-gray-500 to-gray-600';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="relative overflow-hidden">
          <div className={`absolute inset-0 ${gradientClass} opacity-10`} />
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ServiceTypeIcon className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBookings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${title.toLowerCase()} services...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => navigate(`/add-service/${serviceType}`)}
                className={`${gradientClass} text-white hover:opacity-90`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-16" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${gradientClass} text-white`}>
                            <ServiceTypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </CardTitle>
                            <p className="text-sm text-gray-500">{service.type}</p>
                          </div>
                        </div>
                        <Badge
                          variant={service.status === "active" ? "default" : "secondary"}
                          className={service.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {service.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Service Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-gray-500">/5.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{service.bookings}</span>
                          <span className="text-gray-500">bookings</span>
                        </div>
                      </div>

                      {/* Additional Service Info */}
                      <div className="space-y-2 text-sm">
                        {service.rawData.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                              {service.rawData.location.city}, {service.rawData.location.district}
                            </span>
                          </div>
                        )}
                        {service.rawData.contactNumber && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{service.rawData.contactNumber}</span>
                          </div>
                        )}
                        {service.rawData.price && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">
                              ${service.rawData.price}
                              {service.rawData.priceType && (
                                <span className="text-gray-500 ml-1">/{service.rawData.priceType}</span>
                              )}
                            </span>
                          </div>
                        )}
                        {service.rawData.images && service.rawData.images.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <ImageIcon className="h-4 w-4" />
                            <span>{service.rawData.images.length} image(s)</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/provider/${serviceType}/${service.id}`)}
                          className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/provider/${serviceType}/edit/${service.id}`)}
                          className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(service.id)}
                          className="hover:bg-red-600"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full"
              >
                <Card className="text-center py-12">
                  <CardContent>
                    <div className={`inline-flex p-4 rounded-full ${gradientClass} text-white mb-4`}>
                      <ServiceTypeIcon className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || statusFilter !== 'all' 
                        ? `No ${title} Services Match Your Filters`
                        : `No ${title} Services Found`
                      }
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                        : `You haven't added any ${title.toLowerCase()} services yet. Get started by adding your first service.`
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {(searchTerm || statusFilter !== 'all') && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate(`/add-service/${serviceType}`)}
                        className={`${gradientClass} text-white hover:opacity-90`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {title} Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default ServiceListPage;
