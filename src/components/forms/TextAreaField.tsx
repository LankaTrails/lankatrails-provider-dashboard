import React from "react";
import type { TextAreaFieldProps } from "@/types/inputTypes";
import { AlertCircle } from "lucide-react";

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = 'mt-3'
  error,
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-primary-400"
      }`}
      placeholder={placeholder}
      required={required}
    />
    {error && <div className="flex items-center gap-2 text-sm text-red-600  p-3 rounded-md">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>}
  </div>
);

export default TextAreaField;
