import { useEffect, useState } from "react";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import type { PolicySection, PolicyData } from "@/types/serviceTypes";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import AddPolicy from "./AddPolicy"; // <-- Import AddPolicy
import { useParams } from "react-router-dom";
import AlertToast from "@/components/forms/AlertToast";
import { fetchAllTransportPolicies } from "@/services/transportationService";


const AddTransportPolicy = () => {
  const [structuredPolicies, setStructuredPolicies] = useState<PolicyData[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0); // For resetting AddPolicy
  const { serviceType } = useParams();

  // Move loadPolicies outside useEffect
  const loadPolicies = async () => {
    try {
      const response = await fetchAllTransportPolicies();
      if (response.totalElements != 0) {
        const structured = response.map((policy: PolicySection, index: number) => ({
          id: policy.id?.toString() || `policy-${index}`,
          heading: policy.heading,
          description: policy.policy,
          isExpanded: false,
        }));
        setStructuredPolicies(structured);
      } else {
        setStructuredPolicies([]);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handlePolicyAdded = () => {
    setToast({ message: "Policy added successfully!", type: "success" });
    loadPolicies(); // Refresh policies
    setResetTrigger(prev => prev + 1); // Change trigger to reset AddPolicy form
  };

  const handleCloseToast = () => setToast(null);

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
        <AddPolicy  serviceType ={"transport"} onSuccess={handlePolicyAdded} resetTrigger={resetTrigger} />
      </div>
      {toast && (
        <AlertToast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default AddTransportPolicy;
