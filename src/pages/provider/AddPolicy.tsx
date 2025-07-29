import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Save, 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Lightbulb,
  Copy,
  Trash2,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import ModernExpandableSectionComponent from "@/components/forms/ModernExpandableSectionComponent";
import ModernRichTextEditor from "@/components/forms/ModernRichTextEditor";
import { enhancedPolicyService } from "@/services/enhancedPolicyService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  policyFormSchema, 
  POLICY_CATEGORIES, 
  POLICY_STATUSES,
  type PolicyFormData 
} from "@/lib/validations/policyValidation";
import type { PolicyData, PolicyTemplate } from "@/types/serviceTypes";

interface QuickTemplate {
  name: string;
  category: string;
  template: string;
}

const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    name: "Cancellation Policy",
    category: "Cancellation",
    template: `<h3>Cancellation Policy</h3>
<p>We understand that plans can change. Here are our cancellation terms:</p>
<ul>
<li><strong>24+ hours before:</strong> Full refund available</li>
<li><strong>12-24 hours before:</strong> 50% refund available</li>
<li><strong>Less than 12 hours:</strong> No refund available</li>
</ul>
<p>Emergency cancellations will be reviewed on a case-by-case basis.</p>`
  },
  {
    name: "Safety Guidelines",
    category: "Safety",
    template: `<h3>Safety Guidelines</h3>
<p>Your safety is our top priority. Please follow these guidelines:</p>
<ul>
<li>Follow all instructions provided by our staff</li>
<li>Inform us of any medical conditions or allergies</li>
<li>Wear appropriate clothing and safety equipment</li>
<li>Do not participate under the influence of alcohol or drugs</li>
</ul>
<p>We reserve the right to refuse service if safety guidelines are not followed.</p>`
  },
  {
    name: "Age Restrictions",
    category: "Age Restrictions",
    template: `<h3>Age Requirements</h3>
<p>This activity has the following age restrictions:</p>
<ul>
<li><strong>Minimum age:</strong> [Specify minimum age]</li>
<li><strong>Children under 18:</strong> Must be accompanied by an adult</li>
<li><strong>Senior participants:</strong> Medical clearance may be required</li>
</ul>
<p>Age verification may be required at check-in.</p>`
  }
];

const AddPolicy = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  const [policySection, setPolicySection] = useState<PolicyData[]>([
    {
      id: Date.now(),
      heading: "",
      description: "",
      isExpanded: true,
      category: "General",
      tags: [],
      status: "draft"
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("form");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      heading: "",
      description: "",
      category: "General",
      tags: [],
      status: "draft"
    },
    mode: "onChange"
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [templateData, tags] = await Promise.all([
          enhancedPolicyService.getPolicyTemplates(),
          enhancedPolicyService.getAvailableTags()
        ]);
        
        setTemplates(templateData);
        setAvailableTags(tags);
        
        // If editing, load the policy
        if (isEditing && id) {
          // This would load the specific policy for editing
          // For now, we'll use a placeholder
          console.log("Loading policy for editing:", id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load templates and tags");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);

  // Track unsaved changes
  useEffect(() => {
    const subscription = watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Handle policy section changes
  const handlePoliciesChange = useCallback((newItems: PolicyData[]) => {
    setPolicySection(newItems);
    setHasUnsavedChanges(true);
  }, []);

  // Handle form submission
  const handleSave = async (items: PolicyData[]) => {
    if (items.length === 0) {
      toast.error("Please add at least one policy");
      return;
    }

    setIsSaving(true);
    try {
      const promises = items.map(async (item) => {
        const policyData = {
          heading: item.heading,
          policy: item.description,
          category: item.category,
          tags: item.tags,
          status: item.status
        };
        
        if (isEditing) {
          return enhancedPolicyService.updatePolicy(item.id.toString(), policyData);
        } else {
          return enhancedPolicyService.createPolicy(policyData, { optimistic: false });
        }
      });

      await Promise.all(promises);
      
      toast.success(
        isEditing 
          ? "Policies updated successfully!" 
          : "Policies created successfully!"
      );
      
      setHasUnsavedChanges(false);
      navigate("/provider/policy/all");
    } catch (error: any) {
      console.error("Error saving policies:", error);
      
      let message = "Failed to save policies";
      if (error.userMessage) {
        message = error.userMessage;
      } else if (error.message) {
        // Clean up error message
        const cleanedMessage = error.message.replace(/"[^"]*"/g, '');
        message = cleanedMessage.split(":")[0].trim();
      }
      
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle template application
  const applyTemplate = useCallback((template: QuickTemplate | PolicyTemplate) => {
    const newPolicy: PolicyData = {
      id: Date.now() + Math.random(),
      heading: 'name' in template ? template.name : template.template.split('\n')[0].replace(/<[^>]*>/g, ''),
      description: template.template,
      isExpanded: true,
      category: template.category,
      tags: [],
      status: "draft"
    };
    
    setPolicySection(prev => [...prev, newPolicy]);
    setActiveTab("form");
    toast.success("Template applied successfully!");
  }, []);

  // Handle navigation with unsaved changes
  const handleNavigation = useCallback((path: string) => {
    if (hasUnsavedChanges) {
      // In a real app, you'd show a confirmation dialog
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }
    navigate(path);
  }, [hasUnsavedChanges, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <ProviderTopBar />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/provider/policy/all")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? "Edit Policy" : "Add New Policy"}
              </h1>
              <p className="text-gray-600">
                {isEditing 
                  ? "Update your existing policy" 
                  : "Create comprehensive policies for your services"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                Unsaved changes
              </Badge>
            )}
            
            <Button
              onClick={() => handleSave(policySection)}
              disabled={isSaving || policySection.length === 0}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update" : "Save"} Policies
                </>
              )}
            </Button>
          </div>
        </div>
        
        <ProviderTopBar />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form" className="gap-2">
            <FileText className="w-4 h-4" />
            Policy Form
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          {/* Policy Form */}
          <ModernExpandableSectionComponent
            title="Policy Details"
            items={policySection}
            onItemsChange={handlePoliciesChange}
            addButtonText="Add Another Policy"
            itemName="Policy"
            canAddItems={true}
            showSubmitButton={true}
            onSave={handleSave}
            isLoading={false}
            templates={templates}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Quick Start Templates
              </CardTitle>
              <CardDescription>
                Use these pre-built templates to quickly create common policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUICK_TEMPLATES.map((template, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.template.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <Button size="sm" variant="outline" className="w-full gap-2">
                      <Copy className="w-3 h-3" />
                      Use Template
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Templates */}
          {templates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Custom Templates</CardTitle>
                <CardDescription>
                  Templates you've created and saved for reuse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-2"
                          onClick={() => applyTemplate(template)}
                        >
                          <Copy className="w-3 h-3" />
                          Use Template
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {policySection.length === 0 && activeTab === "form" && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies yet</h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first policy or choose from our templates.
            </p>
            <div className="flex justify-center gap-2">
              <Button onClick={() => handlePoliciesChange([...policySection, {
                id: Date.now(),
                heading: "",
                description: "",
                isExpanded: true,
                category: "General",
                tags: [],
                status: "draft"
              }])} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Policy
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("templates")} className="gap-2">
                <Lightbulb className="w-4 h-4" />
                Browse Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddPolicy;
