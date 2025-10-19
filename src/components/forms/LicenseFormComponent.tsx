import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import FileUploadGroup from "./FileUploadGroup";

export interface LicenseFormData {
  licenseNumber: string;
  expiryDate: string;
  category: string;
  licenseFile: File | null;
}

interface LicenseFormComponentProps {
  licenses: LicenseFormData[];
  onLicensesChange: (licenses: LicenseFormData[]) => void;
  categories: Array<{ value: string; label: string }>;
  errors?: Record<string, string>;
  readOnly?: boolean;
  title?: string;
}

export const LicenseFormComponent: React.FC<LicenseFormComponentProps> = ({
  licenses,
  onLicensesChange,
  categories,
  errors = {},
  readOnly = false,
  title = "License Information",
}) => {
  const updateLicense = (
    index: number,
    field: keyof LicenseFormData,
    value: any
  ) => {
    if (readOnly) return;
    const updatedLicenses = [...licenses];
    updatedLicenses[index] = {
      ...updatedLicenses[index],
      [field]: value,
    };
    onLicensesChange(updatedLicenses);
  };

  const removeLicense = (index: number) => {
    if (readOnly) return;
    const updatedLicenses = licenses.filter((_, i) => i !== index);
    onLicensesChange(updatedLicenses);
  };

  const addLicense = () => {
    if (readOnly) return;
    const newLicense: LicenseFormData = {
      licenseNumber: "",
      expiryDate: "",
      category: "",
      licenseFile: null,
    };
    onLicensesChange([...licenses, newLicense]);
  };

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-6">
        {title}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="space-y-4">
        {licenses.map((license, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InputField
                label="License Number"
                value={license.licenseNumber}
                onChange={(val: string) =>
                  updateLicense(index, "licenseNumber", val)
                }
                required
                placeholder="Enter license number"
              />
              <InputField
                label="Expiry Date"
                type="date"
                value={license.expiryDate}
                onChange={(val: string) =>
                  updateLicense(index, "expiryDate", val)
                }
                required
              />
              <SelectField
                label="Category"
                value={license.category}
                onChange={(val: string) =>
                  updateLicense(index, "category", val)
                }
                options={categories}
                required
                placeholder="Select category"
              />
            </div>
            <div className="mb-4">
              <FileUploadGroup
                label="License File"
                required={true}
                uploadedFiles={license.licenseFile ? [license.licenseFile] : []}
                onFilesChange={(files: File[]) =>
                  updateLicense(
                    index,
                    "licenseFile",
                    files.length > 0 ? files[0] : null
                  )
                }
                accept=".pdf,.jpg,.jpeg,.png"
                maxFiles={1}
                maxFileSize={10}
              />
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={() => removeLicense(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove License
              </button>
            )}
            {errors[`license_${index}`] && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">
                  License {index + 1} errors:
                </p>
                <p className="text-red-600 text-sm mt-1">
                  {errors[`license_${index}`]}
                </p>
              </div>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={addLicense}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            + Add License
          </button>
        )}
      </div>
      {errors.licenses && (
        <p className="text-red-500 text-sm mt-3">{errors.licenses}</p>
      )}
    </div>
  );
};
