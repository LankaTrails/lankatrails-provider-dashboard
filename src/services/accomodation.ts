import api from "@/api/axiosInstance";
import type { ImageFiles, PolicySection, ServiceFormData } from "@/types/serviceTypes";


//Add new accommodation policy
export async function createAccommodationPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/accommodation", policyData);
    console.log("Accommodation policy created successfully:", response.data);
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
      message: 'Failed to add new policy',
      code: 'UNKNOWN_ERROR',
    };
  }
}
//fetch all accommodation service policies by serviceType
export const fetchAllAccommodationPolicies = async (): Promise<any> => {
  const response = await api.get(`/provider/policy/accommodation`);
  console.log("fetch all accommodation policies", response.data.data);
  return response.data.data; // Assuming the response contains an array of activities
}

//fetch all accommodations services
export const fetchAllAccommodations = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  try {
    const response = await api.get(`/provider/accommodation/getAll`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    console.log("fetch all accommodations", response.data);
    
    // Handle different response structures
    if (response.data?.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log("fetchAllAccommodations error:", error);
    
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
        console.log('500 error indicates no accommodations found - returning empty array');
        return [];
      }
    }
    
    // Handle 404 (not found) as empty result
    if (error.response?.status === 404) {
      console.log('404 error - no accommodations found');
      return [];
    }
    
    // Re-throw actual errors
    throw error;
  }
}

//Add new accommodation service
export const addNewAccommodation = async (
  payload: ServiceFormData,
  images: ImageFiles
): Promise<string> => {
  try {
    const formData = new FormData();
    console.log("📄 Payload:", payload);

    // JSON blob for 'service'
    const serviceBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    console.log("📄 Service Blob:", serviceBlob);
    formData.append('service', serviceBlob);

    // Append all images under 'images' key with proper type checking
    images.serviceImages.forEach((item) => {
      if (item.file) {
        console.log("📸 File name:", item.file.name);
        formData.append(`images`, item.file);
      }
    });

    console.log('Adding new accommodation with formData:', formData);

    const response = await api.post('/provider/accommodation/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ addNewAccommodation error:', error);
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
      message: 'Failed to add new transport service',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// Update accommodation service
export const updateAccommodation = async (
  id: number,
  payload: ServiceFormData,
  images: ImageFiles
): Promise<string> => {
  try {
    const formData = new FormData();
    console.log("📄 Update Payload:", payload)
    // JSON blob for 'service'
    const serviceBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
      });
    console.log("📄 Update Service Blob:", serviceBlob)
    formData.append('service', serviceBlob)
    // Append all images under 'images' key with proper type checking
    images.serviceImages.forEach((item) => {
      if (item.file) {
        console.log("📸 Update File name:", item.file.name);
        formData.append(`images`, item.file);
      }
    });

    console.log('Updating accommodation with formData:', formData);

    const response = await api.put(`/provider/accommodation/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ updateAccommodation error:', error);
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
      message: 'Failed to update accommodation service',
      code: 'UNKNOWN_ERROR',
    };
  }
};

//find an accommodation service by the Id
export const findAccommodationById = async (id : any): Promise<any> =>{
  try {
    const response = await api.get(`/provider/accommodation/${id}`);
    console.log('findAccommodationById response: ',response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetch accommodation by ID: ',error);
    throw new Error('Failed to fetch accommodation by ID');
  }
}

// delete accommodation service
export const deleteAccommodation = async (id: number): Promise<any> => {
  const response = await api.put(`/provider/accommodation/remove/${id}`);
  console.log("Deleting accommodation service with ID:", response);
  return response.data.data;
}