/**
 * Policy API Service
 * Unified API calls for all policy-related operations
 */

import api from '@/api/axiosInstance';
import type { ServiceType } from '@/constants/serviceTypes';
import type {
  Policy,
  PolicyApiResponse,
  PoliciesListResponse,
  CreatePolicyPayload,
  UpdatePolicyPayload,
} from '@/types/policyTypes';

// Base endpoints
const ENDPOINTS = {
  general: '/provider/policies',
  add: '/provider/add/policy',
  delete: (id: number) => `/provider/delete/policy/${id}`,
  update: (id: number) => `/provider/update/policy/${id}`,
  byServiceType: (serviceType: ServiceType) => `/provider/policy/${serviceType}`,
};

/**
 * Fetch all policies (general)
 */
export const fetchPolicies = async (): Promise<Policy[]> => {
  try {
    const response = await api.get<PoliciesListResponse>(ENDPOINTS.general);
    console.log('📥 Fetched policies response:', response.data);
    
    // Handle different backend response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data.content && Array.isArray(response.data.content)) {
      // Handle paginated response
      return response.data.content;
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error fetching policies:', error);
    throw error;
  }
};

/**
 * Fetch policies by service type
 */
export const fetchPoliciesByServiceType = async (serviceType: ServiceType): Promise<Policy[]> => {
  try {
    const response = await api.get<PoliciesListResponse>(ENDPOINTS.byServiceType(serviceType));
    console.log(`📥 Fetched ${serviceType} policies response:`, response.data);
    
    // Handle different backend response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data.content && Array.isArray(response.data.content)) {
      return response.data.content;
    }
    
    return [];
  } catch (error) {
    console.error(`❌ Error fetching ${serviceType} policies:`, error);
    throw error;
  }
};

/**
 * Create a new policy
 */
export const createPolicy = async (payload: CreatePolicyPayload): Promise<Policy> => {
  try {
    const dataToSend = {
      ...payload,
      id: null, // Ensure ID is null for new policies
    };

    // Choose endpoint based on service type
    const endpoint = payload.serviceType
      ? ENDPOINTS.byServiceType(payload.serviceType as ServiceType)
      : ENDPOINTS.add;

    console.log('📤 Creating policy:', { endpoint, payload: dataToSend });
    const response = await api.post<PolicyApiResponse>(endpoint, dataToSend);
    console.log('✅ Policy created successfully:', response.data);
    
    // Handle different response structures
    if (response.data.data) {
      return response.data.data;
    }
    // If backend returns the policy directly
    return response.data as any;
  } catch (error: any) {
    console.error('❌ Error creating policy:', error);
    
    // Extract error message from response
    if (error.response?.data) {
      const { message, userMessage, details, error: errorMsg } = error.response.data;
      throw new Error(userMessage || message || errorMsg || details || 'Failed to create policy');
    }
    
    throw new Error('Failed to create policy. Please try again.');
  }
};

/**
 * Update an existing policy
 */
export const updatePolicy = async (payload: UpdatePolicyPayload): Promise<Policy> => {
  try {
    console.log('📝 Updating policy:', { id: payload.id, payload });
    const response = await api.put<PolicyApiResponse>(
      ENDPOINTS.update(payload.id),
      payload
    );
    console.log('✅ Policy updated successfully:', response.data);
    
    // Handle different response structures
    if (response.data.data) {
      return response.data.data;
    }
    // If backend returns the policy directly
    return response.data as any;
  } catch (error: any) {
    console.error('❌ Error updating policy:', error);
    
    if (error.response?.data) {
      const { message, userMessage, details, error: errorMsg } = error.response.data;
      throw new Error(userMessage || message || errorMsg || details || 'Failed to update policy');
    }
    
    throw new Error('Failed to update policy. Please try again.');
  }
};

/**
 * Delete a policy
 */
export const deletePolicy = async (id: number): Promise<void> => {
  try {
    console.log(`🗑️ Deleting policy with ID: ${id}`);
    await api.delete(ENDPOINTS.delete(id));
    console.log(`✅ Policy ${id} deleted successfully`);
  } catch (error: any) {
    console.error('❌ Error deleting policy:', error);
    
    if (error.response?.data) {
      const { message, userMessage, details, error: errorMsg } = error.response.data;
      throw new Error(userMessage || message || errorMsg || details || 'Failed to delete policy');
    }
    
    throw new Error('Failed to delete policy. Please try again.');
  }
};
