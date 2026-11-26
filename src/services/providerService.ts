import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";
import type { LicenseDTO, licenseResponse } from "@/types/authTypes";
import type { RegistrationRequestBody, RegistrationFiles, BusinessDetails } from "@/types/registration";

export const registerProvider = async (
  requestBody: RegistrationRequestBody,
  files: RegistrationFiles
) => {
  try {

    const requestData = new FormData();

    // Create a Blob with proper JSON content type
    const providerBlob = new Blob([JSON.stringify(requestBody)], {
      type: 'application/json'
    });

    requestData.append("provider", providerBlob);
    if (files.profilePhoto) {
      requestData.append("profilePicture", files.profilePhoto);
    }
    if (files.coverPhoto) {
      requestData.append("coverPhoto", files.coverPhoto);
    }
    if (files.businessRegistrationFile) {
      requestData.append("businessRegistrationFile", files.businessRegistrationFile);
    }
    if (files.contactPersonIdentityFile) {
      requestData.append("contactPersonIdentityFile", files.contactPersonIdentityFile);
    }
    // 3. Add license files in ORDERED array format
    files.licenseFiles.forEach((file) => {
      if (file) {
        requestData.append(`licenseFiles`, file); // Simple array-style name
      }
    });

    const response = await api.post("/auth/signup/provider", requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw toApiError(error, "Registration failed");
  }
};

export const getBusinessDetails = async (): Promise<BusinessDetails> => {
  try {

    const response = await api.get("/provider/provider-details");

    // Check if the actual data is nested under 'content'
    const businessDetails = response.data.data?.content || response.data.data;

    return businessDetails;
  } catch (error) {
    throw toApiError(error, "Could not load business details");
  }
};

export const updateBusinessDetails = async (
  businessDetails: Partial<BusinessDetails>
): Promise<BusinessDetails> => {
  try {

    const response = await api.put("/provider/business-details", businessDetails);

    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Could not update business details");
  }
};

export const getLicense = async (): Promise<licenseResponse[]> => {
  try {
    const response = await api.get("/provider/licenses");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Could not load your licences");
  }
};

export const renewLicense = async (
  licenses: LicenseDTO[],
  files: File[] // allows multiple file uploads
): Promise<licenseResponse[]> => {
  try {
    const formData = new FormData();

    // 🟢 Attach JSON array of licenses
    formData.append(
      "license",
      new Blob([JSON.stringify(licenses)], { type: "application/json" })
    );

    // 🟢 Attach files (optional list)
    files.forEach(file => {
      formData.append("licenseFiles", file);
    });

    // 🟢 Send multipart/form-data request
    const response = await api.post("/provider/licenses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Could not submit the licences");
  }
};

export const updateContactPerson = async (
  contactPersonData: {
    name: string;
    position: string;
    email: string;
    phoneNumber: string;
  },
  identityFile?: File | null
): Promise<BusinessDetails> => {
  try {

    const formData = new FormData();

    // Add contact person data as JSON blob
    const contactPersonBlob = new Blob([JSON.stringify(contactPersonData)], {
      type: 'application/json'
    });
    formData.append("contactPerson", contactPersonBlob);

    // Add identity file if provided
    if (identityFile) {
      formData.append("identityDocument", identityFile);
    }

    const response = await api.put("/provider/contact-person", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Could not update the contact person");
  }
};

export const requestApproval = async (
  licenses: LicenseDTO[],
  files: File[] // allows multiple file uploads
): Promise<licenseResponse[]> => {
  try {
    const formData = new FormData();

    // 🟢 Attach JSON array of licenses
    formData.append(
      "license",
      new Blob([JSON.stringify(licenses)], { type: "application/json" })
    );

    // 🟢 Attach files (optional list)
    files.forEach(file => {
      formData.append("licenseFiles", file);
    });

    // 🟢 Send multipart/form-data request
    const response = await api.put("/provider/approval", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Could not request approval");
  }
};
