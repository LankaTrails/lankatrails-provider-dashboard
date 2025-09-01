import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertToast from "@/components/forms/AlertToast";
import { submitLicenseApplication } from "@/services/LicenseService";

interface LicenseApplication {
  type: string;
  name: string;
  description: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  documents: File[];
  additionalInfo?: string;
}

const LicenseFlow = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<Partial<LicenseApplication>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: "License Type" },
    { number: 2, title: "Business Information" },
    { number: 3, title: "Upload Documents" },
    { number: 4, title: "Review & Submit" }
  ];

  const licenseTypes = [
    { id: "business", name: "Business License", description: "General business operation license" },
    { id: "health", name: "Health Department Certificate", description: "Food safety and hygiene certification" },
    { id: "alcohol", name: "Alcohol License", description: "Permission to sell alcoholic beverages" },
    { id: "fire", name: "Fire Safety Certificate", description: "Compliance with fire safety regulations" },
    { id: "signage", name: "Signage Permit", description: "Permission for external business signage" }
  ];

  // Validate current step before proceeding
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!application.type) {
          errors.type = "Please select a license type";
        }
        break;
      case 2:
        if (!application.businessName?.trim()) {
          errors.businessName = "Business name is required";
        }
        if (!application.contactName?.trim()) {
          errors.contactName = "Contact name is required";
        }
        if (!application.contactEmail?.trim()) {
          errors.contactEmail = "Contact email is required";
        } else if (!isValidEmail(application.contactEmail)) {
          errors.contactEmail = "Please enter a valid email address";
        }
        break;
      case 3:
        if (!application.documents || application.documents.length === 0) {
          errors.documents = "At least one document is required";
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const handleInputChange = (field: keyof LicenseApplication, value: any) => {
    setApplication(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (files: FileList) => {
    let newFiles = Array.from(files);
    
    // Validate file size (max 10MB each)
    const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setToast({ 
        message: `Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`, 
        type: "error" 
      });
      // Only add files that are within size limit
      newFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
    }
    
    setApplication(prev => ({
      ...prev,
      documents: [...(prev.documents || []), ...newFiles]
    }));
    
    // Clear documents error if any files were added
    if (newFiles.length > 0 && validationErrors.documents) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.documents;
        return newErrors;
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setApplication(prev => ({
      ...prev,
      documents: prev.documents?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateStep(currentStep)) {
      setToast({ 
        message: "Please fix the errors before submitting", 
        type: "error" 
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitLicenseApplication(serviceType || "accommodation", application as LicenseApplication);
      setToast({ 
        message: "Application submitted successfully! Redirecting...", 
        type: "success" 
      });
      setTimeout(() => navigate(`/${serviceType}/licenses`), 2000);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      
      let errorMessage = "Failed to submit application";
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        
        if (status === 400) {
          errorMessage = "Invalid application data. Please check your inputs.";
        } else if (status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (status === 413) {
          errorMessage = "File size too large. Please upload smaller files.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.message || `Error: ${status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        // Something else happened
        errorMessage = error.message || "An unexpected error occurred";
      }
      
      setToast({ 
        message: errorMessage, 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select License Type</h3>
            {validationErrors.type && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                {validationErrors.type}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {licenseTypes.map(type => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    application.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  } ${validationErrors.type ? 'border-red-500' : ''}`}
                  onClick={() => handleInputChange('type', type.id)}
                >
                  <h4 className="font-medium">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name *</label>
                <input
                  type="text"
                  required
                  value={application.businessName || ''}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    validationErrors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={application.contactName || ''}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    validationErrors.contactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.contactName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.contactName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={application.contactEmail || ''}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    validationErrors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.contactEmail && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.contactEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="tel"
                  value={application.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upload Required Documents</h3>
            {validationErrors.documents && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                {validationErrors.documents}
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="document-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Select Files
              </label>
              <p className="text-sm text-gray-600 mt-2">PDF, JPG, PNG files (Max 10MB each)</p>
            </div>

            {application.documents && application.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Uploaded Documents:</h4>
                <div className="space-y-2">
                  {application.documents.map((file, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Application</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>License Type:</strong>
                  <p>{licenseTypes.find(t => t.id === application.type)?.name || 'Not selected'}</p>
                </div>
                <div>
                  <strong>Business Name:</strong>
                  <p>{application.businessName || 'Not provided'}</p>
                </div>
                <div>
                  <strong>Contact Name:</strong>
                  <p>{application.contactName || 'Not provided'}</p>
                </div>
                <div>
                  <strong>Contact Email:</strong>
                  <p>{application.contactEmail || 'Not provided'}</p>
                </div>
                <div>
                  <strong>Contact Phone:</strong>
                  <p>{application.contactPhone || 'Not provided'}</p>
                </div>
                <div>
                  <strong>Documents:</strong>
                  <p>{application.documents?.length || 0} files</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Information</label>
              <textarea
                value={application.additionalInfo || ''}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional information for the licensing authority..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">License Application</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Licenses
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <span className="ml-2 text-sm font-medium hidden md:block">{step.title}</span>
            {index < steps.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
          Back
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        )}
      </div>

      {toast && (
        <AlertToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default LicenseFlow;