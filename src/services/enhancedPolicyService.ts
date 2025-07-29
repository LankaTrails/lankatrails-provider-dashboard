import type { 
  PolicySection, 
  PolicyFilters, 
  PolicySearchResult,
  PolicyAuditLog,
  PolicyTemplate 
} from "@/types/serviceTypes";
import api from "@/api/axiosInstance";
import Fuse from 'fuse.js';

// Enhanced policy service with modern features
export class EnhancedPolicyService {
  private static instance: EnhancedPolicyService;
  private fuseInstance: Fuse<PolicySection> | null = null;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): EnhancedPolicyService {
    if (!EnhancedPolicyService.instance) {
      EnhancedPolicyService.instance = new EnhancedPolicyService();
    }
    return EnhancedPolicyService.instance;
  }

  // Initialize Fuse.js for client-side search
  private initializeFuse(policies: PolicySection[]) {
    const fuseOptions = {
      keys: [
        { name: 'heading', weight: 0.7 },
        { name: 'policy', weight: 0.3 },
        { name: 'category', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    };

    this.fuseInstance = new Fuse(policies, fuseOptions);
  }

  // Cache management
  private getCacheKey(key: string, params?: any): string {
    return `${key}_${JSON.stringify(params)}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // Fetch all policies with caching
  async fetchAllPolicies(): Promise<PolicySection[]> {
    const cacheKey = this.getCacheKey('all_policies');
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      this.initializeFuse(cached);
      return cached;
    }

    try {
      const response = await api.get("/provider/policies");
      const policies = response.data;
      
      this.setCache(cacheKey, policies);
      this.initializeFuse(policies);
      
      return policies;
    } catch (error) {
      console.error("Error fetching policies:", error);
      throw error;
    }
  }

  // Advanced search with filters
  async searchPolicies(
    filters: PolicyFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PolicySearchResult> {
    const cacheKey = this.getCacheKey('search_policies', { filters, page, limit });
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Try server-side search first
      const response = await api.post("/provider/policies/search", {
        filters,
        page,
        limit
      });
      
      const result = response.data;
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      // Fallback to client-side search
      console.warn("Server-side search failed, using client-side search:", error);
      return this.clientSideSearch(filters, page, limit);
    }
  }

  // Client-side search fallback
  private async clientSideSearch(
    filters: PolicyFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PolicySearchResult> {
    const allPolicies = await this.fetchAllPolicies();
    let filteredPolicies = [...allPolicies];

    // Apply text search
    if (filters.search && this.fuseInstance) {
      const searchResults = this.fuseInstance.search(filters.search);
      filteredPolicies = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (filters.category) {
      filteredPolicies = filteredPolicies.filter(
        policy => policy.category === filters.category
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredPolicies = filteredPolicies.filter(
        policy => policy.status === filters.status
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPolicies = filteredPolicies.filter(policy =>
        policy.tags?.some(tag => filters.tags!.includes(tag))
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      filteredPolicies = filteredPolicies.filter(policy => {
        if (!policy.createdAt) return false;
        const policyDate = new Date(policy.createdAt);
        return policyDate >= filters.dateRange!.from && 
               policyDate <= filters.dateRange!.to;
      });
    }

    // Pagination
    const total = filteredPolicies.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPolicies = filteredPolicies.slice(startIndex, endIndex);

    return {
      policies: paginatedPolicies,
      total,
      page,
      limit
    };
  }

  // Create policy with optimistic updates
  async createPolicy(
    policyData: PolicySection,
    options: { optimistic?: boolean } = {}
  ): Promise<PolicySection> {
    try {
      // Optimistic update
      if (options.optimistic) {
        const tempPolicy: PolicySection = {
          ...policyData,
          id: `temp_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1
        };
        
        // Update cache optimistically
        this.clearCache();
        return tempPolicy;
      }

      const response = await api.post("/provider/add/policy", policyData);
      this.clearCache(); // Clear cache after successful creation
      return response.data;
    } catch (error: any) {
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
        message: 'Failed to create policy',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // Update policy
  async updatePolicy(
    id: string,
    policyData: Partial<PolicySection>
  ): Promise<PolicySection> {
    try {
      const response = await api.put(`/provider/policies/${id}`, policyData);
      this.clearCache();
      return response.data;
    } catch (error: any) {
      console.error("Error updating policy:", error);
      throw error;
    }
  }

  // Delete policy
  async deletePolicy(id: string): Promise<void> {
    try {
      await api.delete(`/provider/policies/${id}`);
      this.clearCache();
    } catch (error: any) {
      console.error("Error deleting policy:", error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdatePolicies(
    policyIds: string[],
    operation: 'delete' | 'archive' | 'activate' | 'change_category',
    data?: any
  ): Promise<void> {
    try {
      await api.post("/provider/policies/bulk", {
        policyIds,
        operation,
        data
      });
      this.clearCache();
    } catch (error: any) {
      console.error("Error in bulk operation:", error);
      throw error;
    }
  }

  // Get policy audit log
  async getPolicyAuditLog(policyId: string): Promise<PolicyAuditLog[]> {
    try {
      const response = await api.get(`/provider/policies/${policyId}/audit`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audit log:", error);
      return [];
    }
  }

  // Policy templates
  async getPolicyTemplates(): Promise<PolicyTemplate[]> {
    const cacheKey = 'policy_templates';
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await api.get("/provider/policy-templates");
      const templates = response.data;
      this.setCache(cacheKey, templates);
      return templates;
    } catch (error) {
      console.error("Error fetching policy templates:", error);
      return [];
    }
  }

  // Create policy from template
  async createPolicyFromTemplate(
    templateId: string,
    customData?: Partial<PolicySection>
  ): Promise<PolicySection> {
    try {
      const response = await api.post(`/provider/policy-templates/${templateId}/create`, customData);
      this.clearCache();
      return response.data;
    } catch (error: any) {
      console.error("Error creating policy from template:", error);
      throw error;
    }
  }

  // Export policies
  async exportPolicies(
    format: 'json' | 'csv' | 'pdf',
    filters?: PolicyFilters
  ): Promise<Blob> {
    try {
      const response = await api.post("/provider/policies/export", {
        format,
        filters
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error("Error exporting policies:", error);
      throw error;
    }
  }

  // Import policies
  async importPolicies(
    file: File,
    options: { overwriteExisting?: boolean; validateOnly?: boolean } = {}
  ): Promise<{ success: boolean; errors?: string[]; imported?: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const response = await api.post("/provider/policies/import", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!options.validateOnly) {
        this.clearCache();
      }

      return response.data;
    } catch (error: any) {
      console.error("Error importing policies:", error);
      throw error;
    }
  }

  // Get available tags
  async getAvailableTags(): Promise<string[]> {
    const cacheKey = 'available_tags';
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const policies = await this.fetchAllPolicies();
      const tags = new Set<string>();
      
      policies.forEach(policy => {
        policy.tags?.forEach(tag => tags.add(tag));
      });

      const tagArray = Array.from(tags).sort();
      this.setCache(cacheKey, tagArray);
      return tagArray;
    } catch (error) {
      console.error("Error getting available tags:", error);
      return [];
    }
  }

  // Real-time updates (WebSocket integration)
  subscribeToUpdates(callback: (update: any) => void): () => void {
    // This would integrate with your WebSocket implementation
    // For now, we'll use a simple polling mechanism
    const interval = setInterval(async () => {
      try {
        const response = await api.get("/provider/policies/updates");
        if (response.data.hasUpdates) {
          this.clearCache();
          callback(response.data);
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }
}

// Export singleton instance
export const enhancedPolicyService = EnhancedPolicyService.getInstance();

// Legacy compatibility exports
export const fetchAllPolicies = () => enhancedPolicyService.fetchAllPolicies();
export const createPolicy = (data: PolicySection) => enhancedPolicyService.createPolicy(data);
