import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputField from "@/components/forms/InputField";
import TextAreaField from "@/components/forms/TextAreaField";
import MapSelectorComponent from "@/components/forms/MapSelectorComponent";
import ProfileAndCoverUploader from "@/components/forms/ProfileAndCoverUploader";
import type { LocationData } from "@/types/serviceTypes";
import type { User } from "@/types/authTypes";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (formData: EditProfileFormData) => void;
}

export interface EditProfileFormData {
  businessName: string;
  email: string;
  businessDescription: string;
  profileImage: File | null;
  coverImage: File | null;
  location: string;
  selectedCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [form, setForm] = useState<EditProfileFormData>({
    businessName: user?.businessName || "",
    email: user?.email || "",
    businessDescription: user?.businessDescription || "",
    profileImage: null,
    coverImage: null,
    location: user?.location?.formattedAddress || "",
    selectedCoordinates: user?.location
      ? {
          latitude: user.location.latitude,
          longitude: user.location.longitude,
        }
      : undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image preview states
  const [profilePreview, setProfilePreview] = useState<string | null>(
    user?.profilePictureUrl
      ? `http://localhost:8081${user.profilePictureUrl}`
      : null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    user?.coverImageUrl ? `http://localhost:8081${user.coverImageUrl}` : null
  );

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationSelect = (locationData: LocationData) => {
    setForm((prev) => ({
      ...prev,
      location: locationData.formattedAddress,
      selectedCoordinates: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(form);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form to original values when closing
    setForm({
      businessName: user?.businessName || "",
      email: user?.email || "",
      businessDescription: user?.businessDescription || "",
      profileImage: null,
      coverImage: null,
      location: user?.location?.formattedAddress || "",
      selectedCoordinates: user?.location
        ? {
            latitude: user.location.latitude,
            longitude: user.location.longitude,
          }
        : undefined,
    });
    setProfilePreview(
      user?.profilePictureUrl
        ? `http://localhost:8081${user.profilePictureUrl}`
        : null
    );
    setCoverPreview(
      user?.coverImageUrl ? `http://localhost:8081${user.coverImageUrl}` : null
    );
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <InputField
              label="Business Name"
              value={form.businessName}
              onChange={(value) => handleChange("businessName", value)}
              required
              error={errors.businessName}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <TextAreaField
              label="Business Description"
              value={form.businessDescription}
              onChange={(value) => handleChange("businessDescription", value)}
              rows={4}
              placeholder="Describe your business..."
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile & Cover Photos
              </label>
              <ProfileAndCoverUploader
                profileImage={form.profileImage}
                setProfileImage={(file) =>
                  setForm((prev) => ({ ...prev, profileImage: file }))
                }
                profilePreview={profilePreview}
                setProfilePreview={setProfilePreview}
                coverImage={form.coverImage}
                setCoverImage={(file) =>
                  setForm((prev) => ({ ...prev, coverImage: file }))
                }
                coverPreview={coverPreview}
                setCoverPreview={setCoverPreview}
                userName={user?.businessName || "Business Name"}
                profileError={errors.profileImage}
                coverError={errors.coverImage}
              />
            </div>

            <MapSelectorComponent
              label="Business Location"
              location={form.location}
              onLocationChange={(value) => handleChange("location", value)}
              onLocationSelect={handleLocationSelect}
              selectedCoordinates={form.selectedCoordinates}
              error={errors.location}
            />
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
