import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { licenseResponse } from "@/types/authTypes";
import { getLicense } from "@/services/providerService";

const LicenseStatusCard: React.FC = () => {
  const [licenses, setLicenses] = useState<licenseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLicenseStatus();
  }, []);

  const fetchLicenseStatus = async () => {
    try {
      const response = await getLicense();
      setLicenses(response);
    } catch (error) {
      console.error("Failed to fetch license status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalLicenses = () => {
    return licenses.reduce(
      (total, category) => total + (category.licenses?.length || 0),
      0
    );
  };

  const getExpiringLicenses = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return licenses.reduce((count, category) => {
      return (
        count +
        (category.licenses?.filter((license) => {
          const expiryDate = new Date(license.expiryDate);
          return expiryDate <= thirtyDaysFromNow;
        }).length || 0)
      );
    }, 0);
  };

  const getApprovedCategories = () => {
    return licenses.filter((category) => category.approvalStatus === "APPROVED")
      .length;
  };

  const getPendingCategories = () => {
    return licenses.filter((category) => category.approvalStatus === "PENDING")
      .length;
  };

  if (loading) {
    return (
      <Card className="h-[200px]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            License Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalLicenses = getTotalLicenses();
  const expiringLicenses = getExpiringLicenses();
  const approvedCategories = getApprovedCategories();
  const pendingCategories = getPendingCategories();

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          License Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalLicenses}
            </div>
            <div className="text-sm text-blue-700">Total Licenses</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {approvedCategories}
            </div>
            <div className="text-sm text-green-700">Approved</div>
          </div>
        </div>

        <div className="space-y-2">
          {pendingCategories > 0 && (
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-700">
                  {pendingCategories} Pending Approval
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-yellow-700 border-yellow-300"
              >
                Pending
              </Badge>
            </div>
          )}

          {expiringLicenses > 0 && (
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">
                  {expiringLicenses} Expiring Soon
                </span>
              </div>
              <Badge variant="outline" className="text-red-700 border-red-300">
                Action Required
              </Badge>
            </div>
          )}

          {pendingCategories === 0 &&
            expiringLicenses === 0 &&
            totalLicenses > 0 && (
              <div className="flex items-center justify-center p-3 bg-green-50 rounded">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-700">
                  All licenses are up to date
                </span>
              </div>
            )}

          {totalLicenses === 0 && (
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded">
              <FileText className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">
                No licenses added yet
              </span>
            </div>
          )}
        </div>

        <Link to="/dashboard/profile/license">
          <Button className="w-full" variant="outline">
            Manage Licenses
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default LicenseStatusCard;
