import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoutes";
import DashboardLayout from "@/components/provider/ProviderDashboard";

// Pages load on demand (the service forms, maps and charts are large).
const ServiceListPage = lazy(() => import("@/pages/service/ServiceListPage"));
const AddServicePage = lazy(() => import("@/pages/service/AddServicePage"));
const ServiceBookingsPage = lazy(() => import("@/pages/service/ServiceBookingsPage"));
const ServiceReviewsPage = lazy(() => import("@/pages/service/ServiceReviewsPage"));
const ServiceAnalyticsPage = lazy(() => import("@/pages/service/ServiceAnalyticsPage"));
const ProviderDashboardPage = lazy(() => import("@/pages/provider/ProviderDashboardPage"));
const ServiceEditPage = lazy(() => import("@/pages/service/ServiceEditPage"));
const ServiceViewPage = lazy(() => import("@/pages/service/ServiceViewPage"));
const MessagesPage = lazy(() => import("@/pages/provider/MessagePage"));
const AnalyticsPage = lazy(() => import("@/pages/provider/AnalyticsPage"));
const Profile = lazy(() => import("@/pages/provider/Profile"));
const ContactPerson = lazy(() => import("@/pages/provider/ContactPerson"));
const License = lazy(() => import("@/pages/provider/License"));
const AllPolicy = lazy(() => import("@/pages/provider/AllPolicy"));
const AddActivityPolicy = lazy(() => import("@/pages/provider/AddActivityPolicy"));
const AddTransportPolicy = lazy(() => import("@/pages/provider/AddTransportPolicy"));
const AddTourGuidePolicy = lazy(() => import("@/pages/provider/AddTourGuidePolicy"));
const AddFoodBeveragePolicy = lazy(() => import("@/pages/provider/AddFoodBeveragePolicy"));
const AddAccommodationPolicy = lazy(() => import("@/pages/provider/AddAccommodationPolicy"));
const PaymentsPage = lazy(() => import("@/pages/provider/PaymentsPage"));
const Register = lazy(() => import("@/pages/Register"));

const FullPageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center gap-2 text-gray-500">
    <Loader2 className="h-6 w-6 animate-spin" /> Loading...
  </div>
);

const AppRoutes = () => {
  const { isProvider, restoreSession } = useAuth();
  const [sessionChecked, setSessionChecked] = useState(false);

  // Resume an existing session (refresh cookie) before deciding where to route.
  useEffect(() => {
    restoreSession().finally(() => setSessionChecked(true));
  }, [restoreSession]);

  if (!sessionChecked) {
    return <FullPageLoader />;
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={isProvider ? <Navigate to="/provider" replace /> : <Login />} />
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
        <Route path="onboarding">
          <Route index element={<PaymentsPage />} />
          <Route path="return" element={<PaymentsPage mode="return" />} />
          <Route path="refresh" element={<PaymentsPage mode="refresh" />} />
        </Route>
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="details" element={<Profile />} />
          <Route path="contact" element={<ContactPerson />} />
          <Route path="license" element={<License />} />
        </Route>
        <Route path="policy">
          <Route index element={<AllPolicy />} />
          <Route path="all" element={<AllPolicy />} />
          <Route path="activity" element={<AddActivityPolicy />} />
          <Route path="tour-guide" element={<AddTourGuidePolicy />} />
          <Route path="transport" element={<AddTransportPolicy />} />
          <Route path="food-beverage" element={<AddFoodBeveragePolicy />} />
          <Route path="accommodation" element={<AddAccommodationPolicy />} />
        </Route>
      </Route>


      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
