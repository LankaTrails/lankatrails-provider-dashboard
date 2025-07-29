import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { 
  Plus, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  FileText,
  Archive,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { enhancedPolicyService } from "@/services/enhancedPolicyService";
import PolicySearchAndFilter from "@/components/forms/PolicySearchAndFilter";
import ModernExpandableSectionComponent from "@/components/forms/ModernExpandableSectionComponent";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { PolicySection, PolicyData, PolicyFilters } from "@/types/serviceTypes";

interface PolicyStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
}

const AllPolicy = () => {
  const navigate = useNavigate();
  const [structuredPolicies, setStructuredPolicies] = useState<PolicyData[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<PolicyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PolicyFilters>({});
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [stats, setStats] = useState<PolicyStats>({ total: 0, active: 0, draft: 0, archived: 0 });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPolicies, setSelectedPolicies] = useState<Set<number>>(new Set());

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  // Load policies with enhanced features
  const loadPolicies = useCallback(async (resetPage = false) => {
    try {
      setIsLoading(resetPage);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      const result = await enhancedPolicyService.searchPolicies(filters, currentPage, 20);
      
      const structured = result.policies.map((policy: PolicySection, index: number) => ({
        id: parseInt(policy.id?.toString() || `${Date.now()}-${index}`),
        heading: policy.heading,
        description: policy.policy,
        isExpanded: false,
        category: policy.category,
        tags: policy.tags,
        createdAt: policy.createdAt,
        updatedAt: policy.updatedAt,
        version: policy.version,
        status: policy.status || 'draft'
      }));

      if (resetPage) {
        setStructuredPolicies(structured);
        setPage(2);
      } else {
        setStructuredPolicies(prev => [...prev, ...structured]);
        setPage(prev => prev + 1);
      }

      setHasMore(result.policies.length === 20);
      
      // Calculate stats
      const newStats = {
        total: result.total,
        active: structured.filter(p => p.status === 'active').length,
        draft: structured.filter(p => p.status === 'draft').length,
        archived: structured.filter(p => p.status === 'archived').length
      };
      setStats(newStats);
      
    } catch (error: any) {
      console.error("Error fetching policies:", error);
      setError(error.message || "Failed to load policies");
      toast.error("Failed to load policies");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, page]);

  // Load additional data
  const loadAdditionalData = useCallback(async () => {
    try {
      const [tags, templateData] = await Promise.all([
        enhancedPolicyService.getAvailableTags(),
        enhancedPolicyService.getPolicyTemplates()
      ]);
      setAvailableTags(tags);
      setTemplates(templateData);
    } catch (error) {
      console.error("Error loading additional data:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPolicies(true);
    loadAdditionalData();
  }, []);

  // Load more when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      loadPolicies(true);
    }
  }, [filters]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadPolicies(false);
    }
  }, [inView, hasMore, isLoading, loadPolicies]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPolicies(true);
  }, [loadPolicies]);

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters: PolicyFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // Handle policy actions
  const handleEditPolicy = useCallback((policy: PolicyData) => {
    navigate(`/provider/policy/edit/${policy.id}`);
  }, [navigate]);

  const handleDeletePolicy = useCallback(async (policyId: number) => {
    try {
      await enhancedPolicyService.deletePolicy(policyId.toString());
      setStructuredPolicies(prev => prev.filter(p => p.id !== policyId));
      toast.success("Policy deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete policy");
    }
  }, []);

  const handleBulkAction = useCallback(async (action: 'delete' | 'archive' | 'activate') => {
    if (selectedPolicies.size === 0) return;

    try {
      const policyIds = Array.from(selectedPolicies).map(id => id.toString());
      await enhancedPolicyService.bulkUpdatePolicies(policyIds, action);
      
      if (action === 'delete') {
        setStructuredPolicies(prev => prev.filter(p => !selectedPolicies.has(p.id)));
      } else {
        setStructuredPolicies(prev => prev.map(p => 
          selectedPolicies.has(p.id) 
            ? { ...p, status: action === 'archive' ? 'archived' : 'active' as any }
            : p
        ));
      }
      
      setSelectedPolicies(new Set());
      toast.success(`${policyIds.length} policies ${action}d successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} policies`);
    }
  }, [selectedPolicies]);

  // Handle export
  const handleExport = useCallback(async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const blob = await enhancedPolicyService.exportPolicies(format, filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `policies.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Policies exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to export policies");
    }
  }, [filters]);

  // Stats cards
  const statsCards = useMemo(() => [
    { label: 'Total', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'Draft', value: stats.draft, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Archived', value: stats.archived, icon: Archive, color: 'bg-gray-500' },
  ], [stats]);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">All Policies</h1>
          <ProviderTopBar />
        </div>
        
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load policies</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => loadPolicies(true)} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl p-2 font-bold">All Policies</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  JSON Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  CSV Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  PDF Format
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              onClick={() => navigate('/provider/policy/add')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Policy
            </Button>
          </div>
        </div>
        
        <ProviderTopBar />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={cn("p-2 rounded-lg", stat.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <PolicySearchAndFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalResults={stats.total}
        isLoading={isLoading}
        availableTags={availableTags}
      />

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedPolicies.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedPolicies.size} selected
                </Badge>
                <span className="text-sm text-gray-600">
                  Choose an action to apply to selected policies
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('archive')}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Policies</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedPolicies.size} selected policies? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleBulkAction('delete')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPolicies(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policies List */}
      <ModernExpandableSectionComponent
        title="Policies"
        items={structuredPolicies}
        onItemsChange={setStructuredPolicies}
        addButtonText="Add Policy"
        itemName="Policy"
        canAddItems={false}
        isLoading={isLoading}
        availableTags={availableTags}
        templates={templates}
      />

      {/* Load More Trigger */}
      {hasMore && !isLoading && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && structuredPolicies.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-500 mb-4">
            {Object.keys(filters).length > 0 
              ? "Try adjusting your search filters" 
              : "Get started by creating your first policy"
            }
          </p>
          <Button onClick={() => navigate('/provider/policy/add')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Policy
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllPolicy;
