import type { PolicySection } from "@/types/serviceTypes";
import api from "@/api/axiosInstance";

export async function fetchAllPolicies(): Promise<PolicySection[]> {
  try {
    const response = await api.get("/provider/policies");
    return response.data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw error;
  }
}

export async function createPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    const response = await api.post("/provider/add/policy", policyData);
    return response.data;
  } catch (error :any) {
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }

    throw {
      message: 'Failed to add new activity',
      code: 'UNKNOWN_ERROR',
    };
  }
}
