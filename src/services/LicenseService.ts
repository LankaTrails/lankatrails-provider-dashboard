import api from "@/api/axiosInstance";

export interface License {
  id?: string;
  name: string;
  description: string;
  expiryDate?: string;
  documentUrl?: string;
  status: "active" | "pending" | "expired";
}

export interface LicenseApplication {
  name: string;
  description: string;
  expiryDate?: string;
  documents?: File[];
  [key: string]: any;
}

export const fetchAllLicenses = async (serviceType: string): Promise<License[]> => {
  try {
    const response = await api.get(`/${serviceType}/licenses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching licenses:", error);
    throw error;
  }
};
export interface LicenseType {
  id?: string;
  name: string;
  description?: string;
}

export const fetchAllLicenseTypes = async (serviceType: string): Promise<LicenseType[]> => {
  try {
    const response = await api.get(`/${serviceType}/license-types`);
    return response.data;
  } catch (error) {
    console.error("Error fetching license types:", error);
    throw error;
  }
};

export const submitLicenseApplication = async (serviceType: string, application: LicenseApplication): Promise<void> => {
  try {
    const formData = new FormData();
    
    // Append all application data
    Object.entries(application).forEach(([key, value]) => {
      if (key === 'documents' && Array.isArray(value)) {
        value.forEach(file => formData.append('documents', file));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    await api.post(`/${serviceType}/license-applications`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error("Error submitting license application:", error);
    throw error;
  }
};
export const addLicense = async (serviceType: string, license: Omit<License, 'id'>): Promise<License> => {
  try {
    const response = await api.post(`/${serviceType}/licenses`, license);
    return response.data;
  } catch (error) {
    console.error("Error adding license:", error);
    throw error;
  }
};

export const updateLicense = async (serviceType: string, id: string, license: Partial<License>): Promise<License> => {
  try {
    const response = await api.put(`/${serviceType}/licenses/${id}`, license);
    return response.data;
  } catch (error) {
    console.error("Error updating license:", error);
    throw error;
  }
};

export const deleteLicense = async (serviceType: string, id: string): Promise<void> => {
  try {
    await api.delete(`/${serviceType}/licenses/${id}`);
  } catch (error) {
    console.error("Error deleting license:", error);
    throw error;
  }
};