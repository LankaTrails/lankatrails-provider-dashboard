import api from "@/api/axiosInstance";
import type { ImageFile } from "@/types/serviceTypes";


export const addNewActivity = async (payload :any) => {
  console.log("before post"+payload);
  try {
    const response = await api.post('/provider/activity-service/add', payload,{
      headers:{
        "Content-Type" : "application/json"
      }
    });
    // Log response for debugging
    console.log('addNewActivity response:', response);
    
    return response.data.message;
  } catch (error : any) {
    if(error.response && error.response.data ){
      const {code,message,details,userMessage} = error.response.data;
      throw{
        code,
        message,
        details,
        userMessage
      };
    }
    // Fallback generic error
    throw {
      message : "Failed to add new acivity",
      code : "UNKNOWN_ERROR"
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

export const saveImgs = async (id : number , images: ImageFile[]) => {
  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('serviceImages', image.file);
    });

    console.log('Images Saving ',formData);
    
    const response = await api.post(`/service/${id}/add-service-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('saveImgs response:', response);
    return response.data.content;
  } catch (error) {
    console.error('Error saving images:', error);
    throw new Error('Failed to save images');
  }
}