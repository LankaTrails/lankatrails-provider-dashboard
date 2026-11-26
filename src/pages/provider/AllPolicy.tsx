import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAllPolicies } from "@/services/services";
import { deletePolicy } from "@/services/policyService";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import type { PolicySection, PolicyData, TabData } from "@/types/serviceTypes";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { useToast } from "@/hooks/use-toast";
import { errorMessage } from "@/lib/apiError";
import AddPolicy from "./AddPolicy";

const AllPolicy = () => {
  const [structuredPolicies, setStructuredPolicies] = useState<PolicyData[]>([]);
  const { serviceType } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    fetchAllPolicies()
      .then((policies: PolicySection[]) =>
        setStructuredPolicies(
          policies.map((policy) => ({
            id: policy.id, // the real id, so delete targets the right policy
            heading: policy.heading,
            description: policy.policy,
            isExpanded: false,
          })),
        ),
      )
      .catch((error) => toast({ title: "Error", description: errorMessage(error, "Could not load policies"), variant: "destructive" }));
  }, [toast]);

  const handleRemove = async (item: TabData | PolicyData): Promise<boolean> => {
    if (item.id === null || !window.confirm(`Delete the policy "${item.heading}"?`)) return false;
    try {
      await deletePolicy(item.id);
      toast({ description: "Policy deleted" });
      return true;
    } catch (error) {
      toast({ title: "Error", description: errorMessage(error, "Could not delete the policy"), variant: "destructive" });
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="p-2 text-2xl font-bold">All Policies</h1>
        <ProviderTopBar />
      </div>
      {structuredPolicies.length === 0 ? (
        <p className="text-sm text-gray-500">You have no general policies yet. Add one below.</p>
      ) : (
        <ExpandableSectionComponent
          title="Policies"
          items={structuredPolicies}
          onItemsChange={(items) => setStructuredPolicies(items as PolicyData[])}
          onRemove={handleRemove}
          addButtonText="Add Policy"
          itemName="Policy"
          canAddItems={false}
        />
      )}
      <div className="mt-12">
        <AddPolicy serviceType={serviceType} />
      </div>
    </div>
  );
};

export default AllPolicy;
