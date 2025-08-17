import api from "@/api/axiosInstance";
import type { UnifiedBooking, BookingResponse, BookingFilters, ProviderType } from "@/types/bookingTypes";

// Mock data for demonstration - replace with actual API calls
const mockBookings: UnifiedBooking[] = [
  {
    id: 1,
    customer: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+94771234567",
    service: "Sigiriya Rock Climb Guide",
    serviceId: 101,
    serviceType: "tour-guides",
    providerType: "tour-guide",
    dateFrom: "2024-01-15",
    dateTo: "2024-01-15",
    status: "confirmed",
    amount: "8500",
    currency: "LKR",
    createdAt: "2024-01-10T10:00:00Z",
    guideType: "Site Guide",
    languages: ["English", "Sinhala"],
    groupSize: 4,
    destinations: ["Sigiriya Rock Fortress"],
    transportIncluded: false,
    slots: [
      { date: "2024-01-15", start: "09:00", end: "15:00", bookings: 1, details: ["Full day tour"] }
    ]
  },
  {
    id: 2,
    customer: "Emma Wilson",
    customerEmail: "emma@example.com",
    service: "Airport Transfer",
    serviceId: 202,
    serviceType: "transportation",
    providerType: "transportation",
    dateFrom: "2024-01-18",
    dateTo: "2024-01-18",
    status: "pending",
    amount: "15000",
    currency: "LKR",
    createdAt: "2024-01-16T14:30:00Z",
    vehicleType: "Car",
    pickupLocation: "Bandaranaike International Airport",
    dropoffLocation: "Colombo Fort Hotel",
    distance: 35,
    driverIncluded: true,
    passengers: 2,
    luggage: true,
    slots: [
      { date: "2024-01-18", start: "08:00", end: "09:30", duration: "1.5h", bookings: 1, details: ["Airport pickup"] }
    ]
  },
  {
    id: 3,
    customer: "David Chen",
    customerEmail: "david@example.com",
    service: "Wildlife Safari - Yala",
    serviceId: 303,
    serviceType: "activity",
    providerType: "activity",
    dateFrom: "2024-01-20",
    dateTo: "2024-01-20",
    status: "completed",
    amount: "12000",
    currency: "LKR",
    createdAt: "2024-01-15T09:15:00Z",
    participants: 3,
    activityType: "Wildlife Safari",
    duration: "6 hours",
    safetyBriefing: true,
    equipmentProvided: true,
    slots: [
      { date: "2024-01-20", start: "06:00", end: "12:00", bookings: 1, details: ["Morning safari"] }
    ]
  },
  {
    id: 4,
    customer: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    service: "Spice Garden Restaurant",
    serviceId: 404,
    serviceType: "food-beverage",
    providerType: "food-beverage",
    dateFrom: "2024-01-22",
    dateTo: "2024-01-22",
    status: "confirmed",
    amount: "4500",
    currency: "LKR",
    createdAt: "2024-01-20T16:45:00Z",
    restaurantType: "Traditional Sri Lankan",
    partySize: 6,
    tablePreference: "Garden view",
    dietaryRestrictions: ["Vegetarian options"],
    specialOccasion: "Anniversary",
    mealType: "Dinner",
    slots: [
      { date: "2024-01-22", start: "19:00", end: "21:00", bookings: 1, details: ["Anniversary dinner"] }
    ]
  },
  {
    id: 5,
    customer: "Michael Brown",
    customerEmail: "michael@example.com",
    service: "Beach Villa Hikkaduwa",
    serviceId: 505,
    serviceType: "accommodation",
    providerType: "accommodation",
    dateFrom: "2024-01-25",
    dateTo: "2024-01-28",
    status: "confirmed",
    amount: "45000",
    currency: "LKR",
    createdAt: "2024-01-18T11:20:00Z",
    accommodationType: "Villa",
    roomType: "Deluxe Ocean View",
    guests: 4,
    rooms: 2,
    checkIn: "2024-01-25",
    checkOut: "2024-01-28",
    nights: 3,
    amenities: ["Pool", "Beach Access", "WiFi", "Breakfast"],
    breakfastIncluded: true,
    slots: [
      { date: "2024-01-25", start: "14:00", end: "12:00", bookings: 1, details: ["3 nights stay"] }
    ]
  }
];

export const fetchAllBookings = async (
  filters?: BookingFilters,
  page: number = 0,
  pageSize: number = 10
): Promise<BookingResponse> => {
  try {
    // In a real implementation, this would be an API call
    // const response = await api.get('/provider/bookings', { params: { ...filters, page, pageSize } });
    
    // Mock implementation with filtering
    let filteredBookings = [...mockBookings];
    
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredBookings = filteredBookings.filter(booking => 
          filters.status!.includes(booking.status)
        );
      }
      
      if (filters.providerType && filters.providerType.length > 0) {
        filteredBookings = filteredBookings.filter(booking => 
          filters.providerType!.includes(booking.providerType)
        );
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredBookings = filteredBookings.filter(booking => 
          booking.customer.toLowerCase().includes(searchLower) ||
          booking.service.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.dateFrom) {
        filteredBookings = filteredBookings.filter(booking => 
          booking.dateFrom >= filters.dateFrom!
        );
      }
      
      if (filters.dateTo) {
        filteredBookings = filteredBookings.filter(booking => 
          booking.dateTo <= filters.dateTo!
        );
      }
    }
    
    // Calculate stats
    const stats = {
      total: filteredBookings.length,
      pending: filteredBookings.filter(b => b.status === 'pending').length,
      confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
      completed: filteredBookings.filter(b => b.status === 'completed').length,
      cancelled: filteredBookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: filteredBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.amount), 0),
      averageBookingValue: filteredBookings.length > 0 
        ? filteredBookings.reduce((sum, b) => sum + parseFloat(b.amount), 0) / filteredBookings.length
        : 0
    };
    
    // Pagination
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    return {
      bookings: paginatedBookings,
      totalCount: filteredBookings.length,
      currentPage: page,
      totalPages: Math.ceil(filteredBookings.length / pageSize),
      stats
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const fetchBookingsByProviderType = async (
  providerType: ProviderType,
  page: number = 0,
  pageSize: number = 10
): Promise<BookingResponse> => {
  return fetchAllBookings({ providerType: [providerType] }, page, pageSize);
};

export const updateBookingStatus = async (
  bookingId: number,
  status: 'confirmed' | 'rejected' | 'cancelled'
): Promise<void> => {
  try {
    // In a real implementation:
    // await api.patch(`/provider/bookings/${bookingId}/status`, { status });
    
    // Mock implementation
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = status;
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const getBookingById = async (id: number): Promise<UnifiedBooking | null> => {
  try {
    // In a real implementation:
    // const response = await api.get(`/provider/bookings/${id}`);
    // return response.data;
    
    // Mock implementation
    return mockBookings.find(booking => booking.id === id) || null;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    throw error;
  }
};

export const exportBookings = async (filters?: BookingFilters): Promise<Blob> => {
  try {
    // In a real implementation:
    // const response = await api.get('/provider/bookings/export', { 
    //   params: filters,
    //   responseType: 'blob'
    // });
    // return response.data;
    
    // Mock implementation - create CSV
    const { bookings } = await fetchAllBookings(filters, 0, 1000);
    const csvContent = [
      'ID,Customer,Service,Provider Type,Date From,Date To,Status,Amount,Created At',
      ...bookings.map(booking => 
        `${booking.id},"${booking.customer}","${booking.service}",${booking.providerType},${booking.dateFrom},${booking.dateTo},${booking.status},${booking.amount},${booking.createdAt}`
      )
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  } catch (error) {
    console.error('Error exporting bookings:', error);
    throw error;
  }
};
