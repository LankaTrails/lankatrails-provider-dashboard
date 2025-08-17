import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  Star,
  Eye,
  Plus,
  MessageSquare,
  BarChart3,
} from "lucide-react";
// import ServiceForm from "@/components/ServiceForm"; // TODO: Update to use new service creation flow

const stats = [
  {
    title: "Total Bookings",
    value: "124",
    change: "+12%",
    icon: <Calendar className="w-8 h-8 text-white/90" />,
    gradient: "from-indigo-600 via-indigo-500 to-purple-500",
  },
  {
    title: "Revenue",
    value: "LKR 150,000",
    change: "+18%",
    icon: <DollarSign className="w-8 h-8 text-white/90" />,
    gradient: "from-emerald-600 via-emerald-500 to-teal-500",
  },
  {
    title: "Rating",
    value: "4.8",
    change: "+0.2",
    icon: <Star className="w-8 h-8 text-white/90" />,
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
  },
  {
    title: "Active Listings",
    value: "8",
    change: "+2",
    icon: <Eye className="w-8 h-8 text-white/90" />,
    gradient: "from-sky-600 via-sky-500 to-blue-500",
  },
];

const recentBookings = [
  {
    id: 1,
    customer: "John Smith",
    service: "Sigiriya Rock Climb Guide",
    date: "2025-07-05",
    status: "confirmed",
    amount: "85",
  },
  {
    id: 2,
    customer: "Emma Wilson",
    service: "Cultural Triangle Tour",
    date: "2025-07-06",
    status: "pending",
    amount: "150",
  },
  {
    id: 3,
    customer: "David Chen",
    service: "Wildlife Safari - Yala",
    date: "2025-07-07",
    status: "completed",
    amount: "120",
  },
];

const ProviderDashboardPage = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 space-y-8 p-4">
      <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-80">
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setFormOpen(true)}
          className="h-24 bg-primary-600 hover:bg-primary-700 text-white flex flex-col items-center justify-center space-y-1"
        >
          <Plus className="w-6 h-6" />
          <span className="text-sm">Add Service</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-1"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-sm">Manage Calendar</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-1"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-sm">Messages</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-1"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-sm">View Analytics</span>
        </Button>
      </div>

      {/* Recent Bookings */}
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between border rounded p-3"
            >
              <div>
                <p className="font-medium">{booking.customer}</p>
                <p className="text-sm text-gray-600">{booking.service}</p>
                <p className="text-xs text-gray-500">{booking.date}</p>
              </div>
              <div className="text-right">
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
                <p className="text-sm font-medium mt-1">LKR {booking.amount}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Service form modal */}
      {/* TODO: Update to use new service creation flow */}
      {/* <ServiceForm open={formOpen} onOpenChange={setFormOpen} /> */}
    </div>
  );
};

export default ProviderDashboardPage;
