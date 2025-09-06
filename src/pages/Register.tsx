import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building,
  Camera,
  FileText,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// Form components
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import TextAreaField from "@/components/forms/TextAreaField";
import FileUploadGroup from "@/components/forms/FileUploadGroup";
import ProfileAndCoverUploader from "@/components/forms/ProfileAndCoverUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import { registerProvider } from "@/services/providerService";
import type { LocationData } from "@/types/serviceTypes";
import type {
  RegistrationRequestBody,
  RegistrationFiles,
  License,
  LicenseData,
} from "@/types/registration";

interface BusinessType {
  label: string;
  value: string;
}

interface Category {
  label: string;
  value: string;
}

interface StepTitles {
  [key: number]: string;
}

interface StepIcons {
  [key: number]: React.ComponentType<any>;
}

const businessTypes: BusinessType[] = [
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Company", value: "COMPANY" },
  { label: "Government/NGO", value: "ORGANIZATION" },
];

const categories: Category[] = [
  { label: "Activity", value: "ACTIVITY" },
  { label: "Accommodation", value: "ACCOMMODATION" },
  { label: "Food & Beverages", value: "FOOD_BEVERAGE" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Tour Guides", value: "TOUR_GUIDES" },
];

const stepTitles: StepTitles = {
  1: "Business Information",
  2: "Contact Person Details",
  3: "Account & Profile Setup",
  4: "Licenses & Certifications",
};

const stepIcons: StepIcons = {
  1: User,
  2: Building,
  3: Camera,
  4: FileText,
  5: Award,
};

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const RegisterProvider: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1 - Business Information
    businessName: "",
    businessDescription: "",
    businessRegistrationNumber: "",
    businessRegistrationFile: null as File | null,
    businessType: "",

    // Step 2 - Contact Person Details
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    contactPersonPosition: "",
    contactPersonIdentityFile: null as File | null,

    // Step 3 - Account & Profile Setup
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null as File | null,
    coverPhoto: null as File | null,
    location: undefined as LocationData | undefined,
    locationSearch: "",

    // Step 4 - Licenses & Certifications
    licenses: [
      {
        licenseNumber: "",
        expiryDate: "",
        category: "",
        licenseFile: null,
      },
    ] as License[],
    accommodationApprovalStatus: "NOT_REQUESTED",
    tourGuideApprovalStatus: "NOT_REQUESTED",
    transportApprovalStatus: "NOT_REQUESTED",
    activityApprovalStatus: "NOT_REQUESTED",
    foodApprovalStatus: "NOT_REQUESTED",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const validateField = (key: keyof typeof formData, value: any): string => {
    switch (key) {
      case "email":
      case "contactPersonEmail":
        if (typeof value === "string") {
          return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Invalid email format"
            : "";
        }
        return "";
      case "password":
        if (typeof value === "string") {
          if (value.length < 6) return "Password must be at least 6 characters";
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return "Password must contain uppercase, lowercase, and number";
          }
        }
        return "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
      case "contactPersonPhone":
        if (typeof value === "string") {
          const cleanPhone = value.replace(/\s|-/g, "");
          return !/^(\+94|0)?[1-9]\d{8}$/.test(cleanPhone)
            ? "Invalid Sri Lankan phone number (10 digits)"
            : "";
        }
        return "";
      case "businessName":
        if (typeof value === "string") {
          if (value.trim().length < 3)
            return "Business name must be at least 3 characters";
          if (value.trim().length > 100)
            return "Business name must be less than 100 characters";
        }
        return "";
      case "businessDescription":
        if (
          typeof value === "string" &&
          value.trim().length > 0 &&
          value.trim().length < 20
        ) {
          return "Description must be at least 20 characters";
        }
        return "";
      default:
        if (typeof value === "string") {
          return value.trim() === "" ? "This field is required" : "";
        }
        return "";
    }
  };

  const updateField = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // If updating licenses, clear all license-specific errors
    if (key === "licenses") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        // Remove all license-specific errors
        Object.keys(newErrors).forEach((errorKey) => {
          if (errorKey.startsWith("license_")) {
            delete newErrors[errorKey];
          }
        });
        // Also clear general licenses error
        delete newErrors.licenses;
        return newErrors;
      });
    }
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    let fieldsToValidate: (keyof typeof formData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "businessName",
          "businessDescription",
          "businessRegistrationNumber",
          "businessType",
        ];
        if (!formData.businessRegistrationFile) {
          stepErrors.businessRegistrationFile =
            "Business registration file is required";
        }
        break;
      case 2:
        fieldsToValidate = [
          "contactPersonName",
          "contactPersonPhone",
          "contactPersonEmail",
          "contactPersonPosition",
        ];
        if (!formData.contactPersonIdentityFile) {
          stepErrors.contactPersonIdentityFile =
            "Contact person identity file is required";
        }
        break;
      case 3:
        fieldsToValidate = ["email", "password", "confirmPassword"];
        if (!formData.location) {
          stepErrors.location = "Please select a location";
        }
        break;
      case 4:
        if (formData.licenses.length === 0) {
          stepErrors.licenses = "At least one license is required";
        } else {
          // Validate each license
          let hasValidLicense = false;
          formData.licenses.forEach((license, index) => {
            const licenseErrors: string[] = [];

            if (!license.licenseNumber?.trim()) {
              licenseErrors.push("License number is required");
            }

            if (!license.expiryDate) {
              licenseErrors.push("Expiry date is required");
            } else {
              // Check if expiry date is in the future
              const expiryDate = new Date(license.expiryDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (expiryDate <= today) {
                licenseErrors.push("Expiry date must be in the future");
              }
            }

            if (!license.category) {
              licenseErrors.push("Category is required");
            }

            if (!license.licenseFile) {
              licenseErrors.push("License file is required");
            }

            if (licenseErrors.length > 0) {
              stepErrors[`license_${index}`] = licenseErrors.join(", ");
            } else {
              hasValidLicense = true;
            }
          });

          if (!hasValidLicense) {
            stepErrors.licenses =
              "At least one complete license is required (all fields filled and file uploaded)";
          }
        }
        break;
    }

    // Validate required fields
    for (const field of fieldsToValidate) {
      const error = validateField(field, formData[field]);
      if (error) stepErrors[field] = error;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      // Only clear errors when validation passes and we're actually moving to the next step
      setErrors({});
      setStep((s) => Math.min(s + 1, totalSteps));
    }
    // Don't clear errors if validation fails - let them stay to show what's wrong
  };

  const prevStep = () => {
    // Clear errors when going back to previous step
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Auto-calculate approval status based on licenses with uploaded files
      const licenseCategories = new Set(
        formData.licenses
          .filter(
            (license) =>
              license.licenseNumber &&
              license.category &&
              license.licenseFile !== null
          )
          .map((license) => license.category)
      );

      const accommodationApprovalStatus = licenseCategories.has("ACCOMMODATION")
        ? "PENDING"
        : "NOT_REQUESTED";
      const tourGuideApprovalStatus = licenseCategories.has("TOUR_GUIDES")
        ? "PENDING"
        : "NOT_REQUESTED";
      const transportApprovalStatus = licenseCategories.has("TRANSPORT")
        ? "PENDING"
        : "NOT_REQUESTED";
      const activityApprovalStatus = licenseCategories.has("ACTIVITY")
        ? "PENDING"
        : "NOT_REQUESTED";
      const foodApprovalStatus = licenseCategories.has("FOOD_BEVERAGE")
        ? "PENDING"
        : "NOT_REQUESTED";

      // Prepare request body according to the required API structure
      const requestBody: RegistrationRequestBody = {
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        businessType: formData.businessType,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        accommodationApprovalStatus,
        tourGuideApprovalStatus,
        transportApprovalStatus,
        activityApprovalStatus,
        foodApprovalStatus,
        location: formData.location!,
        contactPerson: {
          name: formData.contactPersonName,
          email: formData.contactPersonEmail,
          phoneNumber: formData.contactPersonPhone,
          position: formData.contactPersonPosition,
        },
        licenses: formData.licenses.map((license) => ({
          licenseNumber: license.licenseNumber,
          expiryDate: license.expiryDate,
          category: license.category,
        })) as LicenseData[],
      };

      // Prepare files - include license files in the array
      const licenseFiles = formData.licenses
        .map((license) => license.licenseFile)
        .filter((file) => file !== null) as File[];

      const files: RegistrationFiles = {
        profilePhoto: formData.profilePhoto,
        coverPhoto: formData.coverPhoto,
        businessRegistrationFile: formData.businessRegistrationFile,
        licenseFiles: licenseFiles,
        contactPersonIdentityFile: formData.contactPersonIdentityFile,
      };

      // Call API with the structured data
      await registerProvider(requestBody, files);

      console.log("Registration submitted successfully");
      console.log("Request body:", requestBody);
      console.log("Files:", files);

      // Redirect to success page or login
      navigate("/login", {
        state: {
          message: "Registration successful! Please login to continue.",
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const motionProps = {
    variants: stepVariants,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    transition: { duration: 0.3 },
    className: "space-y-6",
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" {...motionProps}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(val) => updateField("businessName", val)}
                  required
                  error={errors.businessName}
                  placeholder="Enter your business name"
                />
                <SelectField
                  label="Business Type"
                  value={formData.businessType}
                  onChange={(val) => updateField("businessType", val)}
                  options={businessTypes}
                  required
                  error={errors.businessType}
                  placeholder="Select business type"
                />

                <TextAreaField
                  label="Business Description"
                  value={formData.businessDescription}
                  onChange={(val) => updateField("businessDescription", val)}
                  required
                  error={errors.businessDescription}
                  placeholder="Describe your business and services"
                  rows={4}
                />
                <InputField
                  label="Business Registration Number"
                  value={formData.businessRegistrationNumber}
                  onChange={(val) =>
                    updateField("businessRegistrationNumber", val)
                  }
                  required
                  error={errors.businessRegistrationNumber}
                  placeholder="Enter your business registration number"
                />
                <div className="md:col-span-1">
                  <MapSelectorComponent
                    label="Business Location"
                    required={true}
                    location={formData.locationSearch}
                    onLocationChange={(searchText) => {
                      updateField("locationSearch", searchText);
                    }}
                    onLocationSelect={(locationData) => {
                      updateField("location", locationData);
                      updateField(
                        "locationSearch",
                        locationData?.formattedAddress
                      );
                    }}
                    selectedCoordinates={
                      formData.location?.latitude &&
                      formData.location?.longitude
                        ? {
                            latitude: formData.location.latitude,
                            longitude: formData.location.longitude,
                          }
                        : undefined
                    }
                    error={errors.location}
                  />
                </div>
                <FileUploadGroup
                  label="Business Registration File"
                  required={true}
                  uploadedFiles={
                    formData.businessRegistrationFile
                      ? [formData.businessRegistrationFile]
                      : []
                  }
                  onFilesChange={(files) => {
                    updateField(
                      "businessRegistrationFile",
                      files.length > 0 ? files[0] : null
                    );
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxFiles={1}
                  maxFileSize={10}
                  error={errors.businessRegistrationFile}
                  width="half"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step2" {...motionProps}>
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
                  label="Contact Person Identity File"
                  required={true}
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
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step3" {...motionProps}>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile & Cover Images
                </h3>
                <ProfileAndCoverUploader
                  profileImage={formData.profilePhoto}
                  setProfileImage={(file) => updateField("profilePhoto", file)}
                  profilePreview={profilePreview}
                  setProfilePreview={setProfilePreview}
                  coverImage={formData.coverPhoto}
                  setCoverImage={(file) => updateField("coverPhoto", file)}
                  coverPreview={coverPreview}
                  setCoverPreview={setCoverPreview}
                  userName={formData.businessName || "Business Name"}
                  profileError={errors.profilePhoto}
                  coverError={errors.coverPhoto}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Setup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(val) => updateField("email", val)}
                  required
                  error={errors.email}
                  placeholder="business@example.com"
                />
                <div className="hidden md:block" />
                <div className="relative">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(val) => updateField("password", val)}
                    required
                    error={errors.password}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <InputField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(val) => updateField("confirmPassword", val)}
                    required
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="step4" {...motionProps}>
            <div className="space-y-8">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-6">
                  License Information
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-4">
                  {formData.licenses.map((license, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <InputField
                          label="License Number"
                          value={license.licenseNumber}
                          onChange={(val) => {
                            const updatedLicenses = [...formData.licenses];
                            updatedLicenses[index].licenseNumber = val;
                            updateField("licenses", updatedLicenses);
                          }}
                          required
                          placeholder="Enter license number"
                        />
                        <InputField
                          label="Expiry Date"
                          type="date"
                          value={license.expiryDate}
                          onChange={(val) => {
                            const updatedLicenses = [...formData.licenses];
                            updatedLicenses[index].expiryDate = val;
                            updateField("licenses", updatedLicenses);
                          }}
                          required
                        />
                        <SelectField
                          label="Category"
                          value={license.category}
                          onChange={(val) => {
                            const updatedLicenses = [...formData.licenses];
                            updatedLicenses[index].category = val;
                            updateField("licenses", updatedLicenses);
                          }}
                          options={categories}
                          required
                          placeholder="Select category"
                        />
                      </div>
                      <div className="mb-4">
                        <FileUploadGroup
                          label="License File"
                          required={true}
                          uploadedFiles={
                            license.licenseFile ? [license.licenseFile] : []
                          }
                          onFilesChange={(files) => {
                            const updatedLicenses = [...formData.licenses];
                            updatedLicenses[index].licenseFile =
                              files.length > 0 ? files[0] : null;
                            updateField("licenses", updatedLicenses);
                          }}
                          accept=".pdf,.jpg,.jpeg,.png"
                          maxFiles={1}
                          maxFileSize={10}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedLicenses = formData.licenses.filter(
                            (_, i) => i !== index
                          );
                          updateField("licenses", updatedLicenses);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove License
                      </button>
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
                  <button
                    type="button"
                    onClick={() => {
                      const newLicense = {
                        licenseNumber: "",
                        expiryDate: "",
                        category: "",
                        licenseFile: null,
                      };
                      updateField("licenses", [
                        ...formData.licenses,
                        newLicense,
                      ]);
                    }}
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                  >
                    + Add License
                  </button>
                </div>
                {errors.licenses && (
                  <p className="text-red-500 text-sm mt-3">{errors.licenses}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const StepIcon = stepIcons[step];
  const progress = (step / totalSteps) * 100;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/sigup.jpg')" }}
    >
      <div className="min-h-screen bg-black/40">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <StepIcon size={32} />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-800">
                  {stepTitles[step]}
                </CardTitle>
                <p className="text-gray-600">
                  Step {step} of {totalSteps}
                </p>
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {errors.general}
                  </div>
                )}

                <div>
                  <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                        step === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>

                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all"
                      >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <form onSubmit={handleSubmit} className="inline">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>Submitting...</>
                          ) : (
                            <>
                              Submit Registration{" "}
                              <CheckCircle className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProvider;
