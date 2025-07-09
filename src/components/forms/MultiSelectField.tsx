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
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

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
        {/* {icon && <div className="absolute left-3 top-2.5 z-10">{icon}</div>} */}
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          placeholder={placeholder}
          classNamePrefix="react-select"
          // className={`${icon ? "pl-10" : ""}`}
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#d1d5db",
              boxShadow: "none",
              minHeight: "38px",
              // paddingLeft: icon ? "1.75rem" : undefined,
            }),
          }}
        />
      </div>
    </div>
  );
};

export default MultiSelectField;
