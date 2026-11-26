import api from "@/api/axiosInstance";
import type { ImageFiles, PolicySection, ServiceFormData, TransportFormData } from "@/types/serviceTypes";
import { toApiError } from "@/lib/apiError";

//Add new transport policy
export async function createTransportPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/transport", policyData);
    return response.data;
  } catch (error) {
    throw toApiError(error, 'Failed to add new transport policy');
  }
}
//fetch all transport service policies by serviceType
export const fetchAllTransportPolicies = async (): Promise<PolicySection[]> => {
  const response = await api.get(`/provider/policy/transport`);
  return response.data.data; // Assuming the response contains an array of activities
}


//fetch all transportation services
export const fetchAllTransports = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<TransportFormData[]> => {
  const response = await api.get(`/provider/transport/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data.data.content; // Assuming the response contains an array of activities
}


export const addNewTransport = async (
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


    const response = await api.post('/provider/transport/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to add new transport service');
  }
};

//find a transportation service by the Id
export const findTransportationById = async (id: number): Promise<TransportFormData> =>{
  try {
    const response = await api.get(`/provider/transport/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch transporation by ID');
  }
}

//update transport service
export const updateTransport = async (
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


    const response = await api.put(`/provider/transport/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to update transport service');
  }
};

// deactivate transportation service
export const deactivateTransportation = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/transport/deactivate/${id}`);
  return response.data.data;
}

// activate transportation service
export const activateTransportation = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/transport/activate/${id}`);
  return response.data.data;
}