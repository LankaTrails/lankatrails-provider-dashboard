import React from "react";
import { Plus, X, ChevronUp, ChevronDown, FileText, Save, AlertCircle, CheckCircle, Clock } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputField from "@/components/forms/InputField";
import type { TabData, PolicyData } from "@/types/serviceTypes";
import { deletePolicy } from "@/services/policyService";

interface ExpandableSectionProps {
  title: string;
  items: TabData[] | PolicyData[];
  onItemsChange: (items: TabData[] | PolicyData[]) => void;
  addButtonText: string;
  itemName: string;
  canAddItems?: boolean;
  showSubmitButton?: boolean;
  onSave?: (items: TabData[] | PolicyData[]) => Promise<void>;
}

const ExpandableSectionComponent: React.FC<ExpandableSectionProps> = ({
  title,
  items,
  onItemsChange,
  addButtonText,
  itemName,
  canAddItems = true,
  showSubmitButton = false,
  onSave,
}) => {
  const handleItemChange = (
    id: number | null,
    field: string,
    value: string
  ) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onItemsChange(updatedItems);
  };

  const toggleExpanded = (id: number | null) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
    );
    onItemsChange(updatedItems);
  };

  const addNewItem = () => {
    const newItem = {
      id: null,
      heading: "",
      description: "",
      isExpanded: true,
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (id: number | null) => {
    console.log("Removing item with id:", id);
    if (items.length > 1) {
      onItemsChange(items.filter((item) => item.id !== id));
    }
    //delete - only call deletePolicy if id is not null (existing item)
    if (id !== null) {
      deletePolicy(id);
    }
  };

  const handleSaveClick = async () => {
    if (onSave) {
      await onSave(items);
    }
  };

  const getPolicyStatus = (item: TabData | PolicyData) => {
    if (!item.heading.trim() && !item.description.trim()) {
      return { status: "draft", label: "Draft", color: "bg-gray-100 text-gray-600", icon: Clock };
    }
    if (!item.heading.trim() || !item.description.trim()) {
      return { status: "incomplete", label: "Incomplete", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle };
    }
    return { status: "complete", label: "Complete", color: "bg-green-100 text-green-700", icon: CheckCircle };
  };

  const hasIncompletePolicies = items.some(item => {
    const status = getPolicyStatus(item);
    return status.status === "incomplete";
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">
              {items.length} {itemName.toLowerCase()}{items.length !== 1 ? 'ies' : ''} • 
              <span className="ml-1 font-medium text-blue-600">
                {items.filter(item => getPolicyStatus(item).status === 'complete').length} complete
              </span>
            </p>
          </div>
        </div>
        
        {canAddItems && (
          <button
            type="button"
            onClick={addNewItem}
            className="flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addButtonText}
          </button>
        )}
      </div>

      {/* Warning for incomplete policies */}
      {hasIncompletePolicies && (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Incomplete Policies</h4>
              <p className="text-sm text-yellow-700">
                Some policies need attention. Please complete all required fields.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Policies List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
              <FileText className="w-8 h-8 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No {itemName.toLowerCase()} yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Get started by creating your first {itemName.toLowerCase()}. This will help your customers understand your terms and conditions.
            </p>
            {canAddItems && (
              <button
                onClick={addNewItem}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First {itemName}
              </button>
            )}
          </div>
        ) : (
          items.map((item, index) => {
            const status = getPolicyStatus(item);
            const StatusIcon = status.icon;
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${
                  item.isExpanded ? 'ring-2 ring-blue-100 shadow-lg' : ''
                }`}
              >
                {/* Enhanced Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.heading || `${itemName} ${index + 1}`}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </span>
                        {item.heading && (
                          <span className="text-xs text-gray-500">
                            {item.description.length > 0 ? 
                              `${item.description.length} characters` : 
                              'No description'
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete policy"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      {item.isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Content */}
                {item.isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Policy Title
                          </label>
                          <InputField
                            label="Policy Title"
                            value={item.heading}
                            onChange={(value) =>
                              handleItemChange(item.id, "heading", value)
                            }
                            placeholder="Enter a clear, descriptive title for your policy..."
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Policy Details
                          </label>
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <ReactQuill
                              value={item.description}
                              onChange={(value) =>
                                handleItemChange(item.id, "description", value)
                              }
                              placeholder="Enter detailed policy information. Be clear and specific about terms, conditions, and requirements..."
                              modules={{
                                toolbar: [
                                  [{ 'header': [1, 2, false] }],
                                  ['bold', 'italic', 'underline'],
                                  ['link', 'list'],
                                  ['clean']
                                ],
                              }}
                              className="min-h-[140px]"
                            />
                          </div>
                        </div>
                      </div>

                      {showSubmitButton && (
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            onClick={handleSaveClick}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save {itemName}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Enhanced Summary Section */}
      {items.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{items.length}</span> {itemName.toLowerCase()}{items.length !== 1 ? 'ies' : ''} total
              </div>
              <div className="flex items-center space-x-3">
                {(() => {
                  const complete = items.filter(item => getPolicyStatus(item).status === 'complete').length;
                  const incomplete = items.filter(item => getPolicyStatus(item).status === 'incomplete').length;
                  const draft = items.filter(item => getPolicyStatus(item).status === 'draft').length;
                  
                  return (
                    <>
                      {complete > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {complete} complete
                        </span>
                      )}
                      {incomplete > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {incomplete} incomplete
                        </span>
                      )}
                      {draft > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock className="w-3 h-3 mr-1" />
                          {draft} draft
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableSectionComponent;
