import ProviderTopBar from "@/components/provider/ProviderTopBar";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import type { PolicySection, PolicyData } from "@/types/serviceTypes";
import { useState } from "react";


const AddPolicy = () => {
  // Define initial policies array
  const [policyData, setPolicyData] = useState<PolicyData[]>([]);

  // Handler for updating policies
  const handlePoliciesChange = (newItems: PolicyData[]) => {
    setPolicyData(newItems);
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Add policies</h1>
        <ProviderTopBar />
        <ExpandableSectionComponent
            title="Policies"
            items={policyData}
            onItemsChange={handlePoliciesChange}
            addButtonText="Add Policy"
            itemName="Policy"
          />
      </div>
    </div>
  );
};

export default AddPolicy;
