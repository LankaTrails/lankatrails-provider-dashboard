import type { BookingType, PriceType, ServiceType } from "@/types/serviceTypes";

export interface ServiceTypeRecommendation {
    bookingTypes: {
        value: BookingType;
        label: string;
        description: string;
        recommended?: boolean;
    }[];
    priceTypes: {
        value: PriceType;
        label: string;
        description: string;
        recommended?: boolean;
    }[];
    defaultCapacity?: {
        totalUnits: number;
        unitAdultCapacity: number;
        unitChildCapacity: number;
        allowExtraCapacity: boolean;
    };
}

export const getServiceTypeRecommendations = (serviceType: ServiceType): ServiceTypeRecommendation => {
    switch (serviceType) {
        case "ACCOMMODATION":
            return {
                bookingTypes: [
                    {
                        value: "MULTI_DAY",
                        label: "Multi Day",
                        description: "Perfect for hotels, guesthouses, and resorts. Customers book from check-in to check-out dates. Units = rooms, villas, dorm beds.",
                        recommended: true,
                    },
                    {
                        value: "WHOLE_DAY",
                        label: "Whole Day",
                        description: "For single-day accommodation without specific hours (day-use rooms).",
                    },
                ],
                priceTypes: [
                    {
                        value: "PER_NIGHT",
                        label: "Per Night",
                        description: "Standard accommodation pricing - per night stay. Most common for hotels, villas, and rooms.",
                        recommended: true,
                    },
                    {
                        value: "PER_PERSON",
                        label: "Per Person",
                        description: "Pricing per guest - separate rates for adults and children. Good for hostels and shared accommodations.",
                    },
                    {
                        value: "PER_DAY",
                        label: "Per Day",
                        description: "Day-use pricing for accommodation (without overnight stay).",
                    },
                    {
                        value: "FIXED",
                        label: "Fixed Package",
                        description: "Complete package pricing for entire stay regardless of duration.",
                    },
                ],
                defaultCapacity: {
                    totalUnits: 5,
                    unitAdultCapacity: 2,
                    unitChildCapacity: 2,
                    allowExtraCapacity: true,
                },
            };

        case "TRANSPORT":
            return {
                bookingTypes: [
                    {
                        value: "MULTI_DAY",
                        label: "Multi Day",
                        description: "For long-term vehicle rentals spanning multiple days. Most common for vehicle rentals.",
                        recommended: true,
                    },
                    {
                        value: "TIME_SLOTS",
                        label: "Time Slots",
                        description: "For specific pickup/drop-off times and scheduled services. Units = vehicles.",
                    },
                    {
                        value: "FLEXIBLE_HOURS",
                        label: "Flexible Hours",
                        description: "Hourly rentals where customers choose duration (e.g., 2-8 hours).",
                    },
                ],
                priceTypes: [
                    {
                        value: "PER_UNIT",
                        label: "Per Vehicle",
                        description: "Fixed price per vehicle regardless of time or distance.",
                        recommended: true,
                    },
                    {
                        value: "PER_HOUR",
                        label: "Per Hour",
                        description: "Hourly rates for short-term rentals.",
                    },
                    {
                        value: "PER_DAY",
                        label: "Per Day",
                        description: "Fixed daily rate regardless of distance.",
                    },
                    {
                        value: "PER_KM",
                        label: "Per KM",
                        description: "Distance-based pricing - ideal for taxis and travel services.",
                    },
                ],
                defaultCapacity: {
                    totalUnits: 3,
                    unitAdultCapacity: 4,
                    unitChildCapacity: 2,
                    allowExtraCapacity: false,
                },
            };

        case "ACTIVITY":
            return {
                bookingTypes: [
                    {
                        value: "TIME_SLOTS",
                        label: "Time Slots",
                        description: "Most popular for tours and activities - specific start/end times. Units = activity sessions/groups.",
                        recommended: true,
                    },
                    {
                        value: "FIXED_TIME",
                        label: "Fixed Duration",
                        description: "Activities with set durations (e.g., 2-hour workshop, 4-hour tour).",
                    },
                    {
                        value: "EVENT_BASED",
                        label: "Event Based",
                        description: "Special events, workshops, or seasonal activities.",
                    },
                ],
                priceTypes: [
                    {
                        value: "PER_PERSON",
                        label: "Per Person",
                        description: "Standard activity pricing - different rates for adults and children.",
                        recommended: true,
                    },
                    {
                        value: "FIXED",
                        label: "Fixed Price",
                        description: "Group pricing - one price regardless of group size.",
                    },
                    {
                        value: "HYBRID",
                        label: "Hybrid",
                        description: "Base group rate plus per-person charges.",
                    },
                ],
                defaultCapacity: {
                    totalUnits: 2,
                    unitAdultCapacity: 15,
                    unitChildCapacity: 8,
                    allowExtraCapacity: true,
                },
            };

        case "FOOD_BEVERAGE":
            return {
                bookingTypes: [
                    {
                        value: "TIME_SLOTS",
                        label: "Time Slots",
                        description: "Table reservations with specific dining times. Units = tables, packages.",
                        recommended: true,
                    },
                    {
                        value: "WHOLE_DAY",
                        label: "Whole Day",
                        description: "Open seating throughout operating hours.",
                    },
                ],
                priceTypes: [
                    {
                        value: "PER_PERSON",
                        label: "Per Person",
                        description: "Menu pricing per diner - most common for restaurants.",
                        recommended: true,
                    },
                    {
                        value: "FIXED",
                        label: "Fixed Price",
                        description: "Set menus or group packages.",
                    },
                ],
                defaultCapacity: {
                    totalUnits: 10,
                    unitAdultCapacity: 6,
                    unitChildCapacity: 4,
                    allowExtraCapacity: true,
                },
            };

        case "TOUR_GUIDE":
            return {
                bookingTypes: [
                    {
                        value: "WHOLE_DAY",
                        label: "Whole Day",
                        description: "Full-day guide services - most common for tourism. Units = guide slots.",
                        recommended: true,
                    },
                    {
                        value: "MULTI_DAY",
                        label: "Multi Day",
                        description: "Extended tours spanning multiple days.",
                    },
                    {
                        value: "FLEXIBLE_HOURS",
                        label: "Flexible Hours",
                        description: "Hourly guide services where clients choose duration.",
                    },
                ],
                priceTypes: [
                    {
                        value: "PER_DAY",
                        label: "Per Day",
                        description: "Daily rate for guide services - most standard approach.",
                        recommended: true,
                    },
                    {
                        value: "PER_HOUR",
                        label: "Per Hour",
                        description: "Hourly rates for flexible guide services.",
                    },
                    {
                        value: "FIXED",
                        label: "Fixed Price",
                        description: "Fixed tour package pricing regardless of duration or group size.",
                    },
                ],
                defaultCapacity: {
                    totalUnits: 1,
                    unitAdultCapacity: 20,
                    unitChildCapacity: 10,
                    allowExtraCapacity: true,
                },
            };

        default:
            return {
                bookingTypes: [
                    {
                        value: "TIME_SLOTS",
                        label: "Time Slots",
                        description: "Bookings for specific time periods.",
                    },
                    {
                        value: "WHOLE_DAY",
                        label: "Whole Day",
                        description: "Full-day bookings.",
                    },
                ],
                priceTypes: [
                    {
                        value: "FIXED",
                        label: "Fixed Price",
                        description: "Single fixed price.",
                    },
                    {
                        value: "PER_PERSON",
                        label: "Per Person",
                        description: "Pricing per person.",
                    },
                ],
            };
    }
};

export const getBookingTypeDescription = (bookingType: BookingType): string => {
    const descriptions: Record<BookingType, string> = {
        TIME_SLOTS: "Customers book specific time slots (e.g., 10:00 AM - 1:00 PM). You control exact timing and can manage capacity per slot.",
        MULTI_DAY: "Customers book date ranges (e.g., Jan 5-7). Perfect for accommodation and extended services.",
        WHOLE_DAY: "Customers book full days without specific hours. Great for vehicle rentals and day-long experiences.",
        FIXED_TIME: "Services with predetermined durations (e.g., 2-hour tour). Customers book the experience, not specific times.",
        FLEXIBLE_HOURS: "Customers choose their own start/end times within your operating hours and duration limits.",
        EVENT_BASED: "Bookings tied to specific events or dates you create. Perfect for workshops, special tours, or seasonal activities.",
    };
    return descriptions[bookingType] || "Custom booking configuration.";
};

export const getPriceTypeDescription = (priceType: PriceType): string => {
    const descriptions: Record<PriceType, string> = {
        FIXED: "One price for the entire service, regardless of group size or duration.",
        PER_PERSON: "Separate pricing for adults and children. Most flexible for group bookings.",
        PER_UNIT: "Price per room, vehicle, or unit. Specify how many people each unit accommodates.",
        HYBRID: "Base price plus additional per-person or per-unit charges. Great for covering fixed costs.",
        PER_HOUR: "Hourly rates. System calculates total based on booking duration.",
        PER_DAY: "Daily rates. System calculates total based on number of days.",
        PER_NIGHT: "Per-night pricing for accommodation. Similar to per-day but specifically for lodging.",
        PER_KM: "Distance-based pricing. Can include base fare plus per-kilometer charges.",
    };
    return descriptions[priceType] || "Custom pricing configuration.";
};

export const getDefaultCapacityForServiceType = (serviceType: ServiceType) => {
    const recommendations = getServiceTypeRecommendations(serviceType);
    return recommendations.defaultCapacity || {
        totalUnits: 1,
        unitAdultCapacity: 1,
        unitChildCapacity: 0,
        allowExtraCapacity: false,
    };
};
