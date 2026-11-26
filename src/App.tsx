import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import store from "@/store";
import AppRoutes from "@/AppRoutes";
import Header from "@/components/Header";


const App = () => {
  return (
    <ReduxProvider store={store}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />

              <main className="flex-1">
                <AppRoutes />
              </main>


              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </TooltipProvider>
    </ReduxProvider>
  );
};

export default App;
