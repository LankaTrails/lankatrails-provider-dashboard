import { useEffect, useState } from "react";
import { fetchAllPolicies } from "@/services/services";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import type { PolicySection, PolicyData } from "@/types/serviceTypes";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import AddPolicy from "./AddPolicy"; // <-- Import AddPolicy
import { fetchAllTourGuides } from "@/services/activityService";

const AddTourGuidePolicy = () => {
  const [structuredPolicies, setStructuredPolicies] = useState<PolicyData[]>([]);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const response = await fetchAllTourGuides();
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
      {/* Display all the policies in a structured format */}
      <ExpandableSectionComponent
        title="Policies"
        items={structuredPolicies}
        onItemsChange={setStructuredPolicies}
        addButtonText="Add Policy"
        itemName="Policy"
        canAddItems={false} // Disable adding new items in this view
      />

      {/* AddPolicy component at the bottom */}
      <div className="mt-12">
        <AddPolicy />
      </div>
    </div>
  );
};

export default AddTourGuidePolicy;
