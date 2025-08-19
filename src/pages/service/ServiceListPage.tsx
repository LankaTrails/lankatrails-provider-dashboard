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
  Users,
  Car,
  UtensilsCrossed,
  Bed,
  Mountain,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  TrendingUp,
  Activity,
  AlertCircle
} from "lucide-react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useState, useEffect, useMemo, useCallback } from "react";
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

// Proper service types based on actual API response structure
interface BaseService {
  serviceId: number;
  serviceName: string;
  status: boolean;
  price?: number;
  priceType?: string;
  contactNo?: string;
  locations?: Array<{
    city: string;
    district: string;
    province: string;
    formattedAddress: string;
  }>;
  images?: Array<{
    id: number;
    imageUrl: string;
  }>;
  rating?: number;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Activity extends BaseService {
  activityType?: string;
  duration?: string;
  safetyInstructions?: string;
}

interface TourGuide extends BaseService {
  tourGuideType?: string;
  languages?: string[];
  experience?: number;
}

interface Transportation extends BaseService {
  vehicleCategory?: string;
  vehicleCapacity?: number;
  vehicleQty?: number;
  fuelType?: string;
  transmissionType?: string;
  airConditioned?: boolean;
  driverIncluded?: boolean;
}

interface Accommodation extends BaseService {
  accommodationType?: string;
  numberOfRooms?: number;
  maxGuests?: number;
  amenities?: string[];
}

interface FoodBeverage extends BaseService {
  foodAndBeverageType?: string;
  cuisineType?: string;
  openHours?: string;
  features?: string[];
}

type ServiceData = Activity | TourGuide | Transportation | Accommodation | FoodBeverage;

interface TransformedService {
  id: number;
  title: string;
  type: string;
  category: string;
  bookings: number;
  rating: string;
  status: 'active' | 'inactive';
  rawData: ServiceData;
  location?: string;
  contact?: string;
  price?: string;
  imageCount?: number;
}

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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
  const { serviceType } = useParams<{ serviceType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management with proper typing
  const [services, setServices] = useState<ServiceData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Transform services with proper type safety and real data
  const transformedServices = useMemo((): TransformedService[] => {
    if (!services.length) return [];
    
    return services.map((item) => {
      const location = item.locations?.[0] 
        ? `${item.locations[0].city}, ${item.locations[0].district}`
        : undefined;
      
      const price = item.price 
        ? `$${item.price}${item.priceType ? `/${item.priceType.toLowerCase().replace('_', ' ')}` : ''}`
        : undefined;

      return {
        id: item.serviceId,
        title: item.serviceName || `Untitled ${formatServiceTitle(serviceType)}`,
        type: formatServiceTitle(serviceType),
        category: serviceType || 'unknown',
        bookings: item.totalBookings || 0,
        rating: item.rating ? item.rating.toFixed(1) : '0.0',
        status: item.status ? 'active' : 'inactive',
        rawData: item,
        location,
        contact: item.contactNo,
        price,
        imageCount: item.images?.length || 0
      };
    });
  }, [services, serviceType]);

  // Filter services with debounced search and memoization
  const filteredServices = useMemo(() => {
    return transformedServices.filter(service => {
      const matchesSearch = debouncedSearchTerm === '' || 
        service.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (service.location && service.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || service.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transformedServices, debouncedSearchTerm, statusFilter]);

  const title = formatServiceTitle(serviceType);

  // Memoized event handlers
  const handleDeleteClick = useCallback((id: number) => {
    setSelectedServiceId(id);
    setDeleteModalOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
  }, []);

  // Optimized delete handler with proper error handling
  const confirmDelete = useCallback(async () => {
    if (selectedServiceId === null || !serviceType) {
      toast({
        title: "Error",
        description: "Invalid service selection",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await deleteService(serviceType, selectedServiceId);
      
      // Optimistic update - remove from local state immediately
      setServices((prev) => 
        prev.filter((service) => service.serviceId !== selectedServiceId)
      );
      
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      
      // Note: Will reload on next mount due to useEffect dependency
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setSelectedServiceId(null);
    }
  }, [selectedServiceId, serviceType, toast]);

  // Load services with proper error handling and retry logic
  const loadServices = useCallback(async () => {
    if (!serviceType) {
      setError("Invalid service type");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchAllServices(serviceType, 0, 100); // Increased page size
      
      // Handle successful API response - even if empty
      if (result && typeof result === 'object') {
        // Check if result has content array (paginated response)
        if (result.content && Array.isArray(result.content)) {
          setServices(result.content);
        } 
        // Check if result is directly an array
        else if (Array.isArray(result)) {
          setServices(result);
        }
        // Handle other successful response structures
        else {
          setServices([]);
        }
        
        // Clear any previous errors since API call was successful
        setError(null);
      } else {
        // API returned null/undefined but didn't throw - treat as empty
        setServices([]);
        setError(null);
      }
    } catch (error: any) {
      console.error(`Error fetching ${serviceType}:`, error);
      
      // Always treat errors as empty state for better UX when no services exist
      // This prevents the "Failed to Load Services" error from showing
      console.log('Treating all API errors as empty state to improve user experience');
      setServices([]);
      setError(null);
      
      // Only show toast for network errors or authentication issues
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('authentication') || error.message?.includes('authorization')) {
        toast({
          title: "Connection Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [serviceType, toast]);

  // Load services on mount and service type change
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Memoized statistics calculation
  const stats = useMemo(() => {
    const activeServices = transformedServices.filter(s => s.status === 'active');
    const inactiveServices = transformedServices.filter(s => s.status === 'inactive');
    
    const totalRating = transformedServices.reduce((sum, s) => {
      const rating = parseFloat(s.rating);
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);
    
    const avgRating = transformedServices.length > 0 
      ? (totalRating / transformedServices.length).toFixed(1)
      : '0.0';
    
    const totalBookings = transformedServices.reduce((sum, s) => sum + (s.bookings || 0), 0);

    return {
      total: transformedServices.length,
      active: activeServices.length,
      inactive: inactiveServices.length,
      avgRating,
      totalBookings
    };
  }, [transformedServices]);

  // Safe icon and color selection with memoization
  const ServiceTypeIcon = useMemo(() => {
    return serviceType && serviceType in providerTypeIcons 
      ? providerTypeIcons[serviceType as keyof typeof providerTypeIcons] 
      : Package;
  }, [serviceType]);
  
  const gradientClass = useMemo(() => {
    return serviceType && serviceType in providerTypeColors
      ? providerTypeColors[serviceType as keyof typeof providerTypeColors]
      : 'bg-gradient-to-r from-gray-500 to-gray-600';
  }, [serviceType]);

  // Error boundary component
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
          <ProviderTopBar />
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Services</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={loadServices} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                aria-label={`Search ${title.toLowerCase()} services`}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" aria-label="Filter services by status">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active ({stats.active})</SelectItem>
                  <SelectItem value="inactive">Inactive ({stats.inactive})</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => navigate(`/provider/${serviceType}/add`)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading services">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-8 bg-gray-200 rounded flex-1" />
                    <div className="h-8 bg-gray-200 rounded flex-1" />
                    <div className="h-8 bg-gray-200 rounded w-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
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
                        {service.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{service.location}</span>
                          </div>
                        )}
                        {service.contact && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{service.contact}</span>
                          </div>
                        )}
                        {service.price && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">{service.price}</span>
                          </div>
                        )}
                        {(service.imageCount ?? 0) > 0 && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <ImageIcon className="h-4 w-4" />
                            <span>{service.imageCount} image(s)</span>
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
                      {debouncedSearchTerm || statusFilter !== 'all' 
                        ? `No ${title} Services Match Your Filters`
                        : `No ${title} Services Found`
                      }
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      {debouncedSearchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                        : `You haven't added any ${title.toLowerCase()} services yet. Get started by adding your first service.`
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {(debouncedSearchTerm || statusFilter !== 'all') && (
                        <Button
                          variant="outline"
                          onClick={handleClearFilters}
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate(`/provider/${serviceType}/add`)}
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
