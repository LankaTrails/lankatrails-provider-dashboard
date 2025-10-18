/**
 * Policy React Query Hooks
 * Custom hooks for policy data fetching and mutations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ServiceType } from '@/constants/serviceTypes';
import type {
  Policy,
  CreatePolicyPayload,
  UpdatePolicyPayload,
} from '@/types/policyTypes';
import { policyQueryKeys } from '@/types/policyTypes';
import * as policyApi from './policyApi';

/**
 * Fetch all policies (general)
 */
export const usePolicies = () => {
  return useQuery({
    queryKey: policyQueryKeys.lists(),
    queryFn: () => policyApi.fetchPolicies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch policies by service type
 */
export const usePoliciesByServiceType = (serviceType: ServiceType) => {
  return useQuery({
    queryKey: policyQueryKeys.list(serviceType),
    queryFn: () => policyApi.fetchPoliciesByServiceType(serviceType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Create policy mutation
 */
export const useCreatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePolicyPayload) => policyApi.createPolicy(payload),
    onSuccess: (_newPolicy, variables) => {
      // Invalidate and refetch queries
      if (variables.serviceType) {
        queryClient.invalidateQueries({
          queryKey: policyQueryKeys.list(variables.serviceType as ServiceType),
        });
      }
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.lists() });

      toast.success('Policy created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create policy');
    },
  });
};

/**
 * Update policy mutation
 */
export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePolicyPayload) => policyApi.updatePolicy(payload),
    onMutate: async (updatedPolicy) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: policyQueryKeys.all });

      // Snapshot previous value
      const previousPolicies = queryClient.getQueryData(policyQueryKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(policyQueryKeys.lists(), (old: Policy[] | undefined) => {
        if (!old) return [];
        return old.map((policy) =>
          policy.id === updatedPolicy.id ? { ...policy, ...updatedPolicy } : policy
        );
      });

      return { previousPolicies };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousPolicies) {
        queryClient.setQueryData(policyQueryKeys.lists(), context.previousPolicies);
      }
      toast.error(error.message || 'Failed to update policy');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.all });
      toast.success('Policy updated successfully!');
    },
  });
};

/**
 * Delete policy mutation
 */
export const useDeletePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => policyApi.deletePolicy(id),
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: policyQueryKeys.all });

      // Snapshot previous value
      const previousPolicies = queryClient.getQueryData(policyQueryKeys.lists());

      // Optimistically update
      queryClient.setQueryData(policyQueryKeys.lists(), (old: Policy[] | undefined) => {
        if (!old) return [];
        return old.filter((policy) => policy.id !== deletedId);
      });

      return { previousPolicies };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousPolicies) {
        queryClient.setQueryData(policyQueryKeys.lists(), context.previousPolicies);
      }
      toast.error(error.message || 'Failed to delete policy');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.all });
      toast.success('Policy deleted successfully!');
    },
  });
};
