/**
 * PolicyForm Component
 * Modern form for creating and editing policies with validation
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Policy } from '@/types/policyTypes';

// Form validation schema
const policyFormSchema = z.object({
  heading: z.string().min(1, 'Heading is required').max(200, 'Heading must be less than 200 characters'),
  policy: z.string().min(10, 'Policy description must be at least 10 characters'),
});

type PolicyFormValues = z.infer<typeof policyFormSchema>;

interface PolicyFormProps {
  policy?: Policy;
  onSubmit: (data: PolicyFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export const PolicyForm: React.FC<PolicyFormProps> = ({
  policy,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save Policy',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      heading: policy?.heading || '',
      policy: policy?.policy || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Heading */}
      <div className="space-y-2">
        <Label htmlFor="heading">
          Heading <span className="text-red-500">*</span>
        </Label>
        <Input
          id="heading"
          {...register('heading')}
          placeholder="Enter policy heading"
          className={errors.heading ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.heading && (
          <p className="text-sm text-red-500">{errors.heading.message}</p>
        )}
      </div>

      {/* Policy Description */}
      <div className="space-y-2">
        <Label htmlFor="policy">
          Policy Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="policy"
          {...register('policy')}
          placeholder="Enter policy description"
          rows={6}
          className={errors.policy ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.policy && (
          <p className="text-sm text-red-500">{errors.policy.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Minimum 10 characters required
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
