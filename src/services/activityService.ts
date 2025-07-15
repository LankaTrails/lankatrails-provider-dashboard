import api from "@/api/axiosInstance";
import type { ImageFiles, ServiceFormData } from "@/types/serviceTypes";

//delete an activity service
export const deleteActivityService = async (id: number) => {
  const response = await api.delete(`/activity-service/${id}`);
  return response.data.data;
}
//Fetch all the provider policies
export const fetchAllPolicies = async ()=>{
  const response = await api.get('/provider/policies');
  return response.data.data; // Assuming the response contains an array of policies

};
//fetch all activity services
export const fetchAllActivities = async (pageNumber: number = 0, pageSize: number = 10) => {
  const response = await api.get(`/activity-service/getAll`,{
    params: {
      pageNumber,
      pageSize,
    },
  });
  console.log("fetch all",response.data.data);

  return response.data.data; // Assuming the response contains an array of activities
}
export const addNewActivity = async (payload: ServiceFormData, images: ImageFiles) => {
  try {
    const formData = new FormData();

    // JSON blob for 'service'
    const serviceBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    formData.append('service', serviceBlob);

    // 🔍 Append all images under 'images' key
    images.serviceImages.forEach((file: File) => {
      formData.append('images', file); // No need to index or rename
    });

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
export const findActivityById = async (id: any)=>{
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
export const findGuideById =async (id: any)=>{
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

// export const saveImgs = async (id : number , images: ImageFile[]) => {
//   try {
//     const formData = new FormData();
//     images.forEach((image) => {
//       formData.append('serviceImages', image.file);
//     });

//     console.log('Images Saving ',formData);
    
//     const response = await api.post(`/service/${id}/add-service-images`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     console.log('saveImgs response:', response);
//     return response.data.content;
//   } catch (error) {
//     console.error('Error saving images:', error);
//     throw new Error('Failed to save images');
//   }
// }