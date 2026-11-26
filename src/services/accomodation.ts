import api from "@/api/axiosInstance";
import type { AccommodationFormData, ImageFiles, PolicySection, ServiceFormData } from "@/types/serviceTypes";
import { toApiError } from "@/lib/apiError";


//Add new accommodation policy
export async function createAccommodationPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/accommodation", policyData);
    return response.data;
  } catch (error) {
    throw toApiError(error, 'Failed to add new policy');
  }
}
//fetch all accommodation service policies by serviceType
export const fetchAllAccommodationPolicies = async (): Promise<PolicySection[]> => {
  const response = await api.get(`/provider/policy/accommodation`);
  return response.data.data; // Assuming the response contains an array of activities
}

//fetch all accommodations services
export const fetchAllAccommodations = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<AccommodationFormData[]> => {
  const response = await api.get(`/provider/accommodation/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data.data.content; // Assuming the response contains an array of activities
}


//Add new accommodation service
export const addNewAccommodation = async (
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


    const response = await api.post('/provider/accommodation/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to add new transport service');
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
    // JSON blob for 'service'
    const serviceBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
      });
    formData.append('service', serviceBlob)
    // Append all images under 'images' key with proper type checking
    images.serviceImages.forEach((item) => {
      if (item.file) {
        formData.append(`images`, item.file);
      }
    });


    const response = await api.put(`/provider/accommodation/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to update accommodation service');
  }
};

//find an accommodation service by the Id
export const findAccommodationById = async (id: number): Promise<AccommodationFormData> =>{
  try {
    const response = await api.get(`/provider/accommodation/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch accommodation by ID');
  }
}

// deactivate accommodation service
export const deactivateAccommodation = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/accommodation/deactivate/${id}`);
  return response.data.data;
}

// activate accommodation service
export const activateAccommodation = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/accommodation/activate/${id}`);
  return response.data.data;
}