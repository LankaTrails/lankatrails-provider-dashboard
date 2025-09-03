import React from "react";
import Select from "react-select";
import type { ReactNode } from "react";

type OptionType = {
  value: string;
  label: string;
};

interface MultiSelectFieldProps {
  label: string;
  options: OptionType[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  icon?: ReactNode;
  required?: boolean;
  className?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options...",
  icon,
  required = false,
  className = "mt-3",
}) => {
  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  // Find selected options based on current value
  const selectedOptions = options.filter((opt) =>
    safeValue.includes(opt.value)
  );

  const handleChange = (selected: readonly OptionType[] | null) => {
    const values = selected ? selected.map((opt) => opt.value) : [];
    onChange(values);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          placeholder={placeholder}
          classNamePrefix="react-select"
          isClearable
          isSearchable
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
              boxShadow: state.isFocused
                ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                : "none",
              minHeight: "38px",
              paddingLeft: icon ? "2.5rem" : "0.75rem",
              "&:hover": {
                borderColor: "#9ca3af",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "#9ca3af",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#e5e7eb",
              borderRadius: "0.375rem",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#374151",
              fontSize: "0.875rem",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#6b7280",
              "&:hover": {
                backgroundColor: "#dc2626",
                color: "white",
              },
            }),
          }}
        />
      </div>
    </div>
  );
};

export default MultiSelectField;
