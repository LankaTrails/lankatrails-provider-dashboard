import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import CounterInput from "./CounterInput";
import type {
  BookingConfigDTO,
  BookingType,
  ServiceType,
} from "@/types/serviceTypes";
import { Info } from "lucide-react";
import { getServiceTypeRecommendations } from "@/utils/serviceRecommendations";

interface BookingConfigurationFormProps {
  bookingConfig?: BookingConfigDTO;
  serviceType: ServiceType;
  onChange: (config: BookingConfigDTO) => void;
}

const BookingConfigurationForm: React.FC<BookingConfigurationFormProps> = ({
  bookingConfig,
  serviceType,
  onChange,
}) => {
  const handleConfigChange = (field: keyof BookingConfigDTO, value: any) => {
    const updatedConfig = {
      ...bookingConfig,
      [field]: value,
    } as BookingConfigDTO;
    onChange(updatedConfig);
  };

  // Get service-specific booking types
  const getBookingTypeOptions = () => {
    const recommendations = getServiceTypeRecommendations(serviceType);
    return recommendations.bookingTypes.map((bt) => ({
      value: bt.value,
      label: bt.label,
      description: bt.description,
      recommended: bt.recommended,
    }));
  };

  const getUnitLabel = () => {
    switch (serviceType) {
      case "ACCOMMODATION":
        return "Rooms/Villas";
      case "TRANSPORT":
        return "Vehicles";
      case "ACTIVITY":
        return "Activity Slots";
      case "FOOD_BEVERAGE":
        return "Tables/Seats";
      case "TOUR_GUIDE":
        return "Groups";
      default:
        return "Units";
    }
  };

  const getCapacityLabel = () => {
    switch (serviceType) {
      case "ACCOMMODATION":
        return "Guests per Room";
      case "TRANSPORT":
        return "Seats per Vehicle";
      case "ACTIVITY":
        return "Participants per Slot";
      case "FOOD_BEVERAGE":
        return "Diners per Table";
      case "TOUR_GUIDE":
        return "Tourists per Group";
      default:
        return "Participants";
    }
  };

  const showTimeSlotConfiguration = () => {
    return (
      bookingConfig?.bookingType === "TIME_SLOTS" ||
      bookingConfig?.bookingType === "FIXED_TIME"
    );
  };

  const showDateRangeConfiguration = () => {
    return bookingConfig?.bookingType === "MULTI_DAY";
  };

  const showFlexibleHoursConfiguration = () => {
    return bookingConfig?.bookingType === "FLEXIBLE_HOURS";
  };

  // Check if selected booking type is appropriate for service type
  const isBookingTypeAppropriate = () => {
    if (!bookingConfig?.bookingType) return true;

    const recommendations = getServiceTypeRecommendations(serviceType);
    return recommendations.bookingTypes.some(
      (bt) => bt.value === bookingConfig.bookingType
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg border border-gray-200 bg-white">
        {/* Booking Type Selection */}
        <div className="space-y-4">
          <div className="relative">
            <SelectField
              label="Booking Type"
              options={getBookingTypeOptions().map((option) => ({
                value: option.value,
                label: option.recommended
                  ? `${option.label} (Recommended)`
                  : option.label,
              }))}
              value={bookingConfig?.bookingType || ""}
              onChange={(value) =>
                handleConfigChange("bookingType", value as BookingType)
              }
              required
            />
            {/* Tooltip */}
            {bookingConfig?.bookingType && (
              <div className="mt-2">
                {/* Show warning only if not appropriate */}
                {!isBookingTypeAppropriate() ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        This booking type is not typically recommended for{" "}
                        {serviceType.toLowerCase().replace("_", " ")} services.
                        Consider using one of the recommended options for better
                        customer experience.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    {
                      getBookingTypeOptions().find(
                        (opt) => opt.value === bookingConfig.bookingType
                      )?.description
                    }
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Manage Capacity Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <CheckboxField
              label="Manage Capacity"
              checked={bookingConfig?.manageCapacity ?? true}
              onChange={(value) => handleConfigChange("manageCapacity", value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enable to control how many units and guests you can accommodate
            </p>
          </div>

          {/* Capacity Configuration - only show if manageCapacity is enabled */}
          {(bookingConfig?.manageCapacity ?? true) && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Capacity Settings</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total {getUnitLabel()}
                  </label>
                  <CounterInput
                    value={bookingConfig?.totalUnits || 1}
                    onChange={(value) =>
                      handleConfigChange("totalUnits", value)
                    }
                    min={1}
                    max={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {serviceType === "ACTIVITY" &&
                      "Number of concurrent activity sessions"}
                    {serviceType === "FOOD_BEVERAGE" &&
                      "Number of tables or seating sections"}
                    {serviceType === "TOUR_GUIDE" &&
                      "Number of tour groups you can handle"}
                    {serviceType === "ACCOMMODATION" &&
                      "Number of rooms or villas available"}
                    {serviceType === "TRANSPORT" &&
                      "Number of vehicles in your fleet"}
                  </p>
                </div>
                <div className="space-y-2">
                  <CheckboxField
                    label="Separate Child & Adult Pricing"
                    checked={bookingConfig?.requireChildInfo || false}
                    onChange={(value) =>
                      handleConfigChange("requireChildInfo", value)
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Enable to collect separate child and adult information with
                    different rates and capacities. If disabled, all guests are
                    treated as adults.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getCapacityLabel()} (Adults)
                  </label>
                  <CounterInput
                    value={bookingConfig?.unitAdultCapacity || 1}
                    onChange={(value) =>
                      handleConfigChange("unitAdultCapacity", value)
                    }
                    min={1}
                    max={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {serviceType === "ACTIVITY" &&
                      "Max adults per activity session"}
                    {serviceType === "FOOD_BEVERAGE" &&
                      "Max adults per table/seating"}
                    {serviceType === "TOUR_GUIDE" &&
                      "Max adults per tour group"}
                    {serviceType === "ACCOMMODATION" && "Max adults per room"}
                    {serviceType === "TRANSPORT" && "Max adults per vehicle"}
                  </p>
                </div>

                {/* Only show child capacity if requireChildInfo is enabled */}
                {bookingConfig?.requireChildInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getCapacityLabel()} (Children)
                    </label>
                    <CounterInput
                      value={bookingConfig?.unitChildCapacity || 0}
                      onChange={(value) =>
                        handleConfigChange("unitChildCapacity", value)
                      }
                      min={0}
                      max={20}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {serviceType === "ACTIVITY" &&
                        "Max children per activity session"}
                      {serviceType === "FOOD_BEVERAGE" &&
                        "Max children per table/seating"}
                      {serviceType === "TOUR_GUIDE" &&
                        "Max children per tour group"}
                      {serviceType === "ACCOMMODATION" &&
                        "Max children per room"}
                      {serviceType === "TRANSPORT" &&
                        "Max children per vehicle"}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <CheckboxField
                    label="Allow Extra Capacity"
                    checked={bookingConfig?.allowExtraCapacity || false}
                    onChange={(value) =>
                      handleConfigChange("allowExtraCapacity", value)
                    }
                  />
                  <p className="text-xs text-gray-500">
                    {serviceType === "ACTIVITY" &&
                      "Allow overflow participants for activities"}
                    {serviceType === "FOOD_BEVERAGE" &&
                      "Allow additional seating arrangements"}
                    {serviceType === "TOUR_GUIDE" &&
                      "Allow larger groups with extra arrangements"}
                    {serviceType === "ACCOMMODATION" &&
                      "Allow extra beds or mattresses"}
                    {serviceType === "TRANSPORT" &&
                      "Allow additional passengers if legally permitted"}
                  </p>
                </div>
              </div>

              {/* Extra Capacity Settings - only show if allowExtraCapacity is enabled */}
              {bookingConfig?.allowExtraCapacity && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium text-gray-800">
                    Extra Capacity Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extra Adults
                      </label>
                      <CounterInput
                        value={bookingConfig?.extraAdultCapacity || 0}
                        onChange={(value) =>
                          handleConfigChange("extraAdultCapacity", value)
                        }
                        min={0}
                        max={10}
                      />
                    </div>

                    {/* Only show extra child capacity if requireChildInfo is enabled */}
                    {bookingConfig?.requireChildInfo && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Extra Children
                        </label>
                        <CounterInput
                          value={bookingConfig?.extraChildCapacity || 0}
                          onChange={(value) =>
                            handleConfigChange("extraChildCapacity", value)
                          }
                          min={0}
                          max={10}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Time Slot Configuration */}
          {showTimeSlotConfiguration() && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">Time Slot Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Slot Duration (minutes)"
                  type="number"
                  value={bookingConfig?.slotDuration?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange("slotDuration", parseInt(value) || 0)
                  }
                  placeholder="e.g., 60"
                />
                <InputField
                  label="Buffer Time (minutes)"
                  type="number"
                  value={bookingConfig?.bufferTime?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange("bufferTime", parseInt(value) || 0)
                  }
                  placeholder="e.g., 15"
                />
              </div>
              <CheckboxField
                label="Allow Back-to-Back Bookings"
                checked={bookingConfig?.allowBackToBackBookings || false}
                onChange={(value) =>
                  handleConfigChange("allowBackToBackBookings", value)
                }
              />
            </div>
          )}

          {/* Date Range Configuration */}
          {showDateRangeConfiguration() && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">Date Range Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Minimum Booking Days"
                  type="number"
                  value={bookingConfig?.minimumBookingDays?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange(
                      "minimumBookingDays",
                      parseInt(value) || 1
                    )
                  }
                  placeholder="e.g., 1"
                />
                <InputField
                  label="Maximum Booking Days"
                  type="number"
                  value={bookingConfig?.maximumBookingDays?.toString() || ""}
                  onChange={(value) =>
                    handleConfigChange(
                      "maximumBookingDays",
                      parseInt(value) || 0
                    )
                  }
                  placeholder="e.g., 30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Default Check-in Time"
                  type="time"
                  value={bookingConfig?.defaultCheckInTime || ""}
                  onChange={(value) =>
                    handleConfigChange("defaultCheckInTime", value)
                  }
                />
                <InputField
                  label="Default Check-out Time"
                  type="time"
                  value={bookingConfig?.defaultCheckOutTime || ""}
                  onChange={(value) =>
                    handleConfigChange("defaultCheckOutTime", value)
                  }
                />
              </div>
            </div>
          )}

          {/* Flexible Hours Configuration */}
          {showFlexibleHoursConfiguration() && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">
                Flexible Hours Settings
              </h4>
              <p className="text-sm text-gray-600">
                Customers can book any time during your operating hours with
                flexible duration
              </p>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Minimum Duration (hours)"
                  type="number"
                  value={
                    bookingConfig?.slotDuration
                      ? (bookingConfig.slotDuration / 60).toString()
                      : ""
                  }
                  onChange={(value) =>
                    handleConfigChange(
                      "slotDuration",
                      (parseInt(value) || 1) * 60
                    )
                  }
                  placeholder="e.g., 1"
                />
                <InputField
                  label="Maximum Duration (hours)"
                  type="number"
                  value={
                    bookingConfig?.bufferTime
                      ? (bookingConfig.bufferTime / 60).toString()
                      : ""
                  }
                  onChange={(value) =>
                    handleConfigChange(
                      "bufferTime",
                      (parseInt(value) || 8) * 60
                    )
                  }
                  placeholder="e.g., 8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Note: The slot duration field is optional for flexible hours as
                customers can choose any time within your operating hours
              </p>
            </div>
          )}

          {/* Booking Window Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">Booking Window</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Advance Booking Period (days)"
                type="number"
                value={bookingConfig?.advanceBookingPeriod?.toString() || ""}
                onChange={(value) =>
                  handleConfigChange(
                    "advanceBookingPeriod",
                    parseInt(value) || 0
                  )
                }
                placeholder="e.g., 30"
              />
              <InputField
                label="Last Minute Booking (hours)"
                type="number"
                value={bookingConfig?.lastMinuteBookingPeriod?.toString() || ""}
                onChange={(value) =>
                  handleConfigChange(
                    "lastMinuteBookingPeriod",
                    parseInt(value) || 0
                  )
                }
                placeholder="e.g., 24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfigurationForm;
