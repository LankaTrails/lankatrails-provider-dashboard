import type { ImageFiles, TourGuideFormData, TransportFormData, AccommodationFormData, ActivityFormData, FoodBeverageFormData } from "@/types/serviceTypes";
import { addNewTourGuide } from "@/services/guideService";
import { addNewTransport } from "@/services/transportationService";
import { addNewAccommodation } from "@/services/accomodation";
import { addNewFoodBeverage } from "./FoodBeverage";
import { addNewActivity } from "@/services/activityService";

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