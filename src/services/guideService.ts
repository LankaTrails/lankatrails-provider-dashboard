import api from "@/api/axiosInstance";
import type { ImageFiles, ServiceFormData, LocationData, PolicySection } from "@/types/serviceTypes";


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
  const response = await api.get(`/provider/tour-guide/getAll`, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  console.log("fetch all tour guides", response.data.data);
  return response.data.data; // Assuming the response contains an array of tour guides
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