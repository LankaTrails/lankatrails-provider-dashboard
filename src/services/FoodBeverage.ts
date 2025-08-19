
import api from "@/api/axiosInstance";
import type { ImageFiles, PolicySection, ServiceFormData } from "@/types/serviceTypes";

//Add new activity policy
export async function createFoodPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/food-beverage", policyData);
    console.log("Food Beverage policy created successfully:", response.data);
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
//fetch all activity service policies by serviceType
export const fetchAllFoodPolicies = async (): Promise<any> => {
  const response = await api.get(`/provider/policy/food-beverage`);
  console.log("fetch all food-beverage policies", response.data.data);
  return response.data.data; // Assuming the response contains an array of activities
}

//fetch all food and beverage services
export const fetchAllFoodAndBeverages = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  try {
    const response = await api.get(`/provider/food-beverage/getAll`, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    console.log("fetch all food and beverages", response.data);
    
    // Handle different response structures
    if (response.data?.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log("fetchAllFoodAndBeverages error:", error);
    
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
        console.log('500 error indicates no food and beverage services found - returning empty array');
        return [];
      }
    }
    
    // Handle 404 (not found) as empty result
    if (error.response?.status === 404) {
      console.log('404 error - no food and beverage services found');
      return [];
    }
    
    // Re-throw actual errors
    throw error;
  }
}


//Add new food and beverage service
export const addNewFoodBeverage = async (
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

    console.log('Adding new food and beverage with formData:', formData);

    const response = await api.post('/provider/food-beverage/add', formData, {
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

//find a food-beverage service by the Id
export const findFoodBeverageById = async (id : any): Promise<any> =>{
  try {
    const response = await api.get(`/provider/food-beverage/${id}`);
    console.log('findFoodBeverageById response: ',response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetch food-beverage by ID: ',error);
    throw new Error('Failed to fetch food-beverage by ID');
  }
}

// update food and beverages
export const updateFoodBeverage = async (
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

    console.log('Updating food and beverage with formData:', formData);

    const response = await api.put(`/provider/food-beverage/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ updateFoodBeverage error:', error);
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
      message: 'Failed to update food and beverage',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// delete food and beverage service
export const deleteFoodBeverage = async (id: number): Promise<any> => {
  const response = await api.put(`/provider/food-beverage/remove/${id}`);
  console.log("Deleting food and beverage service with ID:", response);
  return response.data.data;
};
