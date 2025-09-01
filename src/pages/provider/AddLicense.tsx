import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertToast from "@/components/forms/AlertToast";
import { addLicense, fetchAllLicenseTypes } from "@/services/LicenseService";
import type { License, LicenseType } from "@/types/serviceTypes";

const AddLicense = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [showCustomType, setShowCustomType] = useState(false);

  const [form, setForm] = useState<Omit<License, 'id'>>({
    name: "",
    description: "",
    expiryDate: "",
    documentUrl: "",
    status: "pending",
    issueDate: "",
    issuingAuthority: "",
    licenseNumber: "",
    licenseType: "", // New field for license type
    customType: "" // For custom license types
  });

  // Load license types
  useEffect(() => {
    const loadLicenseTypes = async () => {
      try {
        const types = await fetchAllLicenseTypes(serviceType || "accommodation");
        setLicenseTypes(types);
      } catch (error) {
        console.error("Error loading license types:", error);
        // If API fails, use some default types
        setLicenseTypes([
          { id: "1", name: "Business License", description: "General business operation license", required: true, validityPeriod: 12, cost: 250, category: "general" },
          { id: "2", name: "Health Department Certificate", description: "Food safety and hygiene certification", required: true, validityPeriod: 6, cost: 150, category: "health" },
          { id: "3", name: "Fire Safety Certificate", description: "Fire safety compliance certification", required: true, validityPeriod: 24, cost: 300, category: "safety" }
        ]);
      }
    };

    loadLicenseTypes();
  }, [serviceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // If selecting a predefined type, auto-fill some fields
    if (name === "licenseType" && value) {
      const selectedType = licenseTypes.find(type => type.id === value);
      if (selectedType) {
        setForm(prev => ({
          ...prev,
          name: selectedType.name,
          description: selectedType.description
        }));
        setShowCustomType(false);
      }
    }

    // Show custom type field if "Other" is selected
    if (name === "licenseType" && value === "other") {
      setShowCustomType(true);
      setForm(prev => ({ ...prev, name: "", description: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use custom type if provided, otherwise use selected type
      const licenseData = {
        ...form,
        licenseType: showCustomType ? form.customType : form.licenseType
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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* License Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Type *
          </label>
          <select
            name="licenseType"
            value={form.licenseType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a license type</option>
            {licenseTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} {type.required && " (Required)"}
              </option>
            ))}
            <option value="other">Other (Custom Type)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Select from predefined types or choose "Other" for custom types
          </p>
        </div>

        {/* Custom Type Input (shown when "Other" is selected) */}
        {showCustomType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom License Type *
            </label>
            <input
              type="text"
              name="customType"
              value={form.customType}
              onChange={handleChange}
              placeholder="Enter custom license type"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={showCustomType}
            />
          </div>
        )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Document URL
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
            Link to the digital copy of your license document
          </p>
        </div>

        {/* Additional Information */}
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

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/${serviceType}/licenses`)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
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