import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import EditContactPersonModal from "@/components/provider/EditContactPersonModal";
import DocumentViewer from "@/components/ui/DocumentViewer";
import {
  getBusinessDetails,
  updateContactPerson,
} from "@/services/providerService";
import type { BusinessDetails } from "@/types/registration";
import {
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Download,
  IdCard,
  Briefcase,
  AlertCircle,
  Edit,
} from "lucide-react";

interface ContactPersonFormData {
  contactPersonName: string;
  contactPersonPosition: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  contactPersonIdentityFile: File | null;
}

const ContactPerson = () => {
  const [businessDetails, setBusinessDetails] =
    useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getBusinessDetails();
        console.log("📦 ContactPerson received business details:", {
          hasResponse: !!response,
          hasContactPerson: !!response?.contactPerson,
          contactPersonData: response?.contactPerson,
          responseKeys: response ? Object.keys(response) : [],
          fullResponse: response,
        });
        setBusinessDetails(response);
      } catch (err: any) {
        console.error("Error fetching business details:", err);

        // Extract meaningful error message
        let errorMessage = "Failed to load business details.";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, []);

  // Simple helper for download URLs
  const getDownloadUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
    return `${baseUrl}${url}`;
  };

  //business type labels and values
  const businessTypeLabels: Record<string, string> = {
    INDIVIDUAL: "Individual",
    COMPANY: "Company",
    ORGANIZATION: "Organization",
  };

  const handleSaveContactPerson = async (
    data: ContactPersonFormData,
    identityFile: File | null
  ) => {
    try {
      // Prepare contact person data
      const contactPersonData = {
        name: data.contactPersonName,
        position: data.contactPersonPosition,
        email: data.contactPersonEmail,
        phoneNumber: data.contactPersonPhone,
      };

      console.log("Updating contact person details:", contactPersonData);
      console.log("Identity document:", identityFile);

      // Call the API to update contact person
      const updatedBusinessDetails = await updateContactPerson(
        contactPersonData,
        identityFile
      );

      // Update local state with the response from API
      setBusinessDetails(updatedBusinessDetails);

      // Show success message
      setSuccessMessage("Contact person details updated successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);

      console.log("✅ Contact person updated successfully");
    } catch (error: any) {
      console.error("Error saving contact person details:", error);

      // Extract meaningful error message
      let errorMessage =
        "Failed to save contact person details. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Contact Person</h1>
          <ProviderTopBar />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!businessDetails || !businessDetails.contactPerson) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Contact Person</h1>
          <ProviderTopBar />
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <p className="text-yellow-800 font-medium mb-2">
                {!businessDetails
                  ? "No business details found"
                  : "Contact person information not available"}
              </p>
              <p className="text-sm text-yellow-700">
                {!businessDetails
                  ? "Please ensure you have completed your provider registration."
                  : "Contact person details are missing. Please complete your profile setup."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">
          Contact Person & Business Details
        </h1>
        <ProviderTopBar />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-green-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact Person Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Person
              </CardTitle>
              <CardDescription>
                Primary contact person for this business
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson?.name || "Not specified"}
                </p>
                <p className="text-sm text-gray-600">Full Name</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson?.position || "Not specified"}
                </p>
                <p className="text-sm text-gray-600">Position</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson?.email || "Not specified"}
                </p>
                <p className="text-sm text-gray-600">Email Address</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson?.phoneNumber ||
                    "Not specified"}
                </p>
                <p className="text-sm text-gray-600">Phone Number</p>
              </div>
            </div>

            {businessDetails.contactPerson?.identityDocumentUrl && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Identity Document</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <DocumentViewer
                    url={businessDetails.contactPerson.identityDocumentUrl}
                    title="Identity Document"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = getDownloadUrl(
                        businessDetails.contactPerson?.identityDocumentUrl || ""
                      );
                      if (url) {
                        window.open(url, "_blank");
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Business Details
            </CardTitle>
            <CardDescription>
              Business registration and legal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessTypeLabels[businessDetails.businessType]}
                </p>
                <p className="text-sm text-gray-600">Business Type</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.businessRegistrationNumber}
                </p>
                <p className="text-sm text-gray-600">Registration Number</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Business Registration</span>
                </div>
              </div>
              <div className="flex gap-2">
                <DocumentViewer
                  url={businessDetails.businessRegistrationUrl}
                  title="Business Registration Document"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = getDownloadUrl(
                      businessDetails.businessRegistrationUrl
                    );
                    if (url) {
                      window.open(url, "_blank");
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Contact Person Modal */}
      <EditContactPersonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        businessDetails={businessDetails}
        onSave={handleSaveContactPerson}
      />
    </div>
  );
};

export default ContactPerson;
