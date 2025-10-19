import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  CheckCircle,
  Calendar,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CalendarView from "@/components/CalendarView";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useState, useEffect } from "react";
import { getBookings } from "@/services/bookings";
import type { BookingItem } from "@/types/bookingtypes";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const ServiceBookingsPage = () => {
  const { serviceType, id } = useParams<{ serviceType: string; id: string }>();
  const title = formatServiceTitle(serviceType);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Get serviceId from URL params
  const serviceId = id ? Number(id) : null;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!serviceId) {
        setError("Service ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get bookings for the last 3 months and next 3 months
        const today = new Date();
        const fromDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        const toDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

        // Convert to LocalDateTime format (without timezone info)
        const from = fromDate.toISOString().slice(0, 19); // Remove .sssZ
        const to = toDate.toISOString().slice(0, 19); // Remove .sssZ

        console.log("Fetching bookings with LocalDateTime format:", {
          from,
          to,
        });

        const fetchedBookings = await getBookings(serviceId, from, to);
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [serviceId]);

  // Helper function to format status for display
  const formatStatus = (status: BookingItem["status"]): string => {
    switch (status) {
      case "CONFIRMED":
        return "confirmed";
      case "PENDING":
        return "pending";
      case "CANCELLED":
        return "cancelled";
      case "PAYMENT_FAILED":
        return "payment failed";
      case "NOT_AVAILABLE":
        return "not available";
      default:
        return "unknown";
    }
  };

  // Helper function to get badge variant based on status
  const getStatusVariant = (status: BookingItem["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
      case "PAYMENT_FAILED":
      case "NOT_AVAILABLE":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Transform bookings for calendar view
  const calendarBookings = bookings.map((booking) => ({
    id: booking.tripItemId,
    date: booking.startTime.split("T")[0], // Extract date from ISO string
    title: booking.service.serviceName || "Service",
  }));

  // Filter bookings for selected date or date range
  const filteredBookings = selectedDate
    ? bookings.filter(
        (booking) => booking.startTime.split("T")[0] === selectedDate
      )
    : selectedDateRange
    ? bookings.filter((booking) => {
        const bookingDate = booking.startTime.split("T")[0];
        return (
          bookingDate >= selectedDateRange.start &&
          bookingDate <= selectedDateRange.end
        );
      })
    : bookings; // Show all bookings when nothing is selected

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedDateRange(null); // Clear range when single date is selected
  };

  const handleDateRangeSelect = (start: string, end: string) => {
    setSelectedDateRange({ start, end });
    setSelectedDate(null); // Clear single date when range is selected
  };

  const clearSelection = () => {
    setSelectedDate(null);
    setSelectedDateRange(null);
  };

  // Toggle card expansion
  const toggleCardExpansion = (tripItemId: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tripItemId)) {
        newSet.delete(tripItemId);
      } else {
        newSet.add(tripItemId);
      }
      return newSet;
    });
  };

  // Get display title for sidebar
  const getSidebarTitle = () => {
    if (selectedDate) {
      return `Bookings for ${selectedDate}`;
    }
    if (selectedDateRange) {
      return `Bookings from ${selectedDateRange.start} to ${selectedDateRange.end}`;
    }
    return "All Bookings";
  };

  // Get display description for sidebar
  const getSidebarDescription = () => {
    if (selectedDate || selectedDateRange) {
      return `${filteredBookings.length} booking${
        filteredBookings.length !== 1 ? "s" : ""
      } ${selectedDate ? "on this day" : "in this range"}`;
    }
    return "Manage all your bookings and reservations";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
          <ProviderTopBar />
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error || !serviceId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
          <ProviderTopBar />
        </div>
        <div className="text-center p-8 text-red-500">
          <p className="font-medium">Error loading bookings</p>
          <p className="text-sm">{error || "Service ID not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar Section - Takes 3/5 on large screens */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>
                Click on a date to view bookings, or use "Select Range" for date
                ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarView
                bookings={calendarBookings}
                onDateSelect={handleDateSelect}
                onDateRangeSelect={handleDateRangeSelect}
                selectedDate={selectedDate}
                selectedDateRange={selectedDateRange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Bookings Sidebar - Takes 2/5 on large screens, always visible */}
        <div className="lg:col-span-2">
          <Card className="h-fit sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{getSidebarTitle()}</CardTitle>
                  <CardDescription className="text-sm">
                    {getSidebarDescription()}
                  </CardDescription>
                </div>
                {(selectedDate || selectedDateRange) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="max-h-[700px] overflow-y-auto">
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const isExpanded = expandedCards.has(booking.tripItemId);
                    return (
                      <div
                        key={booking.tripItemId}
                        className="border rounded-lg bg-white hover:shadow-sm transition-shadow"
                      >
                        {/* Header - Always visible */}
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() =>
                            toggleCardExpansion(booking.tripItemId)
                          }
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-6 h-6 text-primary-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900">
                                {booking.service.serviceName}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">
                                      {booking.numberOfAdults} adults
                                      {booking.numberOfChildren > 0 &&
                                        `, ${booking.numberOfChildren} children`}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    Units: {booking.noOfUnits}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={getStatusVariant(booking.status)}
                                    className="text-xs"
                                  >
                                    {formatStatus(booking.status)}
                                  </Badge>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  LKR {booking.totalPrice.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(
                                    booking.startTime
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-4 border-t bg-gray-50">
                            {/* Booking Details */}
                            <div className="grid grid-cols-1 gap-3 text-xs pt-4">
                              {/* Date and Time Info */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-600 font-medium">
                                      Start:
                                    </span>
                                  </div>
                                  <span className="text-gray-700">
                                    {new Date(
                                      booking.startTime
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-600 font-medium">
                                      End:
                                    </span>
                                  </div>
                                  <span className="text-gray-700">
                                    {new Date(booking.endTime).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 font-medium">
                                    Booked on:
                                  </span>
                                  <span className="text-gray-700">
                                    {new Date(
                                      booking.bookingDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {/* Financial Details */}
                              <div className="border-t pt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 font-medium">
                                    Total Price:
                                  </span>
                                  <span className="text-gray-900 font-semibold">
                                    LKR {booking.totalPrice.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    Paid Amount:
                                  </span>
                                  <span className="text-green-600 font-medium">
                                    LKR {booking.paidAmount.toLocaleString()}
                                  </span>
                                </div>
                                {booking.dueAmount > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                      Due Amount:
                                    </span>
                                    <span className="text-red-600 font-medium">
                                      LKR {booking.dueAmount.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                {booking.depositAmount > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                      Deposit:
                                    </span>
                                    <span className="text-blue-600 font-medium">
                                      LKR{" "}
                                      {booking.depositAmount.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {booking.status === "PENDING" && (
                              <div className="flex space-x-2 pt-2 border-t">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs"
                                >
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-xs"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No bookings found</p>
                  <p className="text-sm">
                    {selectedDate || selectedDateRange
                      ? "No bookings scheduled for the selected period"
                      : "You don't have any bookings yet for this service"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingsPage;
