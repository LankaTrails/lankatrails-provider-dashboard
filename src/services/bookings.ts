import api from "@/api/axiosInstance";
import type { BookingItem } from "@/types/bookingtypes";

// Get bookings for a service within a date range (expects LocalDateTime format: YYYY-MM-DDTHH:mm:ss)
export const getBookings = async (id: number, from: string, to: string): Promise<BookingItem[]> => {
    try {
        const response = await api.get(`/provider/booking/${id}/${from}/${to}`);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch bookings');
    }
}