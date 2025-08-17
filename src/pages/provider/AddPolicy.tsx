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
import { Plus, FileText, Save, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

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

  const getServiceTypeInfo = () => {
    switch(serviceType) {
      case "activity": return { name: "Activity", color: "from-blue-500 to-blue-600", icon: "🏃" };
      case "tour-guide": return { name: "Tour Guide", color: "from-green-500 to-green-600", icon: "👥" };
      case "transport": return { name: "Transport", color: "from-purple-500 to-purple-600", icon: "🚗" };
      case "food-beverage": return { name: "Food & Beverage", color: "from-orange-500 to-orange-600", icon: "🍽️" };
      case "accommodation": return { name: "Accommodation", color: "from-indigo-500 to-indigo-600", icon: "🏨" };
      default: return { name: "General", color: "from-gray-500 to-gray-600", icon: "📋" };
    }
  };

  const serviceInfo = getServiceTypeInfo();
  const hasIncompletePolicies = policySection.some(item => !item.heading.trim() || !item.description.trim());

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-br ${serviceInfo.color} rounded-xl shadow-lg`}>
              <span className="text-2xl">{serviceInfo.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Create New Policy</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${serviceInfo.color} text-white`}>
                  {serviceInfo.name} Policy
                </span>
                <span className="text-sm text-gray-600">• {policySection.length} section{policySection.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">New</span>
          </div>
        </div>
      </div>

      {/* Enhanced Warning for incomplete policies */}
      {hasIncompletePolicies && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Complete Your Policy</h4>
              <p className="text-sm text-yellow-700">
                Please fill in all required fields before saving your policy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Policy Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Policy Details</h4>
              <p className="text-sm text-gray-600">Define your terms and conditions</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ExpandableSectionComponent
            title="New Policy"
            items={policySection}
            onItemsChange={handlePoliciesChange}
            addButtonText="Add Another Policy"
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
