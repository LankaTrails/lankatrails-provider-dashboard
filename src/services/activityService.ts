import api from "@/api/axiosInstance";


export const addNewActivity = async (payload :any) => {
  console.log(payload);
  try {
    const response = await api.post('/provider/activity-service/add', payload);
    // Log response for debugging
    console.log('addNewActivity response:', response);
    return response;
  } catch (error) {
    console.error('addNewActivity error:', error);
    throw new Error('Failed to add new activity');
  }
};