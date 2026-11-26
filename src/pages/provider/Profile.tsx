import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Lock, UserX } from "lucide-react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import EditProfileModal, {
  type EditProfileFormData,
} from "@/components/provider/EditProfileModal";
import ChangePasswordModal, {
  type ChangePasswordFormData,
} from "@/components/provider/ChangePasswordModal";
import DeactivateAccountModal from "@/components/provider/DeactivateAccountModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { changePassword, deactivateAccount, updateProfile } from "@/services/account";
import { errorMessage } from "@/lib/apiError";
import { fileUrl, GOOGLE_MAPS_API_KEY } from "@/lib/config";

const Profile = () => {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deactivateAccountOpen, setDeactivateAccountOpen] = useState(false);

  const handleSaveProfile = async (formData: EditProfileFormData): Promise<string | null> => {
    try {
      const picked = formData.selectedLocation;
      await updateProfile(
        {
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          location: picked
            ? {
                formattedAddress: picked.formattedAddress,
                city: picked.city,
                district: picked.district,
                province: picked.province,
                country: picked.country,
                postalCode: picked.postalCode,
                latitude: picked.latitude,
                longitude: picked.longitude,
              }
            : undefined,
        },
        formData.profileImage,
        formData.coverImage,
      );
      await refreshProfile();
      toast({ description: "Profile updated" });
      return null;
    } catch (error) {
      return errorMessage(error, "Could not save your profile");
    }
  };

  const handleChangePassword = async (passwordData: ChangePasswordFormData): Promise<string | null> => {
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast({ description: "Password changed" });
      return null;
    } catch (error) {
      return errorMessage(error, "Could not change your password");
    }
  };

  const handleDeactivateAccount = async (password: string, reason: string): Promise<string | null> => {
    try {
      await deactivateAccount(password, reason);
      await logout();
      navigate("/login", { replace: true });
      return null;
    } catch (error) {
      return errorMessage(error, "Could not deactivate the account");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Please sign in to view profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Provider Profile</h1>
        <ProviderTopBar />
      </div>
      <div className="w-full">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
          {/* Profile Details - 3/4 width */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Cover Image */}
            <div className="relative h-60 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={
                  user.coverImageUrl
                    ? fileUrl(user.coverImageUrl)
                    : "/background.png"
                }
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>
            {/* Profile header card */}
            <Card className="p-4 md:p-4 lg:p-6 shadow-xl relative overflow-visible -mt-24 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <img
                    src={
                      user.profilePictureUrl
                        ? fileUrl(user.profilePictureUrl)
                        : "/default-avatar.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 md:mt-0 space-y-3 flex-1">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {user.businessName || "Business Name"}
                    </h2>
                    <p className="text-lg text-gray-600 mt-1">{user.email}</p>
                  </div>

                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location.formattedAddress}</span>
                    </div>
                  )}

                  {user.businessDescription && (
                    <p className="text-gray-600 mt-2">
                      {user.businessDescription}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Location Map - 1/4 width */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {user.location && (
              <Card className="p-4 shadow-lg mb-4 flex-1">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 h-full">
                  {/* <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      {user.location.formattedAddress}
                    </p>
                    {user.location.city && (
                      <p className="text-xs text-gray-500 mt-1">
                        {user.location.city}, {user.location.district},{" "}
                        {user.location.province}
                      </p>
                    )}
                  </div> */}
                  {GOOGLE_MAPS_API_KEY && (
                    <div className="h-48 lg:h-64 rounded-lg overflow-hidden border">
                      <iframe
                        title="Business location"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${user.location.latitude},${user.location.longitude}`}
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="p-4 shadow-lg">
              {/* <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg font-bold">
                  Account Actions
                </CardTitle>
              </CardHeader> */}
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setEditOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" /> Change Password
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => setDeactivateAccountOpen(true)}
                  >
                    <UserX className="w-4 h-4 mr-2" /> Deactivate Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSave={handleChangePassword}
      />

      {/* Deactivate Account Modal */}
      <DeactivateAccountModal
        isOpen={deactivateAccountOpen}
        onClose={() => setDeactivateAccountOpen(false)}
        onDeactivate={handleDeactivateAccount}
        user={user}
      />
    </div>
  );
};

export default Profile;
