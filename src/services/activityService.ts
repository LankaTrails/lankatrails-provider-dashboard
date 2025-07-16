import api from "@/api/axiosInstance";
import type { ImageFiles, ServiceFormData } from "@/types/serviceTypes";
import { addNewTourGuide } from "@/services/guideService";

//delete an activity service
export const deleteActivityService = async (id: number): Promise<any> => {
  const response = await api.put(`/activity-service/delete/${id}`);
  console.log("Deleting activity service with ID:", response);
  return response.data.data;
}

//Fetch all the provider policies
export const fetchAllPolicies = async (): Promise<any[]> => {
  const response = await api.get('/provider/policies');
  return response.data.data; // Assuming the response contains an array of policies
};

//fetch all activity services
export const fetchAllActivities = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  const response = await api.get(`/activity-service/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  console.log("fetch all", response.data.data);
  return response.data.data; // Assuming the response contains an array of activities
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
    const response = await api.get(`/activity-service/${id}`);
    // Log response for debugging
    console.log('findActivityById response:', response);
    return response.data.data; // Assuming the response contains an array of activities

  } catch (error) {
    console.error('Error fetching activity by ID:', error);
    throw new Error('Failed to fetch activity by ID');
  }
}

//find a tourist guide by the serviceId
export const findGuideById = async (id: any): Promise<any> => {
  try {
    const response = await api.get(`/tour-guide/${id}`);
    // Log response for debugging
    console.log('findGuideById response:', response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching guide by ID:', error);
    throw new Error('Failed to fetch guide by ID');
  }
}


// Fetch all tour guide services  
export const fetchAllTourGuides = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  const response = await api.get(`/tour-guide/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  console.log("fetch all tour guides", response.data.data);
  return response.data.data;
}

// Generic function to fetch services based on type
export const fetchAllServices = async (
  serviceType: string,
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  if (serviceType === 'tour-guides') {
    return await fetchAllTourGuides(pageNumber, pageSize);
  } else if (serviceType === 'activity') {
    return await fetchAllActivities(pageNumber, pageSize);
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Generic function to add any service type
export const addNewService = async (
  serviceType: string,
  payload: ServiceFormData,
  images: ImageFiles
): Promise<string> => {
  if (serviceType === 'tour-guides') {
    return await addNewTourGuide(payload, images);
  } else if (serviceType === 'activity') {
    return await addNewActivity(payload, images);

  }else if (serviceType === 'transportation') {
    return await addNew
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};
