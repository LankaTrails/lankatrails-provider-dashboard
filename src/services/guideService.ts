import api from "@/api/axiosInstance";
import type { ImageFiles, ServiceFormData, LocationData, PolicySection, TourGuideFormData } from "@/types/serviceTypes";
import { toApiError } from "@/lib/apiError";


//Add new policy for tour guide
export async function createGuidePolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/tour-guide", policyData);
    return response.data;
  } catch (error) {
    throw toApiError(error, 'Failed to add new activity');
  }
}
//fetch all guide service policies by serviceType
export const fetchAllAGuidePolicies = async (): Promise<PolicySection[]> => {
  const response = await api.get(`/provider/policy/tour-guide`);
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
        formData.append(`images`, item.file);
      }
    });


    const response = await api.post('/provider/tour-guide/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to add new tour guide');
  }
};

//fetch all tour guides
export const fetchAllTourGuides = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<TourGuideFormData[]> => {
  const response = await api.get(`/provider/tour-guide/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data.data.content; // Assuming the response contains an array of tour guides
}

//fetch all guiding areas
export const fetchAllGuidingAreas = async (
): Promise<LocationData[]> => {
  const response = await api.get(`/locations/districts`);
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
        formData.append(`images`, item.file);
      }
    });


    const response = await api.put(`/provider/tour-guide/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to update tour guide');
  }
};

//find a tourist guide by the serviceId
export const findTourGuideById = async (id: number): Promise<TourGuideFormData> => {
  try {
    const response = await api.get(`/provider/tour-guide/${id}`);
    // Log response for debugging
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch guide by ID');
  }
}


// deactivate a tourist guide
export const deactivateTourGuide = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/tour-guide/deactivate/${id}`);
  return response.data.data;
}

// activate a tourist guide
export const activateTourGuide = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/tour-guide/activate/${id}`);
  return response.data.data;
}