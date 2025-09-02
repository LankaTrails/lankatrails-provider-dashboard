import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertToast from "@/components/forms/AlertToast";
import { addLicense } from "@/services/LicenseService";
import type { License } from "@/types/serviceTypes";
import SelectField from "@/components/forms/SelectField";

const AddLicense = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [form, setForm] = useState<Omit<License, 'id'>>({
    name: "",
    description: "",
    expiryDate: "",
    documentUrl: "",
    status: "pending",
    issueDate: "",
    issuingAuthority: "",
    licenseNumber: "",
    licenseType: "",
    customType: ""
  });

  type Category = {
    label: string;
    value: string;
  };

  const categories: Category[] = [
    { label: "Activity", value: "ACTIVITY" },
    { label: "Accommodation", value: "ACCOMMODATION" },
    { label: "Food & Beverages", value: "FOOD_BEVERAGE" },
    { label: "Transport", value: "TRANSPORT" },
    { label: "Tour Guides", value: "TOUR_GUIDES" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      // You might want to set a temporary URL or handle file upload here
      setForm(prev => ({ ...prev, documentUrl: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real application, you would upload the file first
      // and then get the URL to store in your database
      const licenseData = {
        ...form,
        // For demo purposes, we're using a placeholder URL
        documentUrl: uploadedFile ? `https://example.com/uploads/${uploadedFile.name}` : form.documentUrl
      };

      await addLicense(serviceType || "accommodation", licenseData);
      setToast({ message: "License added successfully!", type: "success" });
      
      // Redirect back to licenses list after a short delay
      setTimeout(() => {
        navigate(`/${serviceType}/licenses`);
      }, 1500);
    } catch (error) {
      console.error("Error adding license:", error);
      setToast({ message: "Failed to add license", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseToast = () => setToast(null);

  // Render step 1: Basic Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
      
      <div>
        <SelectField
          label="Service Type"
          value={serviceType || ""}
          onChange={() => {}}
          options={categories}
          required
          placeholder="Select service type"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., BL-123456"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the purpose and requirements of this license"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render step 2: Authority & Dates
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Authority & Dates</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issuing Authority *
        </label>
        <input
          type="text"
          name="issuingAuthority"
          value={form.issuingAuthority}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="e.g., City Council, Health Department"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date *
          </label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="renewal">Renewal Needed</option>
        </select>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render step 3: Document Upload
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Document Upload</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload License Document *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG up to 10MB</p>
            {uploadedFile && (
              <p className="text-sm text-green-600 mt-2">
                Selected file: {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document URL (Alternative)
        </label>
        <input
          type="url"
          name="documentUrl"
          value={form.documentUrl}
          onChange={handleChange}
          placeholder="https://example.com/license.pdf"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Or provide a link to the digital copy of your license document
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          name="notes"
          onChange={handleChange}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional information about this license..."
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding License...
            </span>
          ) : (
            'Add License'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Add New License</h1>
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Basic Info</span>
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Details</span>
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Document</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </form>

      {toast && (
        <AlertToast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default AddLicense;