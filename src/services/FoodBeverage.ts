
import api from "@/api/axiosInstance";
import type { FoodBeverageFormData, ImageFiles, PolicySection, ServiceFormData } from "@/types/serviceTypes";
import { toApiError } from "@/lib/apiError";

//Add new activity policy
export async function createFoodPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/food-beverage", policyData);
    return response.data;
  } catch (error) {
    throw toApiError(error, 'Failed to add new policy');
  }
}
//fetch all activity service policies by serviceType
export const fetchAllFoodPolicies = async (): Promise<PolicySection[]> => {
  const response = await api.get(`/provider/policy/food-beverage`);
  return response.data.data; // Assuming the response contains an array of activities
}

//fetch all food and beverage services
export const fetchAllFoodAndBeverages = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<FoodBeverageFormData[]> => {
  const response = await api.get(`/provider/food-beverage/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data.data.content; // Assuming the response contains an array of activities
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
        formData.append(`images`, item.file);
      }
    });


    const response = await api.post('/provider/food-beverage/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to add new transport service');
  }
};

//find a food-beverage service by the Id
export const findFoodBeverageById = async (id: number): Promise<FoodBeverageFormData> =>{
  try {
    const response = await api.get(`/provider/food-beverage/${id}`);
    return response.data.data;
  } catch (error) {
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
        formData.append(`images`, item.file);
      }
    });


    const response = await api.put(`/provider/food-beverage/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to update food and beverage');
  }
};

// deactivate food and beverage service
export const deactivateFoodBeverage = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/food-beverage/deactivate/${id}`);
  return response.data.data;
};

// activate food and beverage service
export const activateFoodBeverage = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/food-beverage/activate/${id}`);
  return response.data.data;
};
