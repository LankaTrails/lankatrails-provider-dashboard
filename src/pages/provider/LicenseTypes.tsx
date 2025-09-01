import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertToast from "@/components/forms/AlertToast";

interface LicenseType {
  id?: string;
  name: string;
  description: string;
  required: boolean;
  validityPeriod: number; // in months
  cost: number;
  category: string;
}

const LicenseTypes = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<LicenseType, 'id'>>({
    name: "",
    description: "",
    required: false,
    validityPeriod: 12,
    cost: 0,
    category: "general"
  });

  const categories = ["general", "health", "safety", "environmental", "professional"];

  // Mock data for demonstration
  useEffect(() => {
    const mockData: LicenseType[] = [
      {
        id: "1",
        name: "Business License",
        description: "General business operation permit",
        required: true,
        validityPeriod: 12,
        cost: 250,
        category: "general"
      },
      {
        id: "2",
        name: "Health Department Certificate",
        description: "Food safety and hygiene compliance",
        required: true,
        validityPeriod: 6,
        cost: 150,
        category: "health"
      },
      {
        id: "3",
        name: "Fire Safety Certificate",
        description: "Fire safety compliance certification",
        required: true,
        validityPeriod: 24,
        cost: 300,
        category: "safety"
      }
    ];
    setLicenseTypes(mockData);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing license type
      setLicenseTypes(prev => prev.map(lt => 
        lt.id === isEditing ? { ...formData, id: isEditing } : lt
      ));
      setToast({ message: "License type updated successfully!", type: "success" });
    } else {
      // Add new license type
      const newLicenseType: LicenseType = {
        ...formData,
        id: Date.now().toString()
      };
      setLicenseTypes(prev => [...prev, newLicenseType]);
      setToast({ message: "License type added successfully!", type: "success" });
    }
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      required: false,
      validityPeriod: 12,
      cost: 0,
      category: "general"
    });
    setIsEditing(null);
  };

  const handleEdit = (licenseType: LicenseType) => {
    setFormData({
      name: licenseType.name,
      description: licenseType.description,
      required: licenseType.required,
      validityPeriod: licenseType.validityPeriod,
      cost: licenseType.cost,
      category: licenseType.category
    });
    setIsEditing(licenseType.id || null);
  };

  const handleDelete = (id: string) => {
    setLicenseTypes(prev => prev.filter(lt => lt.id !== id));
    setToast({ message: "License type deleted successfully!", type: "success" });
  };

  const handleCloseToast = () => setToast(null);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage License Types</h1>
        <button
  onClick={() => navigate(-1)}
  className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100hover:text-gray-800 font-medium transition-all duration-200 py-2 px-4 rounded-lg hover:bg-gray-50 transform hover:-translate-x-1"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* License Types List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available License Types</h2>
          <div className="space-y-4">
            {licenseTypes.map(licenseType => (
              <div key={licenseType.id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{licenseType.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{licenseType.description}</p>
                    <div className="flex space-x-4 mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        licenseType.required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {licenseType.required ? 'Required' : 'Optional'}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {licenseType.category}
                      </span>
                    </div>
                    <div className="flex space-x-4 mt-2 text-sm">
                      <span>Valid: {licenseType.validityPeriod} months</span>
                      <span>Cost: ${licenseType.cost}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(licenseType)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(licenseType.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit License Type' : 'Add New License Type'}
          </h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Validity Period (months)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.validityPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, validityPeriod: parseInt(e.target.value) }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required for operation
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Update License Type' : 'Add License Type'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setFormData({
                    name: "",
                    description: "",
                    required: false,
                    validityPeriod: 12,
                    cost: 0,
                    category: "general"
                  });
                }}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

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

export default LicenseTypes;