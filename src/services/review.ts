import api from "@/api/axiosInstance";
import type { ReviewResponse } from "@/types/reviewTypes";

// Get reviews for a service within a date range (expects LocalDateTime format: YYYY-MM-DDTHH:mm:ss)
export const getReviews = async (id: number): Promise<ReviewResponse> => {
    try {
        console.log('Fetching reviews for service ID:', id);
        const response = await api.get(`/reviews/${id}`);
        console.log('getReviews response: ', response);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching reviews: ', error);
        throw new Error('Failed to fetch reviews');
    }
}