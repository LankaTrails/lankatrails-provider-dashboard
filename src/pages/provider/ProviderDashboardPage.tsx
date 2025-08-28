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
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  MapPin
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Sample data for charts
const bookingsData = [
  { month: 'Jan', bookings: 65, revenue: 95000 },
  { month: 'Feb', bookings: 78, revenue: 110000 },
  { month: 'Mar', bookings: 90, revenue: 125000 },
  { month: 'Apr', bookings: 81, revenue: 115000 },
  { month: 'May', bookings: 95, revenue: 135000 },
  { month: 'Jun', bookings: 124, revenue: 150000 },
];

const revenueByService = [
  { name: 'Tour Guide', value: 60000, color: '#8b5cf6' },
  { name: 'Transport', value: 45000, color: '#06b6d4' },
  { name: 'Accommodation', value: 25000, color: '#10b981' },
  { name: 'Food & Dining', value: 20000, color: '#f59e0b' },
];

const ratingData = [
  { month: 'Jan', rating: 4.2 },
  { month: 'Feb', rating: 4.4 },
  { month: 'Mar', rating: 4.5 },
  { month: 'Apr', rating: 4.6 },
  { month: 'May', rating: 4.7 },
  { month: 'Jun', rating: 4.8 },
];

const listingsData = [
  { month: 'Jan', active: 4, inactive: 1, total: 5 },
  { month: 'Feb', active: 5, inactive: 1, total: 6 },
  { month: 'Mar', active: 6, inactive: 0, total: 6 },
  { month: 'Apr', active: 6, inactive: 1, total: 7 },
  { month: 'May', active: 7, inactive: 1, total: 8 },
  { month: 'Jun', active: 8, inactive: 0, total: 8 },
];

const dailyBookings = [
  { day: 'Mon', bookings: 12 },
  { day: 'Tue', bookings: 18 },
  { day: 'Wed', bookings: 15 },
  { day: 'Thu', bookings: 22 },
  { day: 'Fri', bookings: 28 },
  { day: 'Sat', bookings: 35 },
  { day: 'Sun', bookings: 30 },
];

const stats = [
  {
    title: "Total Bookings",
    value: "124",
    change: "+12%",
    icon: <Calendar className="w-8 h-8 text-white/90" />,
    gradient: "from-indigo-600 via-indigo-500 to-purple-500",
    id: "bookings"
  },
  {
    title: "Revenue",
    value: "LKR 150,000",
    change: "+18%",
    icon: <DollarSign className="w-8 h-8 text-white/90" />,
    gradient: "from-emerald-600 via-emerald-500 to-teal-500",
    id: "revenue"
  },
  {
    title: "Rating",
    value: "4.8",
    change: "+0.2",
    icon: <Star className="w-8 h-8 text-white/90" />,
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    id: "rating"
  },
  {
    title: "Active Listings",
    value: "8",
    change: "+2",
    icon: <Eye className="w-8 h-8 text-white/90" />,
    gradient: "from-sky-600 via-sky-500 to-blue-500",
    id: "listings"
  },
];

const allBookings = [
  {
    id: 1,
    customer: "John Smith",
    service: "Sigiriya Rock Climb Guide",
    serviceId: 101,
    serviceType: "tour-guide",
    type: "activity",
    dateFrom: "2025-07-05",
    dateTo: "2025-07-05",
    status: "pending",
    amount: "85",
  },
  {
    id: 2,
    customer: "Emma Wilson",
    service: "Airport Transfer",
    serviceId: 202,
    serviceType: "transport",
    type: "transport",
    dateFrom: "2025-07-06",
    dateTo: "2025-07-06",
    status: "confirmed",
    amount: "150",
  },
  {
    id: 3,
    customer: "Michael Brown",
    service: "Kandy City Tour",
    serviceId: 103,
    serviceType: "tour-guide",
    type: "activity",
    dateFrom: "2025-07-07",
    dateTo: "2025-07-07",
    status: "completed",
    amount: "120",
  },
];

const BookingsDetailView = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-4 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">Bookings Analytics</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Bookings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">87</p>
              <p className="text-sm text-green-600">+15% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold">4.2h</p>
              <p className="text-sm text-blue-600">+0.5h vs last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">73%</p>
              <p className="text-sm text-green-600">+8% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const RevenueDetailView = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByService}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueByService.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {revenueByService.map((service, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: service.color }}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{service.name}</p>
                <p className="text-xl font-bold">LKR {service.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{((service.value / 150000) * 100).toFixed(1)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const RatingDetailView = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">Rating Analytics</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Rating Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[4, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-4">
                <span className="w-8 text-sm">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: `${star === 5 ? 60 : star === 4 ? 30 : star === 3 ? 8 : star === 2 ? 2 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{star === 5 ? 60 : star === 4 ? 30 : star === 3 ? 8 : star === 2 ? 2 : 0}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600">4.8</div>
            <div className="text-sm text-gray-600">Overall Rating</div>
            <div className="flex justify-center mt-2">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className="w-5 h-5 text-yellow-500 fill-current" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">Positive Reviews</div>
            <div className="text-xs text-gray-500 mt-2">4+ stars</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
            <div className="text-xs text-gray-500 mt-2">All time</div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ListingsDetailView = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4 space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">Listings Analytics</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Listings Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={listingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="active" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
              <Area type="monotone" dataKey="inactive" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Sigiriya Rock Guide</p>
                <p className="text-sm text-gray-600">Tour Guide</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-medium">45 bookings</p>
                <p className="text-sm text-gray-500">4.9★</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Airport Transfer</p>
                <p className="text-sm text-gray-600">Transport</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-medium">32 bookings</p>
                <p className="text-sm text-gray-500">4.7★</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Kandy City Tour</p>
                <p className="text-sm text-gray-600">Tour Guide</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-medium">28 bookings</p>
                <p className="text-sm text-gray-500">4.8★</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Eye className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Locations</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Views</p>
              <p className="text-2xl font-bold">142</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ProviderDashboardPage = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  interface Stat {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    gradient: string;
    id: "bookings" | "revenue" | "rating" | "listings";
  }

  interface Booking {
    id: number;
    customer: string;
    service: string;
    serviceId: number;
    serviceType: string;
    type: string;
    dateFrom: string;
    dateTo: string;
    status: "pending" | "confirmed" | "completed";
    amount: string;
  }

  interface BookingsDetailViewProps {
    onBack: () => void;
  }

  interface RevenueDetailViewProps {
    onBack: () => void;
  }

  interface RatingDetailViewProps {
    onBack: () => void;
  }

  interface ListingsDetailViewProps {
    onBack: () => void;
  }

  const handleStatClick = (statId: Stat["id"]) => {
    setCurrentView(statId);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  if (currentView === "bookings") {
    return <BookingsDetailView onBack={handleBackToDashboard} />;
  }

  if (currentView === "revenue") {
    return <RevenueDetailView onBack={handleBackToDashboard} />;
  }

  if (currentView === "rating") {
    return <RatingDetailView onBack={handleBackToDashboard} />;
  }

  if (currentView === "listings") {
    return <ListingsDetailView onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 space-y-8 p-4">
      <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer`}
            onClick={() => handleStatClick(stat.id)}
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

      {/* All Bookings */}
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between border rounded p-3"
            >
              <div>
                <p className="font-medium text-primary cursor-pointer">{booking.customer}</p>
                <p className="text-sm text-gray-600">{booking.service}</p>
                <p className="text-xs text-gray-500">{booking.dateFrom} to {booking.dateTo}</p>
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
    </div>
  );
};

export default ProviderDashboardPage;