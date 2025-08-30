import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  colorTheme?: "primary" | "blue" | "green" | "purple" | "orange";
  isRequired?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  icon,
  defaultOpen = false,
  colorTheme = "primary",
  isRequired = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getThemeClasses = () => {
    switch (colorTheme) {
      case "blue":
        return {
          bg: "from-blue-50 to-blue-50",
          border: "border-blue-100",
          indicator: "bg-blue-500",
          button: "hover:bg-blue-100",
          text: "text-blue-600",
        };
      case "green":
        return {
          bg: "from-green-50 to-green-50",
          border: "border-green-100",
          indicator: "bg-green-500",
          button: "hover:bg-green-100",
          text: "text-green-600",
        };
      case "purple":
        return {
          bg: "from-purple-50 to-purple-50",
          border: "border-purple-100",
          indicator: "bg-purple-500",
          button: "hover:bg-purple-100",
          text: "text-purple-600",
        };
      case "orange":
        return {
          bg: "from-orange-50 to-orange-50",
          border: "border-orange-100",
          indicator: "bg-orange-500",
          button: "hover:bg-orange-100",
          text: "text-orange-600",
        };
      default:
        return {
          bg: "from-primary-50 to-primary-50",
          border: "border-primary-100",
          indicator: "bg-primary-500",
          button: "hover:bg-primary-100",
          text: "text-primary-600",
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className={`bg-gradient-to-r ${theme.bg} p-4 rounded-xl border ${theme.border}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left p-2 rounded-lg transition-colors ${theme.button}`}
      >
        <div className="flex items-center">
          {icon && <span className={`mr-3 ${theme.text}`}>{icon}</span>}
          <span
            className={`w-2 h-2 ${theme.indicator} rounded-full mr-3`}
          ></span>
          <h3 className="text-xl font-semibold text-gray-800">
            {title}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </h3>
        </div>
        <div className="flex items-center">
          {isOpen ? (
            <ChevronUp className={`w-5 h-5 ${theme.text}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${theme.text}`} />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
