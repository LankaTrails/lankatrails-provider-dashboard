import api from "@/api/axiosInstance";
import type { ImageFiles, PolicySection, ServiceFormData } from "@/types/serviceTypes";


//Add new activity policy
export async function createActivityPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/activity", policyData);
    console.log("Activity policy created successfully:", response.data);
    return response.data;
  } catch (error :any) {
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }

    throw {
      message: 'Failed to add new activity',
      code: 'UNKNOWN_ERROR',
    };
  }
}
//fetch all activity service policies by serviceType
export const fetchAllActivityPolicies = async (): Promise<any> => {
  const response = await api.get(`/provider/policy/activity`);
  console.log("fetch all activity policies", response.data.data);
  return response.data.data; // Assuming the response contains an array of activities
}


//delete an activity service
export const deleteActivityService = async (id: number): Promise<any> => {
  const response = await api.put(`/provider/activity-service/remove/${id}`);
  console.log("Deleting activity service with ID:", response);
  return response.data.data;
}

//fetch all activity services
export const fetchAllActivities = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  try {
    const response = await api.get(`/provider/activity-service/getAll`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    console.log("fetch all activities", response.data);
    
    // Handle different response structures
    if (response.data?.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log("fetchAllActivities error:", error);
    
    // Handle 500 errors that might indicate "no data found"
    if (error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || '';
      const noDataPatterns = [
        'no data found',
        'no services found',
        'no records found',
        'empty result',
        'no content available'
      ];
      
      if (noDataPatterns.some(pattern => errorMessage.toLowerCase().includes(pattern)) || !errorMessage) {
        console.log('500 error indicates no activities found - returning empty array');
        return [];
      }
    }
    
    // Handle 404 (not found) as empty result
    if (error.response?.status === 404) {
      console.log('404 error - no activities found');
      return [];
    }
    
    // Re-throw actual errors
    throw error;
  }
}
//Add a new activity service
export const addNewActivity = async (
  payload: ServiceFormData,
  images: ImageFiles
): Promise<string> => {
  try {
    console.log("Adding new activity with payload:", payload);
    const formData = new FormData();

    // JSON blob for 'service'
    const serviceBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    console.log("Service Blob:", serviceBlob);
    formData.append('service', serviceBlob);

    // Append all images under 'images' key with proper type checking
    images.serviceImages.forEach((item) => {
      if (item.file) {
        console.log("📸 File name:", item.file.name);
        formData.append(`images`, item.file);
      }
    });

    console.log('Adding new activity with formData:', formData);

    const response = await api.post('/provider/activity-service/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ addNewActivity error:', error);
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }

    throw {
      message: 'Failed to add new activity',
      code: 'UNKNOWN_ERROR',
    };
  }
};

//find an activity service by the serviceId
export const findActivityById = async (id: any): Promise<any> => {
  try {
    const response = await api.get(`/provider/activity-service/${id}`);
    // Log response for debugging
    console.log('findActivityById response:', response.data.data);
    return response.data.data; // Assuming the response contains an array of activities

  } catch (error) {
    console.error('Error fetching activity by ID:', error);
    throw new Error('Failed to fetch activity by ID');
  }
};


//update activity service
export const updateActivity = async (
  id: number,
  payload: ServiceFormData,
  images: ImageFiles
): Promise<string> => {
  try {
    const formData = new FormData();

    // JSON blob for 'service'
    const serviceBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    formData.append('service', serviceBlob);

    // Append all images under 'images' key with proper type checking
    images.serviceImages.forEach((item) => {
      if (item.file) {
        console.log("📸 File name:", item.file.name);
        formData.append(`images`, item.file);
      }
    });

    console.log('Updating activity with formData:', formData);

    const response = await api.put(`/provider/activity-service/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ updateActivity error:', error);
    if (error.response && error.response.data) {
      const { code, message, details, userMessage } = error.response.data;
      throw {
        code,
        message,
        details,
        userMessage,
      };
    }

    throw {
      message: 'Failed to update activity service',
      code: 'UNKNOWN_ERROR',
    };
  }
};
