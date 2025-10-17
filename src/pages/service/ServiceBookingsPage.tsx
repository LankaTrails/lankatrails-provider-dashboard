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
import { Users, Clock, CheckCircle, Calendar, X } from "lucide-react";
import CalendarView from '@/components/CalendarView';
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useState } from "react";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const ServiceBookingsPage = () => {
  const { serviceType } = useParams();
  const title = formatServiceTitle(serviceType);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const recentBookings = [
    {
      id: 1,
      customer: "John Smith",
      service: "Sigiriya Rock Climb Guide",
      date: "2024-01-15",
      status: "confirmed",
      amount: "85",
    },
    {
      id: 2,
      customer: "Emma Wilson",
      service: "Cultural Triangle Tour",
      date: "2024-01-18",
      status: "pending",
      amount: "150",
    },
    {
      id: 3,
      customer: "David Chen",
      service: "Wildlife Safari - Yala",
      date: "2024-01-20",
      status: "completed",
      amount: "120",
    },
    {
      id: 4,
      customer: "Sarah Johnson",
      service: "Sigiriya Rock Climb Guide",
      date: "2024-01-15",
      status: "confirmed",
      amount: "85",
    },
  ];
  
  const calendarBookings = recentBookings.map((b) => ({ id: b.id, date: b.date, title: b.service }));

  // Filter bookings for selected date
  const filteredBookings = selectedDate 
    ? recentBookings.filter(booking => booking.date === selectedDate)
    : [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section - Takes 2/3 on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>
                Click on a date to view bookings for that day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarView 
                bookings={calendarBookings} 
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </CardContent>
          </Card>

          {/* All Bookings Card (shown when no date is selected) */}
          {!selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>
                  Manage all your bookings and reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.customer}</h4>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {booking.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <p className="text-lg font-semibold text-primary-500">
                          ${booking.amount}
                        </p>
                        <div className="space-x-2">
                          {booking.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Selected Date Bookings Sidebar - Takes 1/3 on large screens */}
        {selectedDate && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Bookings for {selectedDate}</CardTitle>
                    <CardDescription>
                      {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} on this day
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelectedDate}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{booking.customer}</h4>
                            <p className="text-xs text-gray-600">{booking.service}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-semibold text-primary-500">
                            ${booking.amount}
                          </p>
                        </div>

                        {booking.status === "pending" && (
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No bookings</p>
                    <p className="text-sm">No bookings scheduled for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceBookingsPage;