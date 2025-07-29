import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Plus, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Save, 
  Copy, 
  Archive,
  Edit3,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ModernRichTextEditor from "./ModernRichTextEditor";
import { 
  policyFormSchema, 
  POLICY_CATEGORIES, 
  POLICY_STATUSES,
  type PolicyFormData 
} from "@/lib/validations/policyValidation";
import type { PolicyData } from "@/types/serviceTypes";

interface ModernExpandableSectionProps {
  title: string;
  items: PolicyData[];
  onItemsChange: (items: PolicyData[]) => void;
  addButtonText: string;
  itemName: string;
  canAddItems?: boolean;
  showSubmitButton?: boolean;
  onSave?: (items: PolicyData[]) => Promise<void>;
  isLoading?: boolean;
  availableTags?: string[];
  templates?: Array<{ id: string; name: string; template: string; category: string }>;
}

const ModernExpandableSectionComponent: React.FC<ModernExpandableSectionProps> = ({
  title,
  items,
  onItemsChange,
  addButtonText,
  itemName,
  canAddItems = true,
  showSubmitButton = false,
  onSave,
  isLoading = false,

  templates = []
}) => {
  const [savingItems, setSavingItems] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const {
    formState: { errors }
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      heading: "",
      description: "",
      category: "General",
      tags: [],
      status: "draft"
    }
  });

  const handleItemChange = useCallback((id: number, field: string, value: any) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onItemsChange(updatedItems);
  }, [items, onItemsChange]);

  const toggleExpanded = useCallback((id: number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
    );
    onItemsChange(updatedItems);
  }, [items, onItemsChange]);

  const addNewItem = useCallback((templateData?: any) => {
    const newItem: PolicyData = {
      id: Date.now() + Math.random(),
      heading: templateData?.heading || "",
      description: templateData?.template || "",
      isExpanded: true,
      category: templateData?.category || "General",
      tags: templateData?.tags || [],
      status: "draft",
      createdAt: new Date().toISOString(),
      version: 1
    };
    onItemsChange([...items, newItem]);
  }, [items, onItemsChange]);

  const removeItem = useCallback((id: number) => {
    if (items.length > 1) {
      onItemsChange(items.filter((item) => item.id !== id));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [items, onItemsChange]);

  const duplicateItem = useCallback((item: PolicyData) => {
    const duplicatedItem: PolicyData = {
      ...item,
      id: Date.now() + Math.random(),
      heading: `${item.heading} (Copy)`,
      isExpanded: true,
      createdAt: new Date().toISOString(),
      version: 1
    };
    onItemsChange([...items, duplicatedItem]);
  }, [items, onItemsChange]);

  const handleSaveClick = async () => {
    if (onSave) {
      setSavingItems(new Set(items.map(item => item.id)));
      try {
        await onSave(items);
        toast.success("Policies saved successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to save policies");
      } finally {
        setSavingItems(new Set());
      }
    }
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'activate') => {
    const selectedItemIds = Array.from(selectedItems);
    if (selectedItemIds.length === 0) return;

    try {
      if (action === 'delete') {
        const remainingItems = items.filter(item => !selectedItems.has(item.id));
        onItemsChange(remainingItems);
      } else {
        const updatedItems = items.map(item => 
          selectedItems.has(item.id) 
            ? { ...item, status: action === 'archive' ? 'archived' : 'active' as any }
            : item
        );
        onItemsChange(updatedItems);
      }
      
      setSelectedItems(new Set());
      toast.success(`${selectedItemIds.length} item(s) ${action}d successfully`);
    } catch (error: any) {
      toast.error(`Failed to ${action} items`);
    }
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    setSelectedItems(new Set(items.map(item => item.id)));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          {selectedItems.size > 0 && (
            <Badge variant="secondary" className="gap-1">
              {selectedItems.size} selected
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bulk actions */}
          {selectedItems.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1"
            >
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
                    <X className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Policies</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedItems.size} selected policies? 
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
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </motion.div>
          )}

          {/* Selection controls */}
          {items.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectedItems.size === items.length ? clearSelection : selectAllItems}
              >
                {selectedItems.size === items.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          )}

          {/* Add new policy */}
          {canAddItems && (
            <div className="flex items-center gap-1">
              {templates.length > 0 && (
                <Select onValueChange={(templateId) => {
                  const template = templates.find(t => t.id === templateId);
                  if (template) {
                    addNewItem(template);
                  }
                }}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="From Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button
                onClick={() => addNewItem()}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                {addButtonText}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Policy items */}
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "border rounded-lg overflow-hidden transition-all duration-200",
                selectedItems.has(item.id) && "ring-2 ring-blue-500 border-blue-300"
              )}
            >
              {/* Item header */}
              <div
                className={cn(
                  "flex items-center justify-between p-3 cursor-pointer transition-colors",
                  item.isExpanded ? "bg-blue-50 border-b" : "bg-gray-50 hover:bg-gray-100"
                )}
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleItemSelection(item.id);
                    }}
                    className="rounded border-gray-300"
                  />
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium text-gray-700">
                      {item.heading || `${itemName} ${index + 1}`}
                    </span>
                  </div>

                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.status && (
                    <Badge className={cn("text-xs", getStatusColor(item.status))}>
                      {item.status}
                    </Badge>
                  )}

                  {item.updatedAt && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  )}

                  {/* Item actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateItem(item);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>

                    {items.length > 1 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.heading}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => removeItem(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {item.isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {item.isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4 bg-white">
                      {/* Form fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Heading *
                          </label>
                          <Input
                            value={item.heading}
                            onChange={(e) => handleItemChange(item.id, "heading", e.target.value)}
                            placeholder="Enter policy heading"
                            className={errors.heading ? "border-red-500" : ""}
                          />
                          {errors.heading && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.heading.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Category *
                          </label>
                          <Select
                            value={item.category || "General"}
                            onValueChange={(value) => handleItemChange(item.id, "category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {POLICY_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <Select
                            value={item.status || "draft"}
                            onValueChange={(value) => handleItemChange(item.id, "status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {POLICY_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(status)}
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Tags
                          </label>
                          <Input
                            value={item.tags?.join(", ") || ""}
                            onChange={(e) => {
                              const tags = e.target.value
                                .split(",")
                                .map(tag => tag.trim())
                                .filter(tag => tag.length > 0);
                              handleItemChange(item.id, "tags", tags);
                            }}
                            placeholder="Enter tags separated by commas"
                          />
                        </div>
                      </div>

                      {/* Rich text editor */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Description *
                        </label>
                        <ModernRichTextEditor
                          content={item.description}
                          onChange={(content) => handleItemChange(item.id, "description", content)}
                          placeholder="Enter policy description..."
                          maxLength={5000}
                          error={errors.description?.message}
                        />
                      </div>

                      {/* Save button for individual items */}
                      {showSubmitButton && (
                        <div className="flex justify-end pt-2">
                          <Button
                            onClick={handleSaveClick}
                            disabled={savingItems.has(item.id)}
                            className="gap-2"
                          >
                            {savingItems.has(item.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Global save button */}
      {showSubmitButton && !items.some(item => item.isExpanded) && (
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSaveClick}
            disabled={savingItems.size > 0}
            size="lg"
            className="gap-2"
          >
            {savingItems.size > 0 ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All Policies
              </>
            )}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first policy.</p>
          {canAddItems && (
            <Button onClick={() => addNewItem()} className="gap-2">
              <Plus className="w-4 h-4" />
              {addButtonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ModernExpandableSectionComponent;
