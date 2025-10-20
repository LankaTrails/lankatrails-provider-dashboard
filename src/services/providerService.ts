import api from "@/api/axiosInstance";
import type { LicenseDTO, licenseResponse } from "@/types/authTypes";
import type { RegistrationRequestBody, RegistrationFiles, BusinessDetails } from "@/types/registration";

export const registerProvider = async (
  requestBody: RegistrationRequestBody,
  files: RegistrationFiles
) => {
  try {
    console.log('🌐 Making POST request to /auth/signup/provider');

    const startTime = performance.now();
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

    console.log('📦 Request data prepared:', requestBody);
    console.log('📂 Files to upload:', {
      profilePhoto: files.profilePhoto ? files.profilePhoto.name : 'N/A',
      coverPhoto: files.coverPhoto ? files.coverPhoto.name : 'N/A',
      businessRegistrationFile: files.businessRegistrationFile ? files.businessRegistrationFile.name : 'N/A',
      contactPersonIdentityFile: files.contactPersonIdentityFile ? files.contactPersonIdentityFile.name : 'N/A',
      licenseFiles: files.licenseFiles.map(file => file.name)
    });

    const response = await api.post("/auth/signup/provider", requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    console.log('✅ Registration API success:', {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : []
    });

    const userId = response.data.data?.userId;
    console.log('📦 Response data:', {
      success: response.data.success,
      message: response.data.message,
      userId: userId || 'N/A'
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Registration flow failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.data) {
      console.error('📦 Error response data:', error.response.data);
    }

    throw error;
  }
};

export const getBusinessDetails = async (): Promise<BusinessDetails> => {
  try {
    console.log('🌐 Making GET request to /provider/business-details');

    const response = await api.get("/provider/provider-details");

    console.log('✅ Business details API success:', {
      status: response.status,
      statusText: response.statusText,
      fullResponseData: response.data,
      hasData: !!response.data.data,
      hasContent: !!response.data.data?.content,
      data: response.data.data,
      content: response.data.data?.content,
      hasContactPerson: !!response.data.data?.contactPerson,
      hasContactPersonInContent: !!response.data.data?.content?.contactPerson,
      contactPersonKeys: response.data.data?.contactPerson ? Object.keys(response.data.data.contactPerson) : [],
      contactPersonKeysInContent: response.data.data?.content?.contactPerson ? Object.keys(response.data.data.content.contactPerson) : []
    });

    // Check if the actual data is nested under 'content'
    const businessDetails = response.data.data?.content || response.data.data;

    console.log('🔍 Final business details being returned:', {
      businessDetails,
      hasContactPerson: !!businessDetails?.contactPerson,
      contactPersonData: businessDetails?.contactPerson
    });

    return businessDetails;
  } catch (error: any) {
    console.error('❌ Business details fetch failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.data) {
      console.error('📦 Error response data:', error.response.data);
    }

    throw error;
  }
};

export const updateBusinessDetails = async (
  businessDetails: Partial<BusinessDetails>
): Promise<BusinessDetails> => {
  try {
    console.log('🌐 Making PUT request to /provider/business-details');

    const response = await api.put("/provider/business-details", businessDetails);

    console.log('✅ Business details update API success:', {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('❌ Business details update failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.data) {
      console.error('📦 Error response data:', error.response.data);
    }

    throw error;
  }
};

export const getLicense = async (): Promise<licenseResponse[]> => {
  try {
    const response = await api.get("/provider/licenses");
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Fetching licenses failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
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
  } catch (error: any) {
    console.error("❌ License renewal failed:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
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
    console.log('🌐 Making PUT request to /provider/contact-person');

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

    console.log('📦 Contact person data:', contactPersonData);
    console.log('📂 Identity file:', identityFile ? identityFile.name : 'None');

    const response = await api.put("/provider/contact-person", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log('✅ Contact person update API success:', {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
    });

    return response.data.data;
  } catch (error: any) {
    console.error('❌ Contact person update failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.data) {
      console.error('📦 Error response data:', error.response.data);
    }

    throw error;
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
  } catch (error: any) {
    console.error("❌ License renewal failed:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
  }
};


// const uploadFiles = async (userId: string, files: RegistrationFiles) => {
//   try {
//     // Upload profile photo
//     if (files.profilePhoto) {
//       console.log('🌐 Uploading profile photo...');
//       const profileFormData = new FormData();
//       profileFormData.append("profilePicture", files.profilePhoto);

//       await api.post(`/user/${userId}/add-profile-picture`, profileFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       console.log('✅ Profile photo uploaded');
//     }

//     // Upload cover photo
//     if (files.coverPhoto) {
//       console.log('🌐 Uploading cover photo...');
//       const coverFormData = new FormData();
//       coverFormData.append("coverPhoto", files.coverPhoto);

//       await api.post(`/provider/${userId}/add-cover-photo`, coverFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       console.log('✅ Cover photo uploaded');
//     }

//     // Upload business registration files
//     if (files.businessRegistrationFile) {
//       console.log('🌐 Uploading business registration files...');
//       const brFormData = new FormData();
//       brFormData.append("businessRegistrationFile", files.businessRegistrationFile);

//       await api.post(`/provider/${userId}/add-business-registration`, brFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       console.log('✅ Business registration files uploaded');
//     }

//     // Upload license files
//     // if (files.licenseFiles.length > 0) {
//     //   console.log('🌐 Uploading license files...');
//     //   const licenseFormData = new FormData();
//     //   files.licenseFiles.forEach((file, index) => {
//     //     licenseFormData.append(`licenseFile_${index}`, file);
//     //   });

//     //   await api.post(`/user/${userId}/add-license-files`, licenseFormData, {
//     //     headers: {
//     //       "Content-Type": "multipart/form-data",
//     //     },
//     //   });
//     //   console.log('✅ License files uploaded');
//     // }

//     // Upload contact person identity files
//     // if (files.contactPersonIdentityFile) {
//     //   console.log('🌐 Uploading contact person identity files...');
//     //   const identityFormData = new FormData();
//     //   identityFormData.append("contactPersonIdentityFile", files.contactPersonIdentityFile);

//     //   await api.post(`/user/${userId}/add-contact-person-identity-files`, identityFormData, {
//     //     headers: {
//     //       "Content-Type": "multipart/form-data",
//     //     },
//     //   });
//     //   console.log('✅ Contact person identity files uploaded');
//     // }

//   } catch (error: any) {
//     console.error('❌ File upload failed:', {
//       message: error.message,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//     });
//     throw error;
//   }
// };
