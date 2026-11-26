import api from "@/api/axiosInstance";
import { toApiError } from "@/lib/apiError";

export type ServiceCategoryName = "ACCOMMODATION" | "TRANSPORT" | "FOOD_BEVERAGE" | "ACTIVITY" | "TOUR_GUIDE";
export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "PAYMENT_FAILED" | "NOT_AVAILABLE";

/** Mirrors the backend ProviderInsightsDTO (GET /provider/insights). */
export interface ProviderInsights {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  averageRating: number | null;
  reviewCount: number;
  monthly: { month: string; bookings: number; revenue: number }[];
  topServices: { serviceId: number; serviceName: string; category: ServiceCategoryName; bookings: number; revenue: number }[];
  recentBookings: {
    bookingId: number;
    serviceId: number;
    serviceName: string;
    category: ServiceCategoryName;
    touristName: string;
    startDateTime: string;
    status: BookingStatus;
    totalPrice: number;
  }[];
  recentReviews: {
    reviewId: number;
    serviceId: number;
    serviceName: string;
    touristName: string;
    rate: number;
    review: string;
    createdDate: string;
  }[];
}

/** URL slug used by the provider routes -> backend category. */
export const SLUG_TO_CATEGORY: Record<string, ServiceCategoryName> = {
  accommodation: "ACCOMMODATION",
  transportation: "TRANSPORT",
  "food-beverage": "FOOD_BEVERAGE",
  activity: "ACTIVITY",
  "tour-guides": "TOUR_GUIDE",
};

export const CATEGORY_TO_SLUG: Record<ServiceCategoryName, string> = {
  ACCOMMODATION: "accommodation",
  TRANSPORT: "transportation",
  FOOD_BEVERAGE: "food-beverage",
  ACTIVITY: "activity",
  TOUR_GUIDE: "tour-guides",
};

export async function getInsights(category?: ServiceCategoryName): Promise<ProviderInsights> {
  try {
    const response = await api.get("/provider/insights", { params: category ? { category } : undefined });
    return response.data.data as ProviderInsights;
  } catch (error) {
    throw toApiError(error, "Could not load your dashboard data");
  }
}
