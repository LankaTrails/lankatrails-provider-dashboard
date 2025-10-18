import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoutes";
import DashboardLayout from "@/components/provider/ProviderDashboard";
import ServiceListPage from "@/pages/service/ServiceListPage";
import AddServicePage from "./pages/service/AddServicePage";
import ServiceBookingsPage from "@/pages/service/ServiceBookingsPage";
import ServiceReviewsPage from "@/pages/service/ServiceReviewsPage";
import ServiceAnalyticsPage from "@/pages/service/ServiceAnalyticsPage";
import ProviderDashboardPage from "@/pages/provider/ProviderDashboardPage";
import ServiceEditPage from "@/pages/service/ServiceEditPage";
import ServiceViewPage from "@/pages/service/ServiceViewPage";
import MessagesPage from "@/pages/provider/MessagePage";
import AnalyticsPage from "@/pages/provider/AnalyticsPage";
import Profile from "@/pages/provider/Profile";
import NotFound from "@/pages/NotFound";
import ContactPerson from "./pages/provider/ContactPerson";
import AllPolicy from "./pages/provider/AllPolicy";
import AddActivityPolicy from "./pages/provider/AddActivityPolicy";
import AddTransportPolicy from "./pages/provider/AddTransportPolicy";
import AddTourGuidePolicy from "./pages/provider/AddTourGuidePolicy";
import AddFoodBeveragePolicy from "./pages/provider/AddFoodBeveragePolicy";
import AddAccommodationPolicy from "./pages/provider/AddAccommodationPolicy";

const AppRoutes = () => {
  const { isLoading, restoreSession } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      restoreSession().finally(() => setInitialized(true));
    }
  }, [initialized, restoreSession]);

  if (!initialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/provider"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProviderDashboardPage />} />
        <Route path="dashboard" element={<ProviderDashboardPage />} />

        {/* Dynamic service routes */}
        <Route path=":serviceType">
          <Route index element={<ServiceListPage />} />
          <Route path="list" element={<ServiceListPage />} />
          <Route path="add" element={<AddServicePage />} />
          <Route path="analytics" element={<ServiceAnalyticsPage />} />
          <Route path=":id">
            <Route index element={<ServiceViewPage />} />
            <Route path="view" element={<ServiceViewPage />} />
            <Route path="edit" element={<ServiceEditPage />} />
            <Route path="bookings" element={<ServiceBookingsPage />} />
            <Route path="reviews" element={<ServiceReviewsPage />} />
          </Route>
        </Route>
        <Route path="messages" element={<MessagesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="details" element={<Profile />} />
          <Route path="contact" element={<ContactPerson />} />
        </Route>
        <Route path="policy">
          <Route index element={<AllPolicy />} />
          <Route path="all" element={<AllPolicy />} />
          {/* <Route path="add" element={<AddPolicy />} /> */}
          <Route path="activity" element={<AddActivityPolicy />} />
          <Route path="tour-guide" element={<AddTourGuidePolicy />} /> 
          <Route path="transport" element={<AddTransportPolicy />} />
          <Route path="food-beverage" element={<AddFoodBeveragePolicy />} />
          <Route path="accommodation" element={<AddAccommodationPolicy />} />
        </Route>
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
