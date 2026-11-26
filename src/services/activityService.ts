import api from "@/api/axiosInstance";
import type { ActivityFormData, ImageFiles, PolicySection, ServiceFormData } from "@/types/serviceTypes";
import { toApiError } from "@/lib/apiError";


//Add new activity policy
export async function createActivityPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/activity", policyData);
    return response.data;
  } catch (error) {
    throw toApiError(error, 'Failed to add new activity');
  }
}
//fetch all activity service policies by serviceType
export const fetchAllActivityPolicies = async (): Promise<PolicySection[]> => {
  const response = await api.get(`/provider/policy/activity`);
  return response.data.data; // Assuming the response contains an array of activities
}


//deactivate an activity service
export const deactivateActivityService = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/activity-service/deactivate/${id}`);
  return response.data.data;
}

// activate an activity service
export const activateActivityService = async (id: number): Promise<unknown> => {
  const response = await api.put(`/provider/activity-service/activate/${id}`);
  return response.data.data;
}

//fetch all activity services
export const fetchAllActivities = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ActivityFormData[]> => {
  const response = await api.get(`/activity-service/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data.data.content; // Assuming the response contains an array of activities
}
//Add a new activity service
export const addNewActivity = async (
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


    const response = await api.post('/provider/activity-service/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to add new activity');
  }
};

//find an activity service by the serviceId
export const findActivityById = async (id: number): Promise<ActivityFormData> => {
  try {
    const response = await api.get(`/provider/activity-service/${id}`);
    // Log response for debugging
    return response.data.data; // Assuming the response contains an array of activities

  } catch (error) {
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
        formData.append(`images`, item.file);
      }
    });


    const response = await api.put(`/provider/activity-service/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error) {
    throw toApiError(error, 'Failed to update activity service');
  }
};
