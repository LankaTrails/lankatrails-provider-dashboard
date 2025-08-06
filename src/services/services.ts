import type { ImageFiles, TourGuideFormData, TransportFormData, AccommodationFormData, ActivityFormData, FoodBeverageFormData } from "@/types/serviceTypes";
import { addNewTourGuide, fetchAllTourGuides } from "@/services/guideService";
import { addNewTransport, fetchAllTransports } from "@/services/transportationService";
import { addNewAccommodation } from "@/services/accomodation";
import { addNewFoodBeverage } from "./FoodBeverage";
import { addNewActivity, fetchAllActivities} from "@/services/activityService";
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
  payload:  TransportFormData | ActivityFormData | AccommodationFormData | FoodBeverageFormData | TourGuideFormData,
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
  } else if(serviceType=="transportation"){
    return await fetchAllTransports(pageNumber,pageSize);
  } else {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }
};
