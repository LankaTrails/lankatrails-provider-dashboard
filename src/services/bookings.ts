import api from "@/api/axiosInstance";
import type { BookingItem } from "@/types/bookingtypes";

// Get bookings for a service within a date range (expects LocalDateTime format: YYYY-MM-DDTHH:mm:ss)
export const getBookings = async (id: number, from: string, to: string): Promise<BookingItem[]> => {
    try {
        console.log('Fetching bookings for service ID:', id, 'from:', from, 'to:', to);
        const response = await api.get(`/provider/booking/${id}/${from}/${to}`);
        console.log('getBookings response: ', response);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching bookings: ', error);
        throw new Error('Failed to fetch bookings');
    }
}