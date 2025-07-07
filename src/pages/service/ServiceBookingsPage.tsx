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
import { Users, Clock, CheckCircle, Calendar } from "lucide-react";
import CalendarView from '@/components/CalendarView';
import ProviderTopBar from "@/components/provider/ProviderTopBar";

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
  ];
  
  const calendarBookings = recentBookings.map((b) => ({ id: b.id, date: b.date, title: b.service }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
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
                    {booking.amount}
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
      <CalendarView bookings={calendarBookings} />
      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
          <CardDescription>
            Manage your availability and schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-500" />
              <p className="text-lg font-medium">Calendar View</p>
              <p className="text-sm">Manage your availability and bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceBookingsPage;
