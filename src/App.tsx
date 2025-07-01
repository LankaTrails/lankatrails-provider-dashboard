import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderDashboard from "./pages/ProviderDashboard";
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
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

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
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


export default App;
