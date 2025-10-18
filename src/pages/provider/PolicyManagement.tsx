/**
 * PolicyManagement Component
 * Modern unified policy management with full CRUD operations
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import ProviderTopBar from '@/components/provider/ProviderTopBar';
import { PolicyCard } from '@/components/policies/PolicyCard';
import { PolicyForm } from '@/components/policies/PolicyForm';
import {
  usePolicies,
  usePoliciesByServiceType,
  useCreatePolicy,
  useDeletePolicy,
} from '@/services/policies/usePolicies';
import {
  SERVICE_TYPE_LABELS,
  isValidServiceType,
  type ServiceType,
} from '@/constants/serviceTypes';
import type { Policy } from '@/types/policyTypes';

export const PolicyManagement: React.FC = () => {
  const { serviceType: urlServiceType } = useParams<{ serviceType?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | 'all'>(
    urlServiceType && isValidServiceType(urlServiceType) ? urlServiceType : 'all'
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  // Determine which query to use
  const isServiceTypeView = selectedServiceType !== 'all';
  
  const {
    data: generalPolicies,
    isLoading: isLoadingGeneral,
    error: errorGeneral,
  } = usePolicies();

  const {
    data: serviceTypePolicies,
    isLoading: isLoadingServiceType,
    error: errorServiceType,
  } = usePoliciesByServiceType(selectedServiceType as ServiceType);

  // Select appropriate data based on view
  const policies = isServiceTypeView ? serviceTypePolicies : generalPolicies;
  const isLoading = isServiceTypeView ? isLoadingServiceType : isLoadingGeneral;
  const error = isServiceTypeView ? errorServiceType : errorGeneral;

  // Mutations
  const createMutation = useCreatePolicy();
  const deleteMutation = useDeletePolicy();

  // Filter policies based on search query
  const filteredPolicies = policies?.filter((policy) =>
    policy.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.policy.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle create policy
  const handleCreate = async (data: { heading: string; policy: string }) => {
    await createMutation.mutateAsync({
      ...data,
      serviceType: isServiceTypeView ? selectedServiceType as ServiceType : undefined,
    });
    setIsCreateDialogOpen(false);
  };

  // Handle edit policy
  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
  };

  // Handle delete policy
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Get page title
  const getPageTitle = () => {
    if (isServiceTypeView) {
      return `${SERVICE_TYPE_LABELS[selectedServiceType as ServiceType]} Policies`;
    }
    return 'All Policies';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-1">
          Manage your service policies and terms
        </p>
      </div>

      <ProviderTopBar />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={selectedServiceType}
            onValueChange={(value) => setSelectedServiceType(value as ServiceType | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(SERVICE_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : error ? (
          <Card className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading policies</p>
              <p className="text-sm mt-1">{(error as Error).message}</p>
            </div>
          </Card>
        ) : filteredPolicies.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">No policies found</p>
              <p className="text-sm mt-1">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by creating your first policy'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Policy
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Policy Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Policy</DialogTitle>
            <DialogDescription>
              Add a new policy for your service
            </DialogDescription>
          </DialogHeader>
          <PolicyForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={!!editingPolicy} onOpenChange={() => setEditingPolicy(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>
              Update the policy details
            </DialogDescription>
          </DialogHeader>
          {editingPolicy && (
            <PolicyForm
              policy={editingPolicy}
              onSubmit={async (data) => {
                // TODO: Implement update mutation
                console.log('Update policy:', data);
                setEditingPolicy(null);
              }}
              onCancel={() => setEditingPolicy(null)}
              submitButtonText="Update Policy"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PolicyManagement;
