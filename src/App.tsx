import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import store from "@/store";
import AppRoutes from "@/AppRoutes";
import Header from "@/components/Header";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />

              <main className="flex-1">
                <AppRoutes />
              </main>

              {/* <Footer /> */}

              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;
