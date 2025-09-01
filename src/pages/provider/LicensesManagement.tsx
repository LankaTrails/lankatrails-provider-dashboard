import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import AlertToast from "@/components/forms/AlertToast";
import { fetchAllLicenses, addLicense, updateLicense, deleteLicense } from "@/services/LicenseService";
import type { License } from "@/types/serviceTypes";

const ManageLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { serviceType } = useParams();
  const navigate = useNavigate();

  // Load licenses from API
  const loadLicenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllLicenses(serviceType || "accommodation");
      
      if (response && response.length > 0) {
        setLicenses(response);
      } else {
        setLicenses([]);
      }
    } catch (error) {
      console.error("Error fetching licenses:", error);
      setToast({ message: "Failed to load licenses", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLicenses();
  }, [serviceType]);

  const handleDeleteLicense = async (id: string) => {
    try {
      await deleteLicense(serviceType || "accommodation", id);
      setToast({ message: "License deleted successfully!", type: "success" });
      loadLicenses();
    } catch (error) {
      console.error("Error deleting license:", error);
      setToast({ message: "Failed to delete license", type: "error" });
    }
  };

  const handleCloseToast = () => setToast(null);

  const navigateToAddLicense = () => {
    navigate('add');
  };

  const navigateToLicenseFlow = () => {
    navigate('flow');
  };

 const navigateToLicenseTypes = () => {
  // console.log('Current serviceType:', serviceType);
  // console.log('Current pathname:', window.location.pathname);
  
  // // Try different approaches
  navigate('types'); // Relative navigation
};

  // Check if license expires within 30 days
  const isExpiringSoon = (expiryDate: string | undefined): boolean => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return expiry <= thirtyDaysFromNow && expiry >= today;
  };

  // Check if license is expired
  const isExpired = (expiryDate: string | undefined): boolean => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    return expiry < today;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Business Licenses & Certifications</h1>
        <ProviderTopBar />
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={navigateToAddLicense}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add New License
        </button>
        <button
          onClick={navigateToLicenseFlow}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
           + Add New License
        </button>
        <button
          onClick={navigateToLicenseTypes}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Manage License Types
        </button>
        <button
          onClick={loadLicenses}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* License Status Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">License Status Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Active</h3>
                <p className="text-2xl font-bold text-green-900">
                  {licenses.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Pending</h3>
                <p className="text-2xl font-bold text-yellow-900">
                  {licenses.filter(l => l.status === 'pending').length}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="text-lg font-medium text-orange-800">Expiring Soon</h3>
                <p className="text-2xl font-bold text-orange-900">
                  {licenses.filter(l => isExpiringSoon(l.expiryDate)).length}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-lg font-medium text-red-800">Expired</h3>
                <p className="text-2xl font-bold text-red-900">
                  {licenses.filter(l => isExpired(l.expiryDate)).length}
                </p>
              </div>
            </div>
          </div>

          {/* Licenses Grid */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Licenses</h2>
            
            {licenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No licenses yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first license</p>
                <button
                  onClick={navigateToAddLicense}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Your First License
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {licenses.map((license) => (
                  <LicenseCard 
                    key={license.id} 
                    license={license} 
                    onDelete={handleDeleteLicense}
                    isExpiringSoon={isExpiringSoon(license.expiryDate)}
                    isExpired={isExpired(license.expiryDate)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

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

// License Card Component
const LicenseCard = ({ 
  license, 
  onDelete,
  isExpiringSoon,
  isExpired 
}: { 
  license: License; 
  onDelete: (id: string) => void;
  isExpiringSoon: boolean;
  isExpired: boolean;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    } else if (license.id) {
      onDelete(license.id);
      setShowConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`border rounded-lg p-4 relative overflow-hidden ${
      isExpired ? 'border-red-300 bg-red-50' : 
      isExpiringSoon ? 'border-orange-300 bg-orange-50' : 
      'border-gray-200 bg-white'
    }`}>
      {/* Expiration Indicator */}
      {(isExpiringSoon || isExpired) && (
        <div className={`absolute top-0 right-0 px-2 py-1 text-xs font-bold ${
          isExpired ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
        }`}>
          {isExpired ? 'EXPIRED' : 'EXPIRING SOON'}
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900">{license.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{license.description}</p>
      </div>

      <div className="space-y-2 text-sm">
        {license.licenseNumber && (
          <div className="flex justify-between">
            <span className="text-gray-600">License #:</span>
            <span className="font-medium">{license.licenseNumber}</span>
          </div>
        )}

        {license.issuingAuthority && (
          <div className="flex justify-between">
            <span className="text-gray-600">Issued by:</span>
            <span className="font-medium">{license.issuingAuthority}</span>
          </div>
        )}

        {license.issueDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Issue Date:</span>
            <span className="font-medium">{formatDate(license.issueDate)}</span>
          </div>
        )}

        {license.expiryDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Expiry Date:</span>
            <span className={`font-medium ${
              isExpired ? 'text-red-600' : 
              isExpiringSoon ? 'text-orange-600' : 
              'text-gray-900'
            }`}>
              {formatDate(license.expiryDate)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
            {license.status.toUpperCase()}
          </span>
        </div>
      </div>

      {license.documentUrl && (
        <div className="mt-4">
          <a 
            href={license.documentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Document
          </a>
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => {/* Add edit functionality */}}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteClick}
          className={`text-sm ${
            showConfirm ? 'text-red-800 font-bold' : 'text-red-600 hover:text-red-800'
          }`}
        >
          {showConfirm ? 'Confirm Delete?' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ManageLicenses;