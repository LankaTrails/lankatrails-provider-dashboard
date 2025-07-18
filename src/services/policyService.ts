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
  } catch (error) {
    console.error("Error creating policy:", error);
    throw error;
  }
}
