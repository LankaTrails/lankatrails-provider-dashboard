import ProviderTopBar from "@/components/provider/ProviderTopBar";
import InsightsView from "@/components/insights/InsightsView";

const AnalyticsPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="p-2 text-2xl font-bold">Analytics</h1>
      <ProviderTopBar />
    </div>
    <InsightsView />
  </div>
);

export default AnalyticsPage;
