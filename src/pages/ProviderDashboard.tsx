import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import CalendarView from "@/components/CalendarView";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import ReviewList from "@/components/ReviewList";
// import ServiceForm from '@/components/ServiceForm'; // TODO: Update to use new service creation flow
import MessagingPlatform from "@/components/MessagingPlatform";
import {
  Calendar,
  MessageSquare,
  BarChart3,
  Star,
  Plus,
  Eye,
  Edit,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Package,
} from "lucide-react";

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const initialCat = searchParams.get("category") || "activity";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);

  const gradientClasses = [
    "from-indigo-600 via-indigo-500 to-purple-500",
    "from-emerald-600 via-emerald-500 to-teal-500",
    "from-yellow-500 via-amber-500 to-orange-500",
    "from-sky-600 via-sky-500 to-blue-500",
  ];

  const stats = [
    {
      title: "Total Bookings",
      value: "124",
      change: "+12%",
      icon: <Calendar className="w-8 h-8 text-white/90" />,
    },
    {
      title: "Revenue",
      value: "3,450",
      change: "+18%",
      icon: <DollarSign className="w-8 h-8 text-white/90" />,
    },
    {
      title: "Rating",
      value: "4.8",
      change: "+0.2",
      icon: <Star className="w-8 h-8 text-white/90" />,
    },
    {
      title: "Active Listings",
      value: "8",
      change: "+2",
      icon: <Eye className="w-8 h-8 text-white/90" />,
    },
  ];

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

  const calendarBookings = recentBookings.map((b) => ({
    id: b.id,
    date: b.date,
    title: b.service,
  }));

  const services = [
    {
      id: 1,
      title: "Sigiriya Rock Climb Guide",
      type: "Tour Guide",
      category: "tour-guides",
      price: "85/day",
      bookings: "12 this month",
      rating: 4.9,
      status: "active",
    },
    {
      id: 2,
      title: "Cultural Triangle Tour",
      type: "Tour Package",
      category: "tour-guides",
      price: "150/person",
      bookings: "8 this month",
      rating: 4.7,
      status: "active",
    },
    {
      id: 3,
      title: "Wildlife Safari - Yala",
      type: "Activity",
      category: "activity",
      price: "120/person",
      bookings: "15 this month",
      rating: 4.8,
      status: "active",
    },
    {
      id: 4,
      title: "Airport Transfers",
      type: "Private / Shuttle / Limo",
      category: "transportation",
      price: "30 - 100",
      bookings: "10 this month",
      rating: 4.6,
      status: "active",
    },
    {
      id: 5,
      title: "Car Rentals",
      type: "Self-drive / Luxury / 4x4",
      category: "transportation",
      price: "40+/day",
      bookings: "7 this month",
      rating: 4.5,
      status: "active",
    },
    {
      id: 6,
      title: "Public Transport Guidance",
      type: "Metro / Bus Passes",
      category: "transportation",
      price: "10 pass",
      bookings: "3 this month",
      rating: 4.4,
      status: "active",
    },
    {
      id: 7,
      title: "Specialty Transport",
      type: "Bike / Tuk-tuk / Yacht",
      category: "transportation",
      price: "15+",
      bookings: "5 this month",
      rating: 4.7,
      status: "active",
    },
    {
      id: 8,
      title: "Long-Distance Travel",
      type: "Intercity Bus / Train / Flight",
      category: "transportation",
      price: "30 - 200",
      bookings: "4 this month",
      rating: 4.3,
      status: "active",
    },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const categories = [
    { label: "Activity Provider", slug: "activity" },
    { label: "Tour Guides", slug: "tour-guides" },
    { label: "Transportation Services", slug: "transportation" },
    { label: "Food & Beverage Services", slug: "food-beverage" },
    { label: "Accommodation Providers", slug: "accommodation" },
  ];

  const reviews = [
    {
      id: 1,
      customer: "Liam Brown",
      rating: 5,
      comment: "Amazing experience! Highly recommend.",
      date: "2024-01-21",
    },
    {
      id: 2,
      customer: "Sophia Lee",
      rating: 4,
      comment: "Great guide and very friendly.",
      date: "2024-01-18",
    },
    {
      id: 3,
      customer: "Oliver Smith",
      rating: 5,
      comment: "Best tour of my life! Thank you.",
      date: "2024-01-15",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <Header />

      <div className="container mx-auto px-4 py-8 lg:flex lg:space-x-8">
        {/* Sidebar */}
        <aside className="lg:w-64 w-full lg:sticky lg:top-20 lg:self-start mb-8 lg:mb-0">
          <Card className="shadow-lg">
            <CardHeader
              onClick={() => navigate("/profile")}
              className="items-center text-center pb-0 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <img
                src={user?.profilePictureUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white -mt-12 mx-auto shadow-md"
              />
              <CardTitle className="mt-2 text-xl">
                {user?.businessName}
              </CardTitle>
              <CardDescription className="text-gray-500">
                Service Categories
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 mt-4">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Button
                      variant={
                        selectedCategory === cat.slug &&
                        activeTab === "services"
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start capitalize"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSearchParams({ category: cat.slug });
                        setActiveTab("services");
                      }}
                    >
                      {cat.label}
                    </Button>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <Button
                variant={activeTab === "messages" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveTab("messages")}
              >
                Messages
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "messages" ? (
            <MessagingPlatform />
          ) : (
            <>
              {/* Dashboard Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Provider Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome{" "}
                  {user?.businessName
                    ? user.businessName.split(" ")[0]
                    : "Provider"}
                  ! Manage your services and connect with travelers.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className={`bg-gradient-to-br ${gradientClasses[index]} text-white border-0 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">{stat.title}</p>
                          <p className="text-3xl font-extrabold">
                            {stat.value}
                          </p>
                          <p className="text-sm opacity-80">
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                          {stat.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Dashboard Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid grid-cols-6 w-full max-w-4xl">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Recent Bookings</CardTitle>
                          <Button variant="outline" size="sm">
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div>
                                <h4 className="font-medium">
                                  {booking.customer}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {booking.service}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {booking.date}
                                </p>
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
                                <p className="text-sm font-medium mt-1">
                                  {booking.amount}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            onClick={() => setFormOpen(true)}
                            className="h-20 bg-primary-500 hover:bg-primary-600 text-white flex flex-col items-center justify-center space-y-2"
                          >
                            <Plus className="w-6 h-6" />
                            <span>Add Service</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <Calendar className="w-6 h-6" />
                            <span>Update Calendar</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <MessageSquare className="w-6 h-6" />
                            <span>Messages</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <BarChart3 className="w-6 h-6" />
                            <span>View Analytics</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Your Services</h2>
                    <Button
                      onClick={() => setFormOpen(true)}
                      className="bg-primary-500 hover:bg-primary-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Service
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <Card
                          key={service.id}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{service.type}</Badge>
                              <Badge
                                variant={
                                  service.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {service.status}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">
                              {service.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Price:
                                </span>
                                <span className="font-semibold text-primary-500">
                                  {service.price}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Bookings:
                                </span>
                                <span className="font-medium">
                                  {service.bookings}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Rating:
                                </span>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="font-medium ml-1">
                                    {service.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    navigate(`/services/${service.id}`)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    navigate(`/services/${service.id}/edit`)
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center space-y-4 py-12 bg-white border-2 border-dashed border-gray-200 rounded-lg shadow-sm">
                        <Package className="w-12 h-12 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-700">
                          No services in this category
                        </h3>
                        <p className="text-sm text-gray-500">
                          Click below to add your first service.
                        </p>
                        <Button
                          onClick={() => setFormOpen(true)}
                          className="bg-primary-500 hover:bg-primary-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Service
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Other tabs placeholder */}
                <TabsContent value="bookings">
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
                                <h4 className="font-medium">
                                  {booking.customer}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {booking.service}
                                </p>
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
                </TabsContent>

                <TabsContent value="calendar">
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
                          <p className="text-sm">
                            Manage your availability and bookings
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="messages" className="space-y-6">
                  <MessagingPlatform />
                </TabsContent>

                <TabsContent value="analytics">
                  <AnalyticsCharts />
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics & Reports</CardTitle>
                      <CardDescription>
                        Track your performance and revenue
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                          <p className="text-lg font-medium">
                            Analytics Dashboard
                          </p>
                          <p className="text-sm">
                            View detailed performance metrics
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <ReviewList reviews={reviews} />
                </TabsContent>
              </Tabs>
            </>
          )}
          {/* TODO: Update to use new service creation flow */}
          {/* <ServiceForm open={formOpen} onOpenChange={setFormOpen} /> */}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
