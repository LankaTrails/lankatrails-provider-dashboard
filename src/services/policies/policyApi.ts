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
    return response.data.data || response.data as any;
  } catch (error) {
    console.error('Error fetching policies:', error);
    throw error;
  }
};

/**
 * Fetch policies by service type
 */
export const fetchPoliciesByServiceType = async (serviceType: ServiceType): Promise<Policy[]> => {
  try {
    const response = await api.get<PoliciesListResponse>(ENDPOINTS.byServiceType(serviceType));
    // Handle different response structures
    return response.data.data || response.data as any || [];
  } catch (error) {
    console.error(`Error fetching ${serviceType} policies:`, error);
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

    const response = await api.post<PolicyApiResponse>(endpoint, dataToSend);
    return response.data.data || response.data as any;
  } catch (error: any) {
    console.error('Error creating policy:', error);
    
    // Extract error message from response
    if (error.response?.data) {
      const { message, userMessage, details } = error.response.data;
      throw new Error(userMessage || message || details || 'Failed to create policy');
    }
    
    throw new Error('Failed to create policy. Please try again.');
  }
};

/**
 * Update an existing policy
 */
export const updatePolicy = async (payload: UpdatePolicyPayload): Promise<Policy> => {
  try {
    const response = await api.put<PolicyApiResponse>(
      ENDPOINTS.update(payload.id),
      payload
    );
    return response.data.data || response.data as any;
  } catch (error: any) {
    console.error('Error updating policy:', error);
    
    if (error.response?.data) {
      const { message, userMessage, details } = error.response.data;
      throw new Error(userMessage || message || details || 'Failed to update policy');
    }
    
    throw new Error('Failed to update policy. Please try again.');
  }
};

/**
 * Delete a policy
 */
export const deletePolicy = async (id: number): Promise<void> => {
  try {
    await api.delete(ENDPOINTS.delete(id));
  } catch (error: any) {
    console.error('Error deleting policy:', error);
    
    if (error.response?.data) {
      const { message, userMessage, details } = error.response.data;
      throw new Error(userMessage || message || details || 'Failed to delete policy');
    }
    
    throw new Error('Failed to delete policy. Please try again.');
  }
};
