import React from "react";
import type { SelectFieldProps } from "@/types/inputTypes";
import { AlertCircle } from "lucide-react";

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = 'mt-5'
  error,
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-primary-400"
      }`}
      required={required}
    >
      <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center gap-2 text-sm text-red-600  p-3 rounded-md">
        <AlertCircle size={16} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default SelectField;
