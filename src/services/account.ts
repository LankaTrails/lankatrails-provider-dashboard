import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";

export interface ProfileUpdate {
  businessName: string;
  businessDescription: string;
  location?: {
    formattedAddress: string;
    city?: string;
    district?: string;
    province?: string;
    country?: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
  };
}

/** PUT /provider/profile: JSON "profile" part plus optional profile and cover images. */
export async function updateProfile(profile: ProfileUpdate, profilePicture?: File | null, coverImage?: File | null): Promise<void> {
  const form = new FormData();
  form.append("profile", new Blob([JSON.stringify(profile)], { type: "application/json" }));
  if (profilePicture) form.append("profilePicture", profilePicture);
  if (coverImage) form.append("coverImage", coverImage);
  try {
    await api.put("/provider/profile", form);
  } catch (error) {
    throw toApiError(error, "Could not save your profile");
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  try {
    await api.put("/auth/change-password", { oldPassword, newPassword });
  } catch (error) {
    throw toApiError(error, "Could not change your password");
  }
}

export async function deactivateAccount(password: string, reason: string): Promise<void> {
  try {
    await api.post("/user/deactivate", { password, reason });
  } catch (error) {
    throw toApiError(error, "Could not deactivate the account");
  }
}
