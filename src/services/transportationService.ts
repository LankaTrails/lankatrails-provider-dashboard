import api from "@/api/axiosInstance";
import type { ImageFiles, PolicySection, ServiceFormData, TransportFormData } from "@/types/serviceTypes";

//Add new transport policy
export async function createTransportPolicy(policyData: PolicySection): Promise<PolicySection> {
  try {
    policyData.id = null;
    const response = await api.post("/provider/policy/transport", policyData);
    console.log("Transport policy created successfully:", response.data);
    return response.data;
  } catch (error :any) {
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
      message: 'Failed to add new transport policy',
      code: 'UNKNOWN_ERROR',
    };
  }
}
//fetch all transport service policies by serviceType
export const fetchAllTransportPolicies = async (): Promise<any> => {
  const response = await api.get(`/provider/policy/transport`);
  console.log("fetch all transport policies", response.data.data);
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
  console.log("fetch all", response.data.data.content);
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
        console.log("📸 File name:", item.file.name);
        formData.append(`images`, item.file);
      }
    });

    console.log('Adding new activity with formData:', formData);

    const response = await api.post('/provider/transport/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ addNewTransport error:', error);
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

//find a transportation service by the Id
export const findTransportationById = async (id : any): Promise<TransportFormData> =>{
  try {
    const response = await api.get(`/provider/transport/${id}`);
    console.log('findTransporationById response: ',response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetch transportation by ID: ',error);
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
        console.log("📸 File name:", item.file.name);
        formData.append(`images`, item.file);
      }
    });

    console.log('Updating transport with formData:', formData);

    const response = await api.put(`/provider/transport/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error('❌ updateTransport error:', error);
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
      message: 'Failed to update transport service',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// deactivate transportation service
export const deactivateTransportation = async (id: number): Promise<any> => {
  const response = await api.put(`/provider/transport/deactivate/${id}`);
  console.log("Deactivating transportation service with ID:", response);
  return response.data.data;
}

// activate transportation service
export const activateTransportation = async (id: number): Promise<any> => {
  const response = await api.put(`/provider/transport/activate/${id}`);
  console.log("Activating transportation service with ID:", response);
  return response.data.data;
}