import { useEffect, useState } from "react";
import { fetchAllPolicies } from "@/services/services";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import type { PolicySection, PolicyData } from "@/types/serviceTypes";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import AddPolicy from "./AddPolicy";
import { useParams } from "react-router-dom";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

const AllPolicy = () => {
  const [structuredPolicies, setStructuredPolicies] = useState<PolicyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { serviceType } = useParams();
  console.log("Service Type:", serviceType);
  
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllPolicies();
        console.log("Fetched Policies:", response);
        const structured = response.map((policy: PolicySection, index: number) => ({
          id: index,
          heading: policy.heading,
          description: policy.policy,
          isExpanded: false,
        }));
        setStructuredPolicies(structured);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPolicies();
  }, []);

  const getPolicyStats = () => {
    const total = structuredPolicies.length;
    const complete = structuredPolicies.filter(p => p.heading && p.description).length;
    const incomplete = structuredPolicies.filter(p => !p.heading || !p.description).length;
    return { total, complete, incomplete };
  };

  const stats = getPolicyStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">All Policies</h1>
        <ProviderTopBar />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Policies Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">Total Policies</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Active Policies Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">Active</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{stats.complete}</p>
            </div>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Draft Policies Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">Draft</p>
              <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.incomplete}</p>
            </div>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      {/* Display all the policies in a structured format */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading policies...</p>
          </div>
        </div>
      ) : (
        <ExpandableSectionComponent
          title="Policies"
          items={structuredPolicies}
          onItemsChange={setStructuredPolicies}
          addButtonText="Add Policy"
          itemName="Policy"
          canAddItems={false}
        />
      )}

      {/* AddPolicy component at the bottom */}
      <div className="mt-12">
        <AddPolicy serviceType={serviceType} />
      </div>
    </div>
  );
};

export default AllPolicy;
