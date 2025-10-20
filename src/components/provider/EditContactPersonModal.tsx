import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, AlertCircle } from "lucide-react";
import InputField from "@/components/forms/InputField";
import FileUploadGroup from "@/components/forms/FileUploadGroup";
import type { BusinessDetails } from "@/types/registration";

interface EditContactPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessDetails: BusinessDetails;
  onSave: (
    data: ContactPersonFormData,
    identityFile: File | null
  ) => Promise<void>;
}

interface ContactPersonFormData {
  contactPersonName: string;
  contactPersonPosition: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  contactPersonIdentityFile: File | null;
}

const EditContactPersonModal: React.FC<EditContactPersonModalProps> = ({
  isOpen,
  onClose,
  businessDetails,
  onSave,
}) => {
  const [formData, setFormData] = useState<ContactPersonFormData>({
    contactPersonName: "",
    contactPersonPosition: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    contactPersonIdentityFile: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when modal opens or business details change
  useEffect(() => {
    if (isOpen && businessDetails) {
      setFormData({
        contactPersonName: businessDetails.contactPerson?.name || "",
        contactPersonPosition: businessDetails.contactPerson?.position || "",
        contactPersonPhone: businessDetails.contactPerson?.phoneNumber || "",
        contactPersonEmail: businessDetails.contactPerson?.email || "",
        contactPersonIdentityFile: null,
      });
      setErrors({});
    }
  }, [isOpen, businessDetails]);

  const validateField = (
    key: keyof ContactPersonFormData,
    value: any
  ): string => {
    switch (key) {
      case "contactPersonEmail":
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          if (!trimmedValue) return "Email is required";
          return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
            ? "Please enter a valid email address"
            : "";
        }
        return "Email is required";
      case "contactPersonPhone":
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          if (!trimmedValue) return "Phone number is required";
          const cleanPhone = trimmedValue.replace(/\s|-|\(|\)/g, "");
          return !/^(\+94|0)?[1-9]\d{8}$/.test(cleanPhone)
            ? "Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)"
            : "";
        }
        return "Phone number is required";
      case "contactPersonName":
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          if (!trimmedValue) return "Name is required";
          if (trimmedValue.length < 2)
            return "Name must be at least 2 characters";
          if (trimmedValue.length > 100)
            return "Name must be less than 100 characters";
          return "";
        }
        return "Name is required";
      case "contactPersonPosition":
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          if (!trimmedValue) return "Position is required";
          if (trimmedValue.length < 2)
            return "Position must be at least 2 characters";
          if (trimmedValue.length > 50)
            return "Position must be less than 50 characters";
          return "";
        }
        return "Position is required";
      default:
        return "";
    }
  };

  const updateField = (key: keyof ContactPersonFormData, value: any) => {
    // Trim string values for consistent validation
    const processedValue = typeof value === "string" ? value.trim() : value;

    setFormData((prev) => ({
      ...prev,
      [key]: typeof value === "string" ? value : processedValue, // Keep original value for input display, but use trimmed for validation
    }));

    // Clear error when user starts typing and validate on change for immediate feedback
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // Immediate validation for better UX (only show errors after user has finished typing)
    const validationError = validateField(key, processedValue);
    if (validationError && typeof value === "string" && value.length > 0) {
      // Debounce validation to avoid showing errors while typing
      setTimeout(() => {
        setFormData((currentFormData) => {
          const currentValue = currentFormData[key];
          if (currentValue === value) {
            // Only show error if value hasn't changed
            const error = validateField(
              key,
              typeof currentValue === "string"
                ? currentValue.trim()
                : currentValue
            );
            if (error) {
              setErrors((prev) => ({ ...prev, [key]: error }));
            }
          }
          return currentFormData;
        });
      }, 1000); // 1 second debounce
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate all required fields with trimmed values
    const fieldsToValidate: (keyof ContactPersonFormData)[] = [
      "contactPersonName",
      "contactPersonPosition",
      "contactPersonPhone",
      "contactPersonEmail",
    ];

    for (const field of fieldsToValidate) {
      const value = formData[field];
      const trimmedValue = typeof value === "string" ? value.trim() : value;
      const error = validateField(field, trimmedValue);
      if (error) newErrors[field] = error;
    }

    // Validate file if provided
    if (formData.contactPersonIdentityFile) {
      const file = formData.contactPersonIdentityFile;
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (file.size > maxSize) {
        newErrors.contactPersonIdentityFile = "File size must be less than 5MB";
      } else if (!allowedTypes.includes(file.type)) {
        newErrors.contactPersonIdentityFile =
          "Only PDF, JPG, JPEG, and PNG files are allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      await onSave(formData, formData.contactPersonIdentityFile);
      onClose();
    } catch (error) {
      console.error("Error saving contact person details:", error);
      setErrors({
        general: "Failed to save contact person details. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setFormData({
        contactPersonName: "",
        contactPersonPosition: "",
        contactPersonPhone: "",
        contactPersonEmail: "",
        contactPersonIdentityFile: null,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Contact Person Details
          </DialogTitle>
          <DialogDescription>
            Update the contact person information for your business.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Contact Person Name"
                value={formData.contactPersonName}
                onChange={(val) => updateField("contactPersonName", val)}
                required
                error={errors.contactPersonName}
                placeholder="Full name of contact person"
              />
              <InputField
                label="Position"
                value={formData.contactPersonPosition}
                onChange={(val) => updateField("contactPersonPosition", val)}
                required
                error={errors.contactPersonPosition}
                placeholder="Manager, Director, etc."
              />
              <InputField
                label="Contact Phone"
                value={formData.contactPersonPhone}
                onChange={(val) => updateField("contactPersonPhone", val)}
                required
                error={errors.contactPersonPhone}
                placeholder="0701234567 or +94701234567"
              />
              <InputField
                label="Contact Email"
                type="email"
                value={formData.contactPersonEmail}
                onChange={(val) => updateField("contactPersonEmail", val)}
                required
                error={errors.contactPersonEmail}
                placeholder="contact@business.com"
              />
            </div>

            <div className="mt-8">
              <FileUploadGroup
                label="Contact Person Identity Document"
                required={false}
                uploadedFiles={
                  formData.contactPersonIdentityFile
                    ? [formData.contactPersonIdentityFile]
                    : []
                }
                onFilesChange={(files) => {
                  updateField(
                    "contactPersonIdentityFile",
                    files.length > 0 ? files[0] : null
                  );
                }}
                accept=".pdf,.jpg,.jpeg,.png"
                maxFiles={1}
                maxFileSize={5}
                error={errors.contactPersonIdentityFile}
              />
              {!formData.contactPersonIdentityFile &&
                businessDetails.contactPerson?.identityDocumentUrl && (
                  <p className="text-sm text-gray-600 mt-2">
                    📄 Current file will be kept if no new file is uploaded.
                  </p>
                )}
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactPersonModal;
