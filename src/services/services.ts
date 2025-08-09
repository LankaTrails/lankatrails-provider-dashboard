import type { ImageFiles, TourGuideFormData, TransportFormData, AccommodationFormData, ActivityFormData, FoodBeverageFormData } from "@/types/serviceTypes";
import { addNewTourGuide, updateTourGuide, findTourGuideById, fetchAllTourGuides } from "@/services/guideService";
import { addNewTransport, findTransportationById, fetchAllTransports } from "@/services/transportationService";
import { addNewAccommodation, findAccommodationById, fetchAllAccommodations, updateAccommodation } from "@/services/accomodation";
import { addNewFoodBeverage, findFoodBeverageById, fetchAllFoodAndBeverages } from "./FoodBeverage";
import { addNewActivity, findActivityById, fetchAllActivities, deleteActivityService } from "@/services/activityService";
import api from "@/api/axiosInstance";

//remove policy


//Fetch all the provider policies
export const fetchAllPolicies = async (): Promise<any[]> => {
  const response = await api.get('/provider/policies');
  return response.data.data; // Assuming the response contains an array of policies
};

//Fetch all policies relating to the provider and for a particular service type
export const fetchPoliciesByServiceType = async (serviceType: string): Promise<any[]> => {
  let typeId: number;
  switch (serviceType) {
    case 'tour-guides':
        typeId=5;
        break;
    case 'activity':
        typeId=4;
        break;
    case 'transportation':
        typeId=2;
        break;
    case 'accommodation':
        typeId=1;
        break;
    case 'food-beverage':
        typeId=3;
        break;
    default:
      throw new Error(`Unsupported service type: ${serviceType}`);
  }
  const response = await api.get(`/provider/policies/${typeId}`);
  return response.data.data; // Assuming the response contains an array of policies for the specific service type
};


// Generic function to add any service type
export const addNewService = async (
  serviceType: string,
  payload: TransportFormData | ActivityFormData | AccommodationFormData | FoodBeverageFormData | TourGuideFormData,
  images: ImageFiles
): Promise<string> => {
  if (serviceType === 'tour-guides') {
    return await addNewTourGuide(payload, images);
  } else if (serviceType === 'activity') {
    return await addNewActivity(payload, images);
  } else if (serviceType === 'transportation') {
    return await addNewTransport(payload, images);
  } else if (serviceType === 'accommodation') {
    return await addNewAccommodation(payload, images);
  } else if (serviceType === 'food-beverage') {
    return await addNewFoodBeverage(payload, images);
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Generic function to update any service type
export const updateService = async (
  serviceType: string,
  id: number,
  payload: TransportFormData | ActivityFormData | AccommodationFormData | FoodBeverageFormData | TourGuideFormData,
  images: ImageFiles
): Promise<string> => {
  if (serviceType === 'tour-guides') {
    return await updateTourGuide(id, payload, images);
  } else if (serviceType === 'activity') {
    // TODO: Implement updateActivity function in activityService.ts
    throw new Error(`Update not yet implemented for service type: ${serviceType}`);
  } else if (serviceType === 'transportation') {
    // TODO: Implement updateTransportation function in transportationService.ts
    throw new Error(`Update not yet implemented for service type: ${serviceType}`);
  } else if (serviceType === 'accommodation') { 
    return await updateAccommodation(id, payload, images);
  } else if (serviceType === 'food-beverage') {
    // TODO: Implement updateFoodBeverage function in FoodBeverage.ts
    throw new Error(`Update not yet implemented for service type: ${serviceType}`);
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Generic function to find any service by ID
export const findServiceById = async (
  serviceType: string,
  id: number
): Promise<any> => {
  if (serviceType === 'tour-guides') {
    return await findTourGuideById(id);
  } else if (serviceType === 'activity') {
    return await findActivityById(id);
  } else if (serviceType === 'transportation') {
    return await findTransportationById(id);
  } else if (serviceType === 'accommodation') {
    return await findAccommodationById(id);
  } else if (serviceType === 'food-beverage') {
    return await findFoodBeverageById(id);
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Generic function to fetch all services by type
export const fetchAllServices = async (
  serviceType: string,
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<any> => {
  if (serviceType === 'tour-guides') {
    return await fetchAllTourGuides(pageNumber, pageSize);
  } else if (serviceType === 'activity') {
    return await fetchAllActivities(pageNumber, pageSize);
  } else if (serviceType === 'transportation') {
    return await fetchAllTransports(pageNumber, pageSize);
  } else if (serviceType === 'accommodation') {
    return await fetchAllAccommodations(pageNumber, pageSize);
  } else if (serviceType === 'food-beverage') {
    return await fetchAllFoodAndBeverages(pageNumber, pageSize);
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};

// Generic function to delete any service by ID
export const deleteService = async (
  serviceType: string,
  id: number
): Promise<any> => {
  if (serviceType === 'activity') {
    return await deleteActivityService(id);
  } else {
    // For now, only activity deletion is implemented
    // TODO: Implement delete functions for other service types
    console.warn(`Delete function not yet implemented for service type: ${serviceType}`);
    return Promise.resolve({ success: false, message: `Delete not yet implemented for ${serviceType}` });
  }
};

