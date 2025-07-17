import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import EditContactPersonModal from "@/components/provider/EditContactPersonModal";
import { getBusinessDetails } from "@/services/providerService";
import type { BusinessDetails } from "@/types/registration";
import {
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Download,
  Eye,
  IdCard,
  Briefcase,
  Globe,
  FileImage,
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

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getBusinessDetails();
        setBusinessDetails(response);
      } catch (err: any) {
        console.error("Error fetching business details:", err);
        setError(
          "Failed to load business details. Using mock data for development."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, []);

  // Helper function to ensure file URLs have the correct base path
  const getFileUrl = (url: string) => {
    if (!url) return "";

    // If it's already a full URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a relative path, prepend the base URL
    const baseUrl = "http://localhost:8080";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const getFileIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
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
      // Create FormData for file uploads
      const formData = new FormData();

      // Add form fields
      formData.append("name", data.contactPersonName);
      formData.append("position", data.contactPersonPosition);
      formData.append("email", data.contactPersonEmail);
      formData.append("phoneNumber", data.contactPersonPhone);

      // Add file if selected
      if (identityFile) {
        formData.append("identityDocument", identityFile);
      }

      // TODO: Replace with actual API call
      console.log("Saving contact person details:", data);
      console.log("Identity document:", identityFile);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state (in real app, refetch from API)
      if (businessDetails) {
        const updatedDetails = {
          ...businessDetails,
          contactPerson: {
            ...businessDetails.contactPerson,
            name: data.contactPersonName,
            position: data.contactPersonPosition,
            email: data.contactPersonEmail,
            phoneNumber: data.contactPersonPhone,
          },
        };
        setBusinessDetails(updatedDetails);
      }
    } catch (error) {
      console.error("Error saving contact person details:", error);
      throw new Error(
        "Failed to save contact person details. Please try again."
      );
    }
  };

  const DocumentViewer = ({ url, title }: { url: string; title: string }) => {
    const fullUrl = getFileUrl(url);
    const extension = fullUrl.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension || "");
    const isPdf = extension === "pdf";

    // Debug logging
    console.log("DocumentViewer Debug:", {
      originalUrl: url,
      fullUrl,
      extension,
      isImage,
      isPdf,
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Document
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon(fullUrl)}
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-white">
            {isImage ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={fullUrl}
                  alt={title}
                  className="max-w-full max-h-full object-contain border rounded"
                  onLoad={() =>
                    console.log("Image loaded successfully:", fullUrl)
                  }
                  onError={(e) => {
                    console.error("Image failed to load:", fullUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    // Show error message
                    const errorDiv = document.createElement("div");
                    errorDiv.className = "text-red-500 text-center p-4";
                    errorDiv.textContent = `Failed to load image: ${fullUrl}`;
                    target.parentNode?.appendChild(errorDiv);
                  }}
                />
              </div>
            ) : isPdf ? (
              <div className="w-full h-full p-4">
                <iframe
                  src={fullUrl}
                  className="w-full h-full border-0 rounded shadow"
                  title={title}
                  onLoad={() =>
                    console.log("PDF loaded successfully:", fullUrl)
                  }
                  onError={() => console.error("PDF failed to load:", fullUrl)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg m-4">
                <div className="text-center">
                  {getFileIcon(fullUrl)}
                  <p className="mt-2 text-sm text-gray-600">
                    This document type cannot be previewed directly.
                  </p>
                  <p className="mt-1 text-xs text-gray-500 font-mono">
                    {fullUrl}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(fullUrl, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
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

  if (!businessDetails) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Contact Person</h1>
          <ProviderTopBar />
          <div className="text-center py-12">
            <p className="text-gray-500">No business details found.</p>
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
                  {businessDetails.contactPerson.name}
                </p>
                <p className="text-sm text-gray-600">Full Name</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson.position}
                </p>
                <p className="text-sm text-gray-600">Position</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson.email}
                </p>
                <p className="text-sm text-gray-600">Email Address</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {businessDetails.contactPerson.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">Phone Number</p>
              </div>
            </div>

            {businessDetails.contactPerson.identityDocumentUrl && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Identity Document</span>
                  </div>
                  {getFileIcon(
                    getFileUrl(
                      businessDetails.contactPerson.identityDocumentUrl
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <DocumentViewer
                    url={businessDetails.contactPerson.identityDocumentUrl}
                    title="Identity Document"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        getFileUrl(
                          businessDetails.contactPerson.identityDocumentUrl!
                        ),
                        "_blank"
                      )
                    }
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
                {getFileIcon(
                  getFileUrl(businessDetails.businessRegistrationUrl)
                )}
              </div>
              <div className="flex gap-2">
                <DocumentViewer
                  url={businessDetails.businessRegistrationUrl}
                  title="Business Registration Document"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      getFileUrl(businessDetails.businessRegistrationUrl),
                      "_blank"
                    )
                  }
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
