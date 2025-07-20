import { useEffect, useState } from "react";
import { fetchAllPolicies } from "@/services/activityService";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import type { PolicySection, PolicyData } from "@/types/serviceTypes";
import ProviderTopBar from "@/components/provider/ProviderTopBar";

const AllPolicy = () => {
  const [structuredPolicies, setStructuredPolicies] = useState<PolicyData[]>([]);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const response = await fetchAllPolicies();
        console.log("Fetched Policies:", response);
        const structured = response.map((policy: PolicySection, index: number) => ({
          id: policy.id?.toString() || `policy-${index}`,
          heading: policy.heading,
          description: policy.policy,
          isExpanded: false,
        }));
        setStructuredPolicies(structured);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    loadPolicies();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">All Policies</h1>
        <ProviderTopBar />
      </div>

      <ExpandableSectionComponent
        title="Policies"
        items={structuredPolicies}
        onItemsChange={setStructuredPolicies}
        addButtonText="Add Policy"
        itemName="Policy"
        canAddItems={false} // Disable adding new items in this view
      />
    </div>
  );
};

export default AllPolicy;
