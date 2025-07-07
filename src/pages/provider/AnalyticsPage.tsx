import AnalyticsCharts from "@/components/AnalyticsCharts";
import ProviderTopBar from "@/components/provider//ProviderTopBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Analytics</h1>
        <ProviderTopBar />
      </div>
      <AnalyticsCharts />
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Reports</CardTitle>
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

export default AnalyticsPage;
