import React from "react";
import type { InputFieldProps } from "@/types/inputTypes";
import { AlertCircle } from "lucide-react";

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  required = false,
  className = 'mt-3'
  error,
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-2.5">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-primary-400"
        } ${icon ? "pl-10" : ""}`}
        placeholder={placeholder}
        required={required}
      />
    </div>
    {error && (
      <div className="flex items-center gap-2 text-sm text-red-600  p-3 rounded-md">
        <AlertCircle size={16} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default InputField;
