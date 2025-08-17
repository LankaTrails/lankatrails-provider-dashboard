import { useEffect, useState } from "react";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import { createPolicy } from "@/services/policyService";
import { useNavigate } from "react-router-dom";
import type { PolicyData } from "@/types/serviceTypes";
import AlertToast from "@/components/forms/AlertToast";
import { createActivityPolicy } from "@/services/activityService";
import { createGuidePolicy } from "@/services/guideService";
import { createTransportPolicy } from "@/services/transportationService";
import { createFoodPolicy } from "@/services/FoodBeverage";
import { createAccommodationPolicy } from "@/services/accomodation";

// Add prop type for serviceType
interface AddPolicyProps {
  serviceType?: string;
  onSuccess?: () => void;
  resetTrigger?: any; // Add resetTrigger prop, type as needed
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

// Accept props in the component
const AddPolicy: React.FC<AddPolicyProps> = ({ serviceType, onSuccess, resetTrigger }) => {
  const [policySection, setPolicySection] = useState<PolicyData[]>([
    { id: Math.random(), heading: "", description: "", isExpanded: true }
  ]);

  // Reset fields when resetTrigger changes
  useEffect(() => {
    setPolicySection([{ id: Math.random(), heading: "", description: "", isExpanded: true }]);
  }, [resetTrigger]);

  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleSave = async (items: PolicyData[]) => {
    try {
      // You can use serviceType here if needed
      const policySection = {
        id: Math.random(), // Generate a unique ID for the policy section
        heading: items.map((item) => item.heading).join(", "),
        policy: items.map((item) => item.description).join("\n"),
        serviceType, // Pass serviceType to backend if needed
      };
      
      switch(serviceType){
        case undefined:
          await createPolicy(policySection);
          navigate("/provider/policy/all");
          break;
        case "activity":
          console.log("Creating activity policy with data:", policySection);
          await createActivityPolicy(policySection);
          navigate("/provider/policy/activity");
          break;
        case "tour-guide":
          await createGuidePolicy(policySection);
          break;
        case "transport":
          await createTransportPolicy(policySection);
          break;
        case "food-beverage":
          await createFoodPolicy(policySection);
          break;
        case "accommodation":
          await createAccommodationPolicy(policySection);
          break;
      }
      if (onSuccess) onSuccess(); // Call the callback after success
     
    } catch (error: any) {
      let rawMessage = error.message;
      let cleanedMessage = rawMessage.replace(/"[^"]*"/g, "");
      let message = cleanedMessage.split(":")[0].trim();
      setToast({
        message,
        type: "error",
      });
    }
  };

  const handleCloseToast = (): void => {
    setToast(null);
  };

  // Add handler for ExpandableSectionComponent items change
  const handlePoliciesChange = (items: PolicyData[]) => {
    setPolicySection(items);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mt-8">
          <ExpandableSectionComponent
            title="New Policy"
            items={policySection}
            onItemsChange={handlePoliciesChange}
            addButtonText="Add Policy"
            itemName="Policy"
            canAddItems={true}
            showSubmitButton={true}
            onSave={handleSave}
          />
        </div>
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

export default AddPolicy;
