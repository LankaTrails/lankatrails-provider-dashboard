import { useState } from "react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import ExpandableSectionComponent from "@/components/forms/ExpandableSectionComponent";
import { createPolicy } from "@/services/policyService";
import { useNavigate } from "react-router-dom";
import type { PolicyData, ServiceFormData } from "@/types/serviceTypes";
import AlertToast from "@/components/forms/AlertToast";


interface ToastState {
  message: string;
  type: "success" | "error";
}

const AddPolicy = () => {
  const [initialData, setInitialData] = useState<ServiceFormData | undefined>();

  const [policySection, setPolicySection] = useState<PolicyData[]>(
    (initialData?.policySection || [{ heading: "", policy: "" }]).map(
      (policy) => ({
        id: Math.random(),
        heading: policy.heading,
        description: policy.policy,
        isExpanded: true,
      })
    )
  );

  const handlePoliciesChange = (newItems: PolicyData[]) => {
    setPolicySection(newItems);
  };

  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastState | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [responseData, setResponseData] = useState<String>();
  const handleSave = async (items: PolicyData[]) => {
    // setIsSubmitting(true);
    try {
      // Transform PolicyData[] to PolicySection
      const policySection = {
        heading: items.map(item => item.heading).join(", "),
        policy: items.map(item => item.description).join("\n"),
        // id: items.length > 0 ? items[0].id : "",
      };
      
      await createPolicy(policySection);
      
      navigate("/provider/policy/all");

    } catch (error: any) {
         console.error("Error adding service:", error);

      // let message =
      //   error.userMessage || error.message || "An unexpected error occurred";

      // if (error.details && typeof error.details === "object") {
      //   const errorMessages = Object.values(error.details).join("\n");
      //   message += `:\n${errorMessages}`;
      // }
      let rawMessage = error.message ;
      // || "Failed to save policies.";
  
  // Remove anything in quotes like "j5imunpcu"
      let cleanedMessage = rawMessage.replace(/"[^"]*"/g, ''); // removes quoted text

      let message=cleanedMessage.split(":")[0].trim();

      setToast({
        message,
        type: "error",
      });
    }
      
  };
  const handleCloseToast = (): void => {
    setToast(null);
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-2xl p-2 font-bold">Add policies</h1> */}
        {/* <ProviderTopBar /> */}
        <div className= "mt-8">
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
