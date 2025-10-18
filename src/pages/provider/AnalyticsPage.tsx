import AnalyticsCharts from "@/components/AnalyticsCharts";
import ProviderTopBar from "@/components/provider//ProviderTopBar";
import { RatingsAnalytics } from "@/components/analytics/RatingsAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Star, TrendingUp, Calendar } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Track your performance and customer satisfaction</p>
        <ProviderTopBar />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Ratings
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Bookings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <AnalyticsCharts />
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings" className="space-y-6">
          <RatingsAnalytics />
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary-500" />
            <p className="text-lg font-medium">Booking Analytics</p>
            <p className="text-sm">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
