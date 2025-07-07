import React from "react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import AnalyticsCharts from "@/components/AnalyticsCharts";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
const ServiceAnalyticsPage: React.FC = () => {
  const { serviceType } = useParams();
  const title = formatServiceTitle(serviceType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <AnalyticsCharts />
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Reports</CardTitle>
          <CardDescription>Track your performance and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary-500" />
              <p className="text-lg font-medium">Analytics Dashboard</p>
              <p className="text-sm">View detailed performance metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceAnalyticsPage;
