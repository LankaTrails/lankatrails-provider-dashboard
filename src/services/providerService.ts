import api from "@/api/axiosInstance";

export const registerProvider = async (formData: FormData) => {
  console.log('🚀 registerProvider called');
  
  // Extract all form fields and convert to user object
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
  
  // Log user data (excluding sensitive info)
  const logData = { ...userData };
  if (logData.password) logData.password = '[REDACTED]';
  if (logData.confirmPassword) logData.confirmPassword = '[REDACTED]';
  
  console.log('📋 User data to be sent:', logData);
  console.log('📁 Logo file:', logoFile ? `${logoFile.name} (${logoFile.size} bytes)` : 'No file');
  
  // Create new FormData with proper structure
  const apiFormData = new FormData();
  
  // Add user data as JSON blob
  const userBlob = new Blob([JSON.stringify(userData)], {
    type: 'application/json'
  });
  apiFormData.append('user', userBlob);
  console.log('📦 User JSON blob created:', JSON.stringify(userData));
  
  // Add logo file if present
  if (logoFile) {
    apiFormData.append('profilePicture', logoFile);
    console.log('📁 Logo file added to FormData');
  }
  
  // Log final FormData structure
  console.log('🔍 Final FormData structure:');
  for (const [key, value] of apiFormData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else if (typeof value === "object" && (value as unknown) instanceof Blob) {
      console.log(`  ${key}: Blob(${(value as Blob).size} bytes, ${(value as Blob).type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }
  
  console.log('🌐 Making POST request to /auth/signup/provider');
  
  try {
    const startTime = performance.now();
    
    const response = await api.post("/auth/signup/provider", apiFormData, {
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
    
    console.log('📦 Response data:', {
      success: response.data.success,
      message: response.data.message,
      userId: response.data.data?.id || 'N/A'
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Registration API failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      requestHeaders: error.config?.headers
    });
    
    if (error.response?.data) {
      console.error('📦 Error response data:', error.response.data);
    }
    
    if (error.response?.status === 400) {
      console.error('🔍 Bad Request - Check if backend expects user as JSON blob and logo as file');
    }
    
    // Re-throw the error for the component to handle
    throw error;
  }
};
