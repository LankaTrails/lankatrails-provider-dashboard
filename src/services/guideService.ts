import api from "@/api/axiosInstance";
import type { ImageFiles, ServiceFormData, LocationData, PolicySection } from "@/types/serviceTypes";


//Add new policy for tour guide
export async function createGuidePolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/tour-guide", policyData);
    console.log("Guide policy created successfully:", response.data);
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
//fetch all guide service policies by serviceType
export const fetchAllAGuidePolicies = async (): Promise<any> => {
  const response = await api.get(`/provider/policy/tour-guide`);
  console.log("fetch all guide policies", response.data.data);
  return response.data.data; // Assuming the response contains an array of activities
}


// Add new tour guide service
export const addNewTourGuide = async (
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

    console.log('Adding new tour guide with formData:', formData);

    const response = await api.post('/provider/tour-guide/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ addNewTourGuide error:', error);
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
      message: 'Failed to add new tour guide',
      code: 'UNKNOWN_ERROR',
    };
  }
};

//fetch all tour guides
export const fetchAllTourGuides = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  try {
    const response = await api.get(`/provider/tour-guide/getAll`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    console.log("fetch all tour guides", response.data);
    
    // Handle different response structures
    if (response.data?.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log("fetchAllTourGuides error:", error);
    
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
        console.log('500 error indicates no tour guides found - returning empty array');
        return [];
      }
    }
    
    // Handle 404 (not found) as empty result
    if (error.response?.status === 404) {
      console.log('404 error - no tour guides found');
      return [];
    }
    
    // Re-throw actual errors
    throw error;
  }
}

//fetch all guiding areas
export const fetchAllGuidingAreas = async (
): Promise<LocationData[]> => {
  const response = await api.get(`/locations/districts`);
  console.log("fetch all guiding areas", response.data.data);
  return response.data.data; // Assuming the response contains an array of guiding areas
}

// Update tour guide service
export const updateTourGuide = async (
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

    console.log('Updating tour guide with formData:', formData);

    const response = await api.put(`/provider/tour-guide/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ updateTourGuide error:', error);
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
      message: 'Failed to update tour guide',
      code: 'UNKNOWN_ERROR',
    };
  }
};

//find a tourist guide by the serviceId
export const findTourGuideById = async (id: any): Promise<any> => {
  try {
    const response = await api.get(`/provider/tour-guide/${id}`);
    // Log response for debugging
    console.log('findTourGuideById response:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching guide by ID:', error);
    throw new Error('Failed to fetch guide by ID');
  }
}


// delete a tourist guide
export const deleteTourGuide = async (id: number): Promise<any> => {
  const response = await api.put(`/provider/tour-guide/remove/${id}`);
  console.log("Deleting tour guide with ID:", response);
  return response.data.data;
}