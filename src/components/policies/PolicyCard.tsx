/**
 * PolicyCard Component
 * Display individual policy with actions
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Policy } from '@/types/policyTypes';
import { cn } from '@/lib/utils';

interface PolicyCardProps {
  policy: Policy;
  onEdit: (policy: Policy) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (policy.id) {
      onDelete(policy.id);
      setShowDeleteDialog(false);
    }
  };

  // Strip HTML tags for preview
  const getTextPreview = (html: string, maxLength: number = 150) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{policy.heading}</CardTitle>
              {policy.serviceType && (
                <Badge variant="secondary" className="mt-2">
                  {policy.serviceType}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(policy)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'prose prose-sm max-w-none text-gray-600',
              !isExpanded && 'line-clamp-3'
            )}
          >
            {isExpanded ? (
              <div dangerouslySetInnerHTML={{ __html: policy.policy }} />
            ) : (
              <p>{getTextPreview(policy.policy)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the policy "{policy.heading}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
