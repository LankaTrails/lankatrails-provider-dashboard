import type {
    BookingConfigDTO,
    PriceConfigDTO,
    BookingType,
    PriceType,
    ServiceType,
} from "@/types/serviceTypes";

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Validates booking configuration based on service type and business rules
 */
export const validateBookingConfig = (
    config: BookingConfigDTO | undefined,
    serviceType: ServiceType
): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!config) {
        errors.push({ field: "bookingConfig", message: "Booking configuration is required" });
        return { isValid: false, errors };
    }

    // Validate booking type
    if (!config.bookingType) {
        errors.push({ field: "bookingType", message: "Booking type is required" });
    }

    // Validate capacity configuration - only if manageCapacity is enabled
    if (config.manageCapacity) {
        if (!config.totalUnits || config.totalUnits <= 0) {
            errors.push({ field: "totalUnits", message: "Total units must be greater than 0" });
        }

        if (!config.unitAdultCapacity || config.unitAdultCapacity <= 0) {
            errors.push({ field: "unitAdultCapacity", message: "Adult capacity per unit must be greater than 0" });
        }
    }

    // Service-specific validations
    switch (serviceType) {
        case "ACCOMMODATION":
            // For accommodation, MULTI_DAY or WHOLE_DAY booking types are required
            if (config.bookingType && !["MULTI_DAY", "WHOLE_DAY"].includes(config.bookingType)) {
                errors.push({
                    field: "bookingType",
                    message: "Accommodation services must use MULTI_DAY or WHOLE_DAY booking type"
                });
            }
            break;

        case "TRANSPORT":
            // For transport, specific booking types are allowed
            if (config.bookingType && !["TIME_SLOTS", "FLEXIBLE_HOURS", "MULTI_DAY"].includes(config.bookingType)) {
                errors.push({
                    field: "bookingType",
                    message: "Transport services must use TIME_SLOTS, FLEXIBLE_HOURS, or MULTI_DAY booking type"
                });
            }
            break;

        case "ACTIVITY":
            // For activities, specific booking types are allowed
            if (config.bookingType && !["TIME_SLOTS", "FIXED_TIME", "EVENT_BASED"].includes(config.bookingType)) {
                errors.push({
                    field: "bookingType",
                    message: "Activity services must use TIME_SLOTS, FIXED_TIME, or EVENT_BASED booking type"
                });
            }
            break;

        case "FOOD_BEVERAGE":
            // For food & beverage, specific booking types are allowed
            if (config.bookingType && !["TIME_SLOTS", "WHOLE_DAY"].includes(config.bookingType)) {
                errors.push({
                    field: "bookingType",
                    message: "Food & Beverage services must use TIME_SLOTS or WHOLE_DAY booking type"
                });
            }
            break;

        case "TOUR_GUIDE":
            // For tour guides, specific booking types are allowed
            if (config.bookingType && !["WHOLE_DAY", "MULTI_DAY", "FLEXIBLE_HOURS"].includes(config.bookingType)) {
                errors.push({
                    field: "bookingType",
                    message: "Tour Guide services must use WHOLE_DAY, MULTI_DAY, or FLEXIBLE_HOURS booking type"
                });
            }
            break;
    }

    // Validate booking-type specific configurations
    if (config.bookingType === "TIME_SLOTS" || config.bookingType === "FIXED_TIME") {
        if (!config.slotDuration || config.slotDuration <= 0) {
            errors.push({
                field: "slotDuration",
                message: "Slot duration is required for time-based bookings"
            });
        }
    }

    if (config.bookingType === "MULTI_DAY") {
        if (!config.minimumBookingDays || config.minimumBookingDays <= 0) {
            errors.push({
                field: "minimumBookingDays",
                message: "Minimum booking days is required for multi-day bookings"
            });
        }
        if (!config.defaultCheckInTime) {
            errors.push({
                field: "defaultCheckInTime",
                message: "Check-in time is required for multi-day bookings"
            });
        }
        if (!config.defaultCheckOutTime) {
            errors.push({
                field: "defaultCheckOutTime",
                message: "Check-out time is required for multi-day bookings"
            });
        }
    }

    if (config.bookingType === "FLEXIBLE_HOURS") {
        if (!config.slotDuration || config.slotDuration <= 0) {
            errors.push({
                field: "slotDuration",
                message: "Minimum duration is required for flexible hours booking"
            });
        }
        if (!config.bufferTime || config.bufferTime <= 0) {
            errors.push({
                field: "bufferTime",
                message: "Maximum duration is required for flexible hours booking"
            });
        }
    }

    return { isValid: errors.length === 0, errors };
};

/**
 * Validates price configuration based on service type and business rules
 */
export const validatePriceConfig = (
    config: PriceConfigDTO | undefined,
    serviceType: ServiceType
): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!config) {
        errors.push({ field: "priceConfig", message: "Price configuration is required" });
        return { isValid: false, errors };
    }

    // Validate price type
    if (!config.priceType) {
        errors.push({ field: "priceType", message: "Price type is required" });
        return { isValid: false, errors };
    }

    // Service-specific price type validations
    switch (serviceType) {
        case "ACCOMMODATION":
            if (!["PER_NIGHT", "PER_DAY", "FIXED"].includes(config.priceType)) {
                errors.push({
                    field: "priceType",
                    message: "Accommodation services must use PER_NIGHT, PER_DAY, or FIXED pricing"
                });
            }
            break;

        case "TRANSPORT":
            if (!["PER_UNIT", "PER_HOUR", "PER_DAY", "PER_KM"].includes(config.priceType)) {
                errors.push({
                    field: "priceType",
                    message: "Transport services must use PER_UNIT, PER_HOUR, PER_DAY, or PER_KM pricing"
                });
            }
            break;

        case "ACTIVITY":
            if (!["PER_PERSON", "FIXED", "HYBRID"].includes(config.priceType)) {
                errors.push({
                    field: "priceType",
                    message: "Activity services must use PER_PERSON, FIXED, or HYBRID pricing"
                });
            }
            break;

        case "FOOD_BEVERAGE":
            if (!["PER_PERSON", "FIXED"].includes(config.priceType)) {
                errors.push({
                    field: "priceType",
                    message: "Food & Beverage services must use PER_PERSON or FIXED pricing"
                });
            }
            break;

        case "TOUR_GUIDE":
            if (!["PER_DAY", "PER_HOUR", "FIXED"].includes(config.priceType)) {
                errors.push({
                    field: "priceType",
                    message: "Tour Guide services must use PER_DAY, PER_HOUR, or FIXED pricing"
                });
            }
            break;
    }

    // Validate required price fields based on price type
    switch (config.priceType) {
        case "FIXED":
            if (!config.fixedPrice || config.fixedPrice <= 0) {
                errors.push({
                    field: "fixedPrice",
                    message: "Fixed price must be greater than 0"
                });
            }
            break;

        case "PER_PERSON":
            if (!config.pricePerAdult || config.pricePerAdult <= 0) {
                errors.push({
                    field: "pricePerAdult",
                    message: "Price per adult must be greater than 0"
                });
            }
            // Child price is optional but if provided must be valid
            if (config.pricePerChild !== undefined && config.pricePerChild < 0) {
                errors.push({
                    field: "pricePerChild",
                    message: "Price per child cannot be negative"
                });
            }
            break;

        case "PER_UNIT":
            if (!config.pricePerUnit || config.pricePerUnit <= 0) {
                errors.push({
                    field: "pricePerUnit",
                    message: "Price per unit must be greater than 0"
                });
            }
            break;

        case "HYBRID":
            if (!config.fixedPrice || config.fixedPrice <= 0) {
                errors.push({
                    field: "fixedPrice",
                    message: "Base price must be greater than 0 for hybrid pricing"
                });
            }
            if (!config.pricePerAdult || config.pricePerAdult <= 0) {
                errors.push({
                    field: "pricePerAdult",
                    message: "Price per adult must be greater than 0 for hybrid pricing"
                });
            }
            break;

        case "PER_HOUR":
        case "PER_DAY":
        case "PER_NIGHT":
            if (!config.pricePerUnit || config.pricePerUnit <= 0) {
                errors.push({
                    field: "pricePerUnit",
                    message: `Rate must be greater than 0 for ${config.priceType.replace('_', ' ').toLowerCase()} pricing`
                });
            }
            break;

        case "PER_KM":
            if (!config.pricePerUnit || config.pricePerUnit <= 0) {
                errors.push({
                    field: "pricePerUnit",
                    message: "Price per KM must be greater than 0"
                });
            }
            // Base fare is optional for PER_KM but if provided must be valid
            if (config.fixedPrice !== undefined && config.fixedPrice < 0) {
                errors.push({
                    field: "fixedPrice",
                    message: "Base fare cannot be negative"
                });
            }
            break;
    }

    // Validate payment options
    if (config.allowAdvancePayment) {
        if (
            (!config.advancePaymentPercentage || config.advancePaymentPercentage <= 0) &&
            (!config.advancePaymentFixedAmount || config.advancePaymentFixedAmount <= 0)
        ) {
            errors.push({
                field: "advancePayment",
                message: "Either advance payment percentage or fixed amount must be specified"
            });
        }

        if (config.advancePaymentPercentage && (config.advancePaymentPercentage < 1 || config.advancePaymentPercentage > 100)) {
            errors.push({
                field: "advancePaymentPercentage",
                message: "Advance payment percentage must be between 1 and 100"
            });
        }
    }

    if (config.requiresDeposit) {
        if (!config.depositAmount || config.depositAmount <= 0) {
            errors.push({
                field: "depositAmount",
                message: "Deposit amount must be greater than 0"
            });
        }
    }

    return { isValid: errors.length === 0, errors };
};

/**
 * Get contextual hints for service types
 */
export const getServiceTypeHints = (serviceType: ServiceType) => {
    switch (serviceType) {
        case "ACCOMMODATION":
            return {
                units: "Units represent rooms, villas, or dorm beds",
                bookingType: "Use MULTI_DAY for check-in/check-out bookings or WHOLE_DAY for day-use",
                priceType: "PER_NIGHT is most common for accommodation, or FIXED for package deals"
            };
        case "TRANSPORT":
            return {
                units: "Units represent vehicles in your fleet",
                bookingType: "Use TIME_SLOTS for scheduled services, FLEXIBLE_HOURS for rentals, or MULTI_DAY for long-term rentals",
                priceType: "PER_UNIT for fixed vehicle pricing, PER_KM for distance-based, or PER_HOUR/PER_DAY for time-based"
            };
        case "ACTIVITY":
            return {
                units: "Units represent activity sessions or groups you can manage simultaneously",
                bookingType: "Use TIME_SLOTS for scheduled activities, FIXED_TIME for set durations, or EVENT_BASED for special events",
                priceType: "PER_PERSON is most common, FIXED for group pricing, or HYBRID for base + per-person charges"
            };
        case "FOOD_BEVERAGE":
            return {
                units: "Units represent tables or seating sections",
                bookingType: "Use TIME_SLOTS for table reservations or WHOLE_DAY for open seating",
                priceType: "PER_PERSON for menu pricing or FIXED for set menus and packages"
            };
        case "TOUR_GUIDE":
            return {
                units: "Units represent tour groups you can guide simultaneously",
                bookingType: "Use WHOLE_DAY for full-day tours, MULTI_DAY for extended tours, or FLEXIBLE_HOURS for hourly services",
                priceType: "PER_DAY is most common, PER_HOUR for flexible services, or FIXED for tour packages"
            };
        default:
            return {
                units: "Define your service units",
                bookingType: "Choose appropriate booking type",
                priceType: "Select suitable pricing model"
            };
    }
};
