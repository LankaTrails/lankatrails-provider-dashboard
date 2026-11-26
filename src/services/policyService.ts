import type { PolicySection } from "@/types/serviceTypes";
import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";

export async function fetchAllPolicies(): Promise<PolicySection[]> {
  try {
    const response = await api.get("/provider/policies");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Could not load policies");
  }
}

export async function createPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/add/policy", policyData);
    return response.data;
  } catch (error) {
    throw toApiError(error, 'Failed to add new activity');
  }
}

export async function deletePolicy(policyId: number): Promise<void> {
  try {
    await api.delete(`/provider/delete/policy/${policyId}`);
  } catch (error) {
    throw toApiError(error, 'Failed to delete policy');
  }
}