import { useParams } from "react-router-dom";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import InsightsView from "@/components/insights/InsightsView";
import { SLUG_TO_CATEGORY } from "@/services/insights";

const formatServiceTitle = (type?: string) =>
  (type ?? "service")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const ServiceAnalyticsPage = () => {
  const { serviceType } = useParams();
  const category = serviceType ? SLUG_TO_CATEGORY[serviceType] : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="p-2 text-2xl font-bold">{formatServiceTitle(serviceType)} Analytics</h1>
        <ProviderTopBar />
      </div>
      {category ? <InsightsView category={category} /> : <p className="text-gray-500">Unknown service type.</p>}
    </div>
  );
};

export default ServiceAnalyticsPage;
