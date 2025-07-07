import ProviderSidebar from "@/components/provider/ProviderSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="bg-gradient-to-br  from-primary-50 via-white to-primary-50">
      <div
        className="container mx-auto px-4 lg:flex lg:space-x-8"
        style={{ minHeight: "calc(100vh - 72px)" }}
      >
        <ProviderSidebar />
        <div className="flex-1 overflow-auto lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;