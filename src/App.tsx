import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderDashboard from "./pages/ProviderDashboard";
import ServiceEdit from "./pages/ServiceEdit";
import ServiceView from "./pages/ServiceView";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

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
        path="/provider-dashboard"
        element={
          <ProtectedRoute>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id/edit"
        element={
          <ProtectedRoute>
            <ServiceEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id"
        element={
          <ProtectedRoute>
            <ServiceView />
          </ProtectedRoute>
        }
      />
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

export default App;
