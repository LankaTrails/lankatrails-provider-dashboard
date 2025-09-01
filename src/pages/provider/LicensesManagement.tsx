import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AlertToast from "@/components/forms/AlertToast";
import { fetchAllLicenses, deleteLicense } from "@/services/LicenseService";
import type { License } from "@/types/serviceTypes";
import {
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

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
    navigate('types');
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

  // Stats calculation
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const pendingLicenses = licenses.filter(l => l.status === 'pending').length;
  const expiringSoonLicenses = licenses.filter(l => isExpiringSoon(l.expiryDate)).length;
  const expiredLicenses = licenses.filter(l => isExpired(l.expiryDate)).length;

  const stats = [
    {
      title: "Active Licenses",
      value: activeLicenses.toString(),
      icon: <CheckCircle className="w-6 h-6 text-white/90" />,
      gradient: "from-emerald-600 via-emerald-500 to-teal-500",
    },
    {
      title: "Pending Approval",
      value: pendingLicenses.toString(),
      icon: <Clock className="w-6 h-6 text-white/90" />,
      gradient: "from-yellow-500 via-amber-500 to-orange-500",
    },
    {
      title: "Expiring Soon",
      value: expiringSoonLicenses.toString(),
      icon: <AlertTriangle className="w-6 h-6 text-white/90" />,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
    },
    {
      title: "Expired",
      value: expiredLicenses.toString(),
      icon: <FileText className="w-6 h-6 text-white/90" />,
      gradient: "from-red-600 via-red-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Licenses & Certifications</h1>
          <p className="text-gray-600 mt-2">Manage all your business licenses and certifications in one place</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={navigateToAddLicense}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add License
          </Button>
          <Button
            onClick={navigateToLicenseFlow}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            Application Flow
          </Button>
          <Button
            onClick={navigateToLicenseTypes}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Manage Types
          </Button>
          <Button
            onClick={loadLicenses}
            variant="outline"
            className="border-gray-600 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <Card className="shadow">
          <CardContent className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Licenses Grid */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Your Licenses</span>
                <span className="text-sm font-normal text-gray-500">
                  {licenses.length} license{licenses.length !== 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {licenses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No licenses yet</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first license</p>
                  <Button
                    onClick={navigateToAddLicense}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First License
                  </Button>
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
            </CardContent>
          </Card>
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'pending': return <Clock className="w-4 h-4 mr-1" />;
      case 'expired': return <AlertTriangle className="w-4 h-4 mr-1" />;
      default: return <FileText className="w-4 h-4 mr-1" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`border overflow-hidden transition-all hover:shadow-lg ${
      isExpired ? 'border-red-200 bg-red-50' : 
      isExpiringSoon ? 'border-orange-200 bg-orange-50' : 
      'border-gray-200'
    }`}>
      {/* Header with status badge */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {license.name}
          </CardTitle>
          <Badge 
            variant={getStatusVariant(license.status)} 
            className="flex items-center"
          >
            {getStatusIcon(license.status)}
            {license.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{license.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* License details */}
        <div className="space-y-2 text-sm">
          {license.licenseNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">License #:</span>
              <span className="font-mono">{license.licenseNumber}</span>
            </div>
          )}

          {license.issuingAuthority && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Issued by:</span>
              <span>{license.issuingAuthority}</span>
            </div>
          )}

          {license.issueDate && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Issue Date:</span>
              <span>{formatDate(license.issueDate)}</span>
            </div>
          )}

          {license.expiryDate && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Expiry Date:</span>
              <span className={`font-medium ${
                isExpired ? 'text-red-600' : 
                isExpiringSoon ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                {formatDate(license.expiryDate)}
              </span>
            </div>
          )}
        </div>

        {/* Expiration warning */}
        {(isExpiringSoon || isExpired) && (
          <div className={`p-2 rounded-md text-sm font-medium ${
            isExpired ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
          }`}>
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {isExpired ? 'LICENSE EXPIRED' : 'EXPIRING SOON'}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between pt-3 border-t">
          {license.documentUrl && (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => window.open(license.documentUrl, '_blank')}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Document
            </Button>
          )}
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
              onClick={() => {/* Add edit functionality */}}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-red-200 hover:bg-red-50 ${
                showConfirm ? 'text-red-800 font-bold bg-red-100' : 'text-red-600'
              }`}
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {showConfirm ? 'Confirm?' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageLicenses;