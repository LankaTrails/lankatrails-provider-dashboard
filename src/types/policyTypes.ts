import type { ServiceType } from '@/constants/serviceTypes';
import { z } from 'zod';

/**
 * Policy Types and Schemas
 * Modern type definitions with Zod validation
 */

// Zod schema for policy validation
export const policySchema = z.object({
  id: z.number().nullable().optional(),
  heading: z.string().min(1, 'Heading is required').max(200, 'Heading must be less than 200 characters'),
  policy: z.string().min(10, 'Policy description must be at least 10 characters'),
  serviceType: z.string().optional(),
});

// TypeScript types derived from Zod schemas
export type Policy = z.infer<typeof policySchema>;

export interface PolicyFormData {
  heading: string;
  policy: string;
}

export interface PolicyWithMeta extends Policy {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// API Response types
export interface PolicyApiResponse {
  success?: boolean;
  message?: string;
  data?: Policy;
}

export interface PoliciesListResponse {
  success?: boolean;
  message?: string;
  data?: Policy[];
  content?: Policy[]; // For paginated responses
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
  pageable?: any;
  last?: boolean;
  first?: boolean;
  size?: number;
  number?: number;
}

// Query keys for React Query
export const policyQueryKeys = {
  all: ['policies'] as const,
  lists: () => [...policyQueryKeys.all, 'list'] as const,
  list: (serviceType?: ServiceType) => [...policyQueryKeys.lists(), serviceType] as const,
  details: () => [...policyQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...policyQueryKeys.details(), id] as const,
};

// Mutation types
export interface CreatePolicyPayload {
  heading: string;
  policy: string;
  serviceType?: ServiceType;
}

export interface UpdatePolicyPayload extends CreatePolicyPayload {
  id: number;
}
