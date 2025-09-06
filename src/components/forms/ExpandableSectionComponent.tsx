import React from "react";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputField from "@/components/forms/InputField";
import type { TabData, PolicyData } from "@/types/serviceTypes";

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
    
  };

  const handleSaveClick = async () => {
    if (onSave) {
      await onSave(items);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {canAddItems && (
          <button
            type="button"
            onClick={addNewItem}
            className="flex items-center px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            {addButtonText}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex items-center">
                <span className="font-medium text-gray-700">
                  {item.heading || `${itemName} ${index + 1}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id); // Local removal
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {item.isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>

            {item.isExpanded && (
              <>
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <InputField
                    label="Heading"
                    value={item.heading}
                    onChange={(value) =>
                      handleItemChange(item.id, "heading", value)
                    }
                    placeholder="Enter heading"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <ReactQuill
                      value={item.description}
                      onChange={(value) =>
                        handleItemChange(item.id, "description", value)
                      }
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                {showSubmitButton && (
                  <div className="text-right mt-2 mb-5 px-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandableSectionComponent;
