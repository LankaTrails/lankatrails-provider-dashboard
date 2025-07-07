import api from "@/api/axiosInstance";

export const registerProvider = async (formData: FormData) => {
  console.log('🚀 registerProvider called');

  // Extract form fields
  const userData: Record<string, any> = {};
  let logoFile: File | null = null;

  for (const [key, value] of formData.entries()) {
    if (key === 'logo' && value instanceof File) {
      logoFile = value;
      console.log('📁 Logo file found:', {
        name: value.name,
        size: value.size,
        type: value.type
      });
    } else {
      userData[key] = value;
    }
  }

  // Mask sensitive info for logging
  const logData = { ...userData };
  if (logData.password) logData.password = '[REDACTED]';
  if (logData.confirmPassword) logData.confirmPassword = '[REDACTED]';

  console.log('📋 User data to be sent:', logData);
  console.log('📁 Logo file:', logoFile ? `${logoFile.name} (${logoFile.size} bytes)` : 'No file');

  try {
    console.log('🌐 Making POST request to /auth/signup/provider');

    const startTime = performance.now();

    // Send user data as JSON
    const response = await api.post("/auth/signup/provider", userData, {
      headers: {
        "Content-Type": "application/json",
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

    // Upload profile picture if available
    if (logoFile && userId) {
      console.log('🌐 Uploading profile picture...');
      const picFormData = new FormData();
      picFormData.append("profilePicture", logoFile);

      const picResponse = await api.post(`/user/${userId}/add-profile-picture`, picFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('✅ Profile picture uploaded:', {
        status: picResponse.status,
        statusText: picResponse.statusText,
      });
    }

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
