import React from "react";
import { Check } from "lucide-react";

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  labelClassName?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  className = "",
  labelClassName = "",
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === "Enter" || event.key === " ") && !disabled) {
      event.preventDefault();
      onChange(!checked);
    }
  };

  const checkboxId = `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center
              ${
                checked
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-300 hover:border-gray-400"
              }
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              }
              ${
                error
                  ? "border-red-500"
                  : checked
                  ? "border-blue-600"
                  : "border-gray-300"
              }
            `}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="checkbox"
            aria-checked={checked}
            aria-labelledby={`${checkboxId}-label`}
            aria-disabled={disabled}
            aria-required={required}
          >
            {checked && (
              <Check
                size={12}
                className="text-white stroke-[3]"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </div>
        </div>

        <label
          id={`${checkboxId}-label`}
          htmlFor={checkboxId}
          className={`
            text-sm font-medium cursor-pointer select-none flex-1
            ${
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-gray-900"
            }
            ${labelClassName}
          `}
          onClick={handleToggle}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {helperText && !error && (
        <p className="text-xs text-gray-500 ml-8">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 ml-8 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;
