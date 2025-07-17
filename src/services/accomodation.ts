import api from "@/api/axiosInstance";
import type { ImageFiles, ServiceFormData } from "@/types/serviceTypes";

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