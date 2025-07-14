import api from "@/api/axiosInstance";
import type { RegistrationRequestBody, RegistrationFiles } from "@/types/registration";

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
