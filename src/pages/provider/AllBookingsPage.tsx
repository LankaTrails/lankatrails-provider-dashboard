import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  Car,
  UtensilsCrossed,
  Bed,
  Mountain,
  DollarSign,
  Activity,
  AlertCircle,
  Eye,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Star,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllBookings, exportBookings } from "@/services/bookingService";
import type { UnifiedBooking, BookingFilters, ProviderType, BookingStatus } from "@/types/bookingTypes";
import { useToast } from "@/hooks/use-toast";
import ProviderTopBar from "@/components/provider/ProviderTopBar";

const providerTypeIcons = {
  'activity': Mountain,
  'tour-guide': Users,
  'transportation': Car,
  'food-beverage': UtensilsCrossed,
  'accommodation': Bed
};

const providerTypeColors = {
  'activity': 'bg-gradient-to-r from-green-500 to-emerald-600',
  'tour-guide': 'bg-gradient-to-r from-blue-500 to-indigo-600',
  'transportation': 'bg-gradient-to-r from-purple-500 to-violet-600',
  'food-beverage': 'bg-gradient-to-r from-orange-500 to-red-600',
  'accommodation': 'bg-gradient-to-r from-teal-500 to-cyan-600'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  rejected: 'bg-gray-100 text-gray-800 border-gray-200'
};

const AllBookingsPage = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<BookingFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProviderType, setSelectedProviderType] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<UnifiedBooking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm: searchTerm || undefined }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update filters when status or provider type changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: selectedStatus === "all" ? undefined : [selectedStatus as BookingStatus],
      providerType: selectedProviderType === "all" ? undefined : [selectedProviderType as ProviderType]
    }));
    setCurrentPage(0);
  }, [selectedStatus, selectedProviderType]);

  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['allBookings', filters, currentPage],
    queryFn: () => fetchAllBookings(filters, currentPage, 10),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });


  const handleExport = async () => {
    try {
      const blob = await exportBookings(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Bookings exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export bookings",
        variant: "destructive",
      });
    }
  };

  const openBookingDetails = (booking: UnifiedBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const renderBookingCard = (booking: UnifiedBooking) => {
    const IconComponent = providerTypeIcons[booking.providerType];
    const gradientClass = providerTypeColors[booking.providerType];

    return (
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group"
      >
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${gradientClass} text-white shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{booking.customer}</h4>
                  <p className="text-gray-600 font-medium">{booking.service}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.dateFrom}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-3">
                <Badge className={`${statusColors[booking.status]} border`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
                <p className="text-xl font-bold text-primary-600">
                  {booking.currency || 'LKR'} {parseFloat(booking.amount).toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBookingDetails(booking);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderBookingDetails = () => {
    if (!selectedBooking) return null;

    const renderProviderSpecificDetails = () => {
      switch (selectedBooking.providerType) {
        case 'tour-guide':
          const guideBooking = selectedBooking as any;
          return (
            <div className="space-y-2">
              <div><strong>Guide Type:</strong> {guideBooking.guideType}</div>
              <div><strong>Languages:</strong> {guideBooking.languages?.join(', ')}</div>
              <div><strong>Group Size:</strong> {guideBooking.groupSize}</div>
              <div><strong>Destinations:</strong> {guideBooking.destinations?.join(', ')}</div>
            </div>
          );
        case 'transportation':
          const transportBooking = selectedBooking as any;
          return (
            <div className="space-y-2">
              <div><strong>Vehicle Type:</strong> {transportBooking.vehicleType}</div>
              <div><strong>Pickup:</strong> {transportBooking.pickupLocation}</div>
              <div><strong>Dropoff:</strong> {transportBooking.dropoffLocation}</div>
              <div><strong>Passengers:</strong> {transportBooking.passengers}</div>
              <div><strong>Driver Included:</strong> {transportBooking.driverIncluded ? 'Yes' : 'No'}</div>
            </div>
          );
        case 'activity':
          const activityBooking = selectedBooking as any;
          return (
            <div className="space-y-2">
              <div><strong>Activity Type:</strong> {activityBooking.activityType}</div>
              <div><strong>Participants:</strong> {activityBooking.participants}</div>
              <div><strong>Duration:</strong> {activityBooking.duration}</div>
              <div><strong>Equipment Provided:</strong> {activityBooking.equipmentProvided ? 'Yes' : 'No'}</div>
            </div>
          );
        case 'food-beverage':
          const foodBooking = selectedBooking as any;
          return (
            <div className="space-y-2">
              <div><strong>Restaurant Type:</strong> {foodBooking.restaurantType}</div>
              <div><strong>Party Size:</strong> {foodBooking.partySize}</div>
              <div><strong>Meal Type:</strong> {foodBooking.mealType}</div>
              <div><strong>Special Occasion:</strong> {foodBooking.specialOccasion}</div>
            </div>
          );
        case 'accommodation':
          const accomBooking = selectedBooking as any;
          return (
            <div className="space-y-2">
              <div><strong>Accommodation Type:</strong> {accomBooking.accommodationType}</div>
              <div><strong>Room Type:</strong> {accomBooking.roomType}</div>
              <div><strong>Guests:</strong> {accomBooking.guests}</div>
              <div><strong>Rooms:</strong> {accomBooking.rooms}</div>
              <div><strong>Nights:</strong> {accomBooking.nights}</div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Booking Details - #{selectedBooking.id}</span>
              <Badge className={`${statusColors[selectedBooking.status]} border`}>
                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Name:</strong> {selectedBooking.customer}</div>
                  <div><strong>Email:</strong> {selectedBooking.customerEmail}</div>
                  <div><strong>Phone:</strong> {selectedBooking.customerPhone}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Booking Information</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Service:</strong> {selectedBooking.service}</div>
                  <div><strong>Provider Type:</strong> {selectedBooking.providerType}</div>
                  <div><strong>Amount:</strong> {selectedBooking.currency || 'LKR'} {parseFloat(selectedBooking.amount).toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Service Details</h4>
              {renderProviderSpecificDetails()}
            </div>

            {selectedBooking.slots && selectedBooking.slots.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Time Slots</h4>
                <div className="space-y-2">
                  {selectedBooking.slots.map((slot, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span><strong>Date:</strong> {slot.date}</span>
                        <span><strong>Time:</strong> {slot.start} - {slot.end}</span>
                      </div>
                      {slot.details && slot.details.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Details:</strong> {slot.details.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Provider Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your business performance</p>
        <ProviderTopBar />
      </div>

      {/* Enhanced Stats Cards */}
      {bookingData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                    <p className="text-3xl font-bold">{bookingData.stats.total}</p>
                    <div className="flex items-center mt-2 text-blue-100">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-xs">+12% from last month</span>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Calendar className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Pending Reviews</p>
                    <p className="text-3xl font-bold">{bookingData.stats.pending}</p>
                    <div className="flex items-center mt-2 text-yellow-100">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Requires attention</span>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Clock className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold">{bookingData.stats.completed}</p>
                    <div className="flex items-center mt-2 text-green-100">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-xs">+8% completion rate</span>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold">
                      LKR {bookingData.stats.totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2 text-purple-100">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-xs">+15% this month</span>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <DollarSign className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Quick Actions & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                onClick={() => window.location.href = '/provider/activity/add'}
              >
                <Mountain className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-green-50 hover:border-green-300"
                onClick={() => setSelectedStatus('pending')}
              >
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                Review Pending ({bookingData?.stats.pending || 0})
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-300"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2 text-purple-500" />
                Export Reports
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                <span>Performance Overview</span>
              </CardTitle>
              <CardDescription>Your business metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Removed: Booking Success Rate, Customer Satisfaction, Response Time */}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 p-2 rounded-full">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Average Rating</p>
                        <p className="text-2xl font-bold text-green-700">4.8</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 p-2 rounded-full">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">Active Services</p>
                        <p className="text-2xl font-bold text-blue-700">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Service Type Breakdown */}
      {bookingData?.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-primary-500" />
                <span>Service Distribution</span>
              </CardTitle>
              <CardDescription>Bookings by service category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(providerTypeColors).map(([type, colorClass]) => {
                  const Icon = providerTypeIcons[type as keyof typeof providerTypeIcons];
                  const count = bookingData.bookings.filter((b: UnifiedBooking) => b.providerType === type).length;
                  const percentage = bookingData.stats.total > 0 ? (count / bookingData.stats.total * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={type} className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${colorClass} text-white shadow-lg mb-3`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h4 className="font-semibold text-sm capitalize">
                        {type.replace('-', ' ')}
                      </h4>
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                      <p className="text-xs text-gray-500">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedProviderType} onValueChange={setSelectedProviderType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provider Types</SelectItem>
                <SelectItem value="activity">Activity Provider</SelectItem>
                <SelectItem value="tour-guide">Tour Guides</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-primary-500" />
                  <span>Recent Bookings</span>
                </CardTitle>
                <CardDescription>
                  {bookingData ? `Showing ${bookingData.bookings.length} of ${bookingData.totalCount} recent bookings` : 'Loading bookings...'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/provider/analytics'}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View All Analytics</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : bookingData?.bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {bookingData?.bookings.map(renderBookingCard)}
              </AnimatePresence>
              
              {/* Pagination */}
              {bookingData && bookingData.totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 py-2 text-sm">
                    Page {currentPage + 1} of {bookingData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= bookingData.totalPages - 1}
                    onClick={() => setCurrentPage(prev => Math.min(bookingData.totalPages - 1, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
          </CardContent>
        </Card>
      </motion.div>

      {renderBookingDetails()}
    </div>
  );
};

export default AllBookingsPage;
