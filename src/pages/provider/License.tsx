import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  XCircle,
  HelpCircle,
  Upload,
} from "lucide-react";
import type { licenseResponse } from "@/types/authTypes";
import type { ServiceType } from "@/types/serviceTypes";
import {
  LicenseFormComponent,
  type LicenseFormData,
} from "@/components/forms/LicenseFormComponent";
import {
  getLicense,
  renewLicense,
  requestApproval,
} from "@/services/providerService";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import DocumentViewer from "@/components/ui/DocumentViewer";

const serviceCategories = [
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "TOUR_GUIDE", label: "Tour Guide" },
  { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
];

const License: React.FC = () => {
  const [licenses, setLicenses] = useState<licenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renewalMode, setRenewalMode] = useState<string | null>(null);
  const [renewalLicenses, setRenewalLicenses] = useState<LicenseFormData[]>([]);
  const [renewalSubmitting, setRenewalSubmitting] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    // Initialize with first section expanded
    ...serviceCategories.slice(1).reduce(
      (acc, category) => ({
        ...acc,
        [category.value]: true,
      }),
      {}
    ),
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await getLicense();
      setLicenses(response);
    } catch (err) {
      console.error("Failed to fetch licenses:", err);
      setError("Failed to load licenses");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (categoryValue: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [categoryValue]: !prev[categoryValue],
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "NOT_REQUESTED":
        return <HelpCircle className="w-5 h-5 text-gray-400" />;
      case "RENEWAL":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-700 bg-green-50 border-green-200";
      case "PENDING":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "REJECTED":
        return "text-red-700 bg-red-50 border-red-200";
      case "NOT_REQUESTED":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "RENEWAL":
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Approved";
      case "PENDING":
        return "Pending Review";
      case "REJECTED":
        return "Rejected";
      case "NOT_REQUESTED":
        return "Not Submitted";
      case "RENEWAL":
        return "Renewal in Progress";
      default:
        return "Unknown";
    }
  };

  const getStatusActionText = (status: string, hasLicenses: boolean) => {
    switch (status) {
      case "APPROVED":
        return "Renew Licenses";
      case "NOT_REQUESTED":
        return "Request Approval";
      case "REJECTED":
        return "Request Approval";
      case "PENDING":
        return "Review in Progress";
      case "RENEWAL":
        return "Renewal in Progress";
      default:
        return hasLicenses ? "Manage Licenses" : "Add Licenses";
    }
  };

  const getStatusActionIcon = (status: string, hasLicenses: boolean) => {
    switch (status) {
      case "APPROVED":
        return <RefreshCw className="w-4 h-4 mr-2" />;
      case "NOT_REQUESTED":
        return <Upload className="w-4 h-4 mr-2" />;
      case "REJECTED":
        return <Upload className="w-4 h-4 mr-2" />;
      case "PENDING":
        return <Clock className="w-4 h-4 mr-2" />;
      case "RENEWAL":
        return <RefreshCw className="w-4 h-4 mr-2" />;
      default:
        return hasLicenses ? (
          <RefreshCw className="w-4 h-4 mr-2" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        );
    }
  };

  const isActionAllowed = (status: string) => {
    // Actions are only allowed for NOT_REQUESTED, REJECTED, and APPROVED statuses
    return ["NOT_REQUESTED", "REJECTED", "APPROVED"].includes(status);
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expiry <= thirtyDaysFromNow && expiry >= today;
  };

  const isLicenseExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const handleStartRenewal = (serviceCategory: ServiceType) => {
    const categoryLicenses = licenses.find(
      (l) => l.serviceCategory === serviceCategory
    );
    if (categoryLicenses) {
      const renewalData: LicenseFormData[] = categoryLicenses.licenses.map(
        (license) => ({
          licenseNumber: license.licenseNumber,
          expiryDate: license.expiryDate,
          category: license.category,
          licenseFile: null, // Will need to upload new file
        })
      );
      setRenewalLicenses(renewalData);
    } else {
      // No existing licenses, start fresh
      setRenewalLicenses([
        {
          licenseNumber: "",
          expiryDate: "",
          category: serviceCategory,
          licenseFile: null,
        },
      ]);
    }
    setRenewalMode(serviceCategory);
  };

  const handleCancelRenewal = () => {
    setRenewalMode(null);
    setRenewalLicenses([]);
  };

  const handleSubmitRenewal = async () => {
    if (!renewalMode || renewalLicenses.length === 0) return;

    try {
      setRenewalSubmitting(true);

      // Validate that all licenses have files
      const invalidLicenses = renewalLicenses.filter(
        (license) => !license.licenseFile
      );
      if (invalidLicenses.length > 0) {
        setError("Please upload files for all licenses");
        return;
      }

      // Convert to DTO format and collect all files
      const licenseDTOs = renewalLicenses.map((license) => ({
        licenseId: 0,
        licenseNumber: license.licenseNumber,
        expiryDate: license.expiryDate,
        category: license.category,
        licenseUrl: "",
      }));

      const allFiles = renewalLicenses
        .map((license) => license.licenseFile)
        .filter((file): file is File => file !== null);

      // Get the current category data to determine which API to use
      const categoryData = licenses.find(
        (l) => l.serviceCategory === (renewalMode as ServiceType)
      );

      const currentStatus = categoryData?.approvalStatus || "NOT_REQUESTED";

      // Use appropriate API based on current status
      if (currentStatus === "APPROVED") {
        // Use renewLicense for approved licenses
        console.log("🔄 Using renewLicense API for APPROVED status");
        await renewLicense(licenseDTOs, allFiles);
      } else if (["NOT_REQUESTED", "REJECTED"].includes(currentStatus)) {
        // Use requestApproval for not requested or rejected licenses
        console.log(
          "📝 Using requestApproval API for",
          currentStatus,
          "status"
        );
        await requestApproval(licenseDTOs, allFiles);
      } else {
        throw new Error("Action not allowed for current status");
      }

      // Refresh licenses
      await fetchLicenses();

      // Exit renewal mode
      setRenewalMode(null);
      setRenewalLicenses([]);
      setError(null);
    } catch (err) {
      console.error("License submission failed:", err);
      setError("Failed to submit licenses. Please try again.");
    } finally {
      setRenewalSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">License Management</h1>
        <ProviderTopBar />
      </div>
      <div className="min-h-screen bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          <div className="space-y-6">
            {serviceCategories.map((category) => {
              const categoryData = licenses.find(
                (l) => l.serviceCategory === (category.value as ServiceType)
              );
              const isInRenewalMode = renewalMode === category.value;
              const isCollapsed = collapsedSections[category.value];

              return (
                <motion.div
                  key={category.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  <div className="border-b border-gray-200">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleSection(category.value)}
                          className="flex items-center flex-1 text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                        >
                          <FileText className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h2 className="text-xl font-semibold text-gray-900">
                                {category.label}
                              </h2>
                              {categoryData && (
                                <div className="flex items-center">
                                  {getStatusIcon(categoryData.approvalStatus)}
                                  <span
                                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                      categoryData.approvalStatus
                                    )}`}
                                  >
                                    {getStatusText(categoryData.approvalStatus)}
                                  </span>
                                </div>
                              )}
                            </div>
                            {isCollapsed && categoryData && (
                              <div className="mt-1 flex items-center text-sm text-gray-600">
                                <span className="mr-3">
                                  {categoryData.licenses.length} license
                                  {categoryData.licenses.length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                                {/* Compact license expiry warning only */}
                                {categoryData.licenses.some(
                                  (license) =>
                                    isLicenseExpiringSoon(license.expiryDate) ||
                                    isLicenseExpired(license.expiryDate)
                                ) && (
                                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">
                                    Expiry Alert
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center ml-4">
                            {isCollapsed ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {!isInRenewalMode && !isCollapsed && (
                          <div className="ml-4">
                            <button
                              onClick={() =>
                                handleStartRenewal(
                                  category.value as ServiceType
                                )
                              }
                              disabled={
                                !isActionAllowed(
                                  categoryData?.approvalStatus ||
                                    "NOT_REQUESTED"
                                )
                              }
                              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                isActionAllowed(
                                  categoryData?.approvalStatus ||
                                    "NOT_REQUESTED"
                                )
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              {getStatusActionIcon(
                                categoryData?.approvalStatus || "NOT_REQUESTED",
                                (categoryData?.licenses?.length || 0) > 0
                              )}
                              {getStatusActionText(
                                categoryData?.approvalStatus || "NOT_REQUESTED",
                                (categoryData?.licenses?.length || 0) > 0
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Status Information Banner */}
                        {categoryData &&
                          categoryData.approvalStatus !== "APPROVED" && (
                            <div
                              className={`mb-6 p-4 rounded-lg border ${
                                categoryData.approvalStatus === "PENDING"
                                  ? "bg-yellow-50 border-yellow-200"
                                  : categoryData.approvalStatus === "REJECTED"
                                  ? "bg-red-50 border-red-200"
                                  : categoryData.approvalStatus === "RENEWAL"
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-blue-50 border-blue-200"
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3 mt-0.5">
                                  {getStatusIcon(categoryData.approvalStatus)}
                                </div>
                                <div>
                                  <h4
                                    className={`font-medium mb-1 ${
                                      categoryData.approvalStatus === "PENDING"
                                        ? "text-yellow-800"
                                        : categoryData.approvalStatus ===
                                          "REJECTED"
                                        ? "text-red-800"
                                        : categoryData.approvalStatus ===
                                          "RENEWAL"
                                        ? "text-blue-800"
                                        : "text-blue-800"
                                    }`}
                                  >
                                    {categoryData.approvalStatus ===
                                      "PENDING" && "Review in Progress"}
                                    {categoryData.approvalStatus ===
                                      "REJECTED" && "Action Required"}
                                    {categoryData.approvalStatus ===
                                      "NOT_REQUESTED" && "Ready to Submit"}
                                    {categoryData.approvalStatus ===
                                      "RENEWAL" && "Renewal in Progress"}
                                  </h4>
                                  <p
                                    className={`text-sm ${
                                      categoryData.approvalStatus === "PENDING"
                                        ? "text-yellow-700"
                                        : categoryData.approvalStatus ===
                                          "REJECTED"
                                        ? "text-red-700"
                                        : categoryData.approvalStatus ===
                                          "RENEWAL"
                                        ? "text-blue-700"
                                        : "text-blue-700"
                                    }`}
                                  >
                                    {categoryData.approvalStatus ===
                                      "PENDING" &&
                                      "Your license submission is being reviewed. You'll be notified once the review is complete."}
                                    {categoryData.approvalStatus ===
                                      "REJECTED" &&
                                      "Your submission was rejected. Please review the feedback and resubmit with corrected information."}
                                    {categoryData.approvalStatus ===
                                      "NOT_REQUESTED" &&
                                      "Submit your licenses to start offering services in this category."}
                                    {categoryData.approvalStatus ===
                                      "RENEWAL" &&
                                      "Your license renewal is being processed. Please wait for the review to complete."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {isInRenewalMode ? (
                          <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h3 className="font-medium text-blue-900 mb-2">
                                {categoryData?.approvalStatus === "APPROVED"
                                  ? "Renew Licenses"
                                  : "Request License Approval"}
                              </h3>
                              <p className="text-blue-700 text-sm">
                                {categoryData?.approvalStatus === "APPROVED"
                                  ? "Update your license information and upload new files for renewal"
                                  : categoryData?.approvalStatus === "REJECTED"
                                  ? "Resubmit your license information with corrections"
                                  : "Submit your license information for approval"}
                              </p>
                            </div>

                            <LicenseFormComponent
                              licenses={renewalLicenses}
                              onLicensesChange={setRenewalLicenses}
                              categories={[
                                {
                                  value: category.value,
                                  label: category.label,
                                },
                              ]}
                              title="License Information"
                            />

                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={handleCancelRenewal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmitRenewal}
                                disabled={renewalSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {renewalSubmitting ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    {categoryData?.approvalStatus === "APPROVED"
                                      ? "Submit Renewal"
                                      : "Request Approval"}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {(categoryData?.licenses?.length || 0) > 0 ? (
                              <div className="space-y-4">
                                {categoryData!.licenses.map((license) => (
                                  <div
                                    key={license.licenseId}
                                    className="border rounded-lg p-4 bg-gray-50"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">
                                          License Number
                                        </label>
                                        <p className="text-gray-900">
                                          {license.licenseNumber}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">
                                          Category
                                        </label>
                                        <p className="text-gray-900">
                                          {license.category}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">
                                          Expiry Date
                                        </label>
                                        <div className="flex items-center">
                                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                          <p
                                            className={`text-sm ${
                                              isLicenseExpired(
                                                license.expiryDate
                                              )
                                                ? "text-red-600 font-medium"
                                                : isLicenseExpiringSoon(
                                                    license.expiryDate
                                                  )
                                                ? "text-yellow-600 font-medium"
                                                : "text-gray-900"
                                            }`}
                                          >
                                            {formatDate(license.expiryDate)}
                                            {isLicenseExpired(
                                              license.expiryDate
                                            ) && (
                                              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                EXPIRED
                                              </span>
                                            )}
                                            {isLicenseExpiringSoon(
                                              license.expiryDate
                                            ) &&
                                              !isLicenseExpired(
                                                license.expiryDate
                                              ) && (
                                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                                  EXPIRING SOON
                                                </span>
                                              )}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">
                                          License File
                                        </label>
                                        {license.licenseUrl ? (
                                          <DocumentViewer
                                            url={license.licenseUrl}
                                            title={`${license.category} License - ${license.licenseNumber}`}
                                            triggerButton={
                                              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                                <FileText className="w-4 h-4 mr-1" />
                                                View Document
                                              </button>
                                            }
                                          />
                                        ) : (
                                          <p className="text-gray-500 text-sm">
                                            No file available
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                {categoryData ? (
                                  // Has category data but no licenses
                                  <div>
                                    {getStatusIcon(categoryData.approvalStatus)}
                                    <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                                      {getStatusIcon(
                                        categoryData.approvalStatus
                                      )}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                      {categoryData.approvalStatus ===
                                        "NOT_REQUESTED" &&
                                        "Ready to Submit Licenses"}
                                      {categoryData.approvalStatus ===
                                        "PENDING" && "Submission Under Review"}
                                      {categoryData.approvalStatus ===
                                        "REJECTED" && "Submission Rejected"}
                                      {categoryData.approvalStatus ===
                                        "APPROVED" && "Category Approved"}
                                      {categoryData.approvalStatus ===
                                        "RENEWAL" && "Renewal in Progress"}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                      {categoryData.approvalStatus ===
                                        "NOT_REQUESTED" &&
                                        `Submit your ${category.label.toLowerCase()} licenses to get started with this service category.`}
                                      {categoryData.approvalStatus ===
                                        "PENDING" &&
                                        `Your ${category.label.toLowerCase()} license submission is being reviewed by our team.`}
                                      {categoryData.approvalStatus ===
                                        "REJECTED" &&
                                        `Your ${category.label.toLowerCase()} license submission was rejected. Please review and resubmit.`}
                                      {categoryData.approvalStatus ===
                                        "APPROVED" &&
                                        `Your ${category.label.toLowerCase()} category is approved. You can add more licenses if needed.`}
                                      {categoryData.approvalStatus ===
                                        "RENEWAL" &&
                                        `Your ${category.label.toLowerCase()} license renewal is being processed.`}
                                    </p>
                                  </div>
                                ) : (
                                  // No category data at all
                                  <div>
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                      No licenses found
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                      You haven't added any licenses for{" "}
                                      {category.label} yet.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default License;
