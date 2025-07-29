import { z } from 'zod';

// Policy categories
export const POLICY_CATEGORIES = [
  'General',
  'Privacy',
  'Terms of Service',
  'Cancellation',
  'Payment',
  'Safety',
  'Accessibility',
  'Environmental',
  'Age Restrictions',
  'Equipment',
  'Weather',
  'Health & Medical',
  'Insurance',
  'Liability',
  'Booking',
  'Refund',
  'Group Policy',
  'Special Requirements'
] as const;

export const POLICY_STATUSES = ['active', 'draft', 'archived'] as const;

// Base policy validation schema
export const policyFormSchema = z.object({
  heading: z
    .string()
    .min(3, 'Heading must be at least 3 characters')
    .max(100, 'Heading must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Heading contains invalid characters'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters')
    .refine(
      (val) => {
        // Remove HTML tags for length validation
        const textContent = val.replace(/<[^>]*>/g, '').trim();
        return textContent.length >= 10;
      },
      'Description content must be at least 10 characters'
    ),
  
  category: z
    .enum(POLICY_CATEGORIES, {
      errorMap: () => ({ message: 'Please select a valid category' })
    }),
  
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty').max(30, 'Tag too long'))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
  
  status: z
    .enum(POLICY_STATUSES, {
      errorMap: () => ({ message: 'Please select a valid status' })
    })
    .default('draft'),
});

// Policy search/filter validation
export const policyFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  category: z.enum([...POLICY_CATEGORIES, '']).optional(),
  status: z.enum([...POLICY_STATUSES, '']).optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
}).refine(
  (data) => {
    if (data.dateRange) {
      return data.dateRange.from <= data.dateRange.to;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['dateRange']
  }
);

// Bulk operations validation
export const bulkPolicyOperationSchema = z.object({
  policyIds: z
    .array(z.string().min(1))
    .min(1, 'At least one policy must be selected')
    .max(50, 'Cannot process more than 50 policies at once'),
  
  operation: z.enum(['delete', 'archive', 'activate', 'change_category']),
  
  newCategory: z
    .enum(POLICY_CATEGORIES)
    .optional()
    .refine(
      (val, ctx) => {
        if (ctx.parent.operation === 'change_category' && !val) {
          return false;
        }
        return true;
      },
      'Category is required for category change operation'
    ),
});

// Policy template validation
export const policyTemplateSchema = z.object({
  name: z
    .string()
    .min(3, 'Template name must be at least 3 characters')
    .max(50, 'Template name must not exceed 50 characters'),
  
  description: z
    .string()
    .min(10, 'Template description must be at least 10 characters')
    .max(200, 'Template description must not exceed 200 characters'),
  
  category: z.enum(POLICY_CATEGORIES),
  
  template: z
    .string()
    .min(50, 'Template content must be at least 50 characters')
    .max(3000, 'Template content must not exceed 3000 characters'),
  
  isDefault: z.boolean().default(false),
});

// Export/Import validation
export const policyExportSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf']),
  filters: policyFiltersSchema.optional(),
  includeArchived: z.boolean().default(false),
});

export const policyImportSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      const allowedTypes = ['application/json', 'text/csv', 'application/vnd.ms-excel'];
      return allowedTypes.includes(file.type);
    },
    'Only JSON and CSV files are allowed'
  ).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'File size must be less than 5MB'
  ),
  
  overwriteExisting: z.boolean().default(false),
  validateOnly: z.boolean().default(false),
});

// Type exports
export type PolicyFormData = z.infer<typeof policyFormSchema>;
export type PolicyFilters = z.infer<typeof policyFiltersSchema>;
export type BulkPolicyOperation = z.infer<typeof bulkPolicyOperationSchema>;
export type PolicyTemplate = z.infer<typeof policyTemplateSchema>;
export type PolicyExport = z.infer<typeof policyExportSchema>;
export type PolicyImport = z.infer<typeof policyImportSchema>;

// Validation helper functions
export const validatePolicyForm = (data: unknown) => {
  return policyFormSchema.safeParse(data);
};

export const validatePolicyFilters = (data: unknown) => {
  return policyFiltersSchema.safeParse(data);
};

export const validateBulkOperation = (data: unknown) => {
  return bulkPolicyOperationSchema.safeParse(data);
};

// Custom validation messages
export const getValidationErrorMessage = (error: z.ZodError): string => {
  const firstError = error.errors[0];
  return firstError?.message || 'Validation error occurred';
};

// Field-specific validation helpers
export const isValidPolicyHeading = (heading: string): boolean => {
  const result = z.string().min(3).max(100).safeParse(heading);
  return result.success;
};

export const isValidPolicyDescription = (description: string): boolean => {
  const textContent = description.replace(/<[^>]*>/g, '').trim();
  return textContent.length >= 10 && textContent.length <= 5000;
};

export const sanitizeHtmlContent = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};
