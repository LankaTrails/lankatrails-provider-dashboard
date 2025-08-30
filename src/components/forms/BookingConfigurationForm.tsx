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

interface BookingConfigurationFormProps {
  bookingConfig?: BookingConfigDTO;
  serviceType: ServiceType;
  onChange: (config: BookingConfigDTO) => void;
}

const BOOKING_TYPE_OPTIONS = [
  {
    value: "TIME_SLOTS",
    label: "Time Slots",
    description:
      "Providers must define available time slots (start/end times per day). Example: 'Tour at 10:00 AM – 1:00 PM'.",
  },
  {
    value: "MULTI_DAY",
    label: "Multi Day",
    description:
      "Providers must allow start date and end date bookings. Example: 'Hotel booking from Jan 5 – Jan 7'.",
  },
  {
    value: "WHOLE_DAY",
    label: "Whole Day",
    description:
      "Providers only define availability per day (no hours). Example: 'Vehicle rental for a full day'.",
  },
  {
    value: "FIXED_TIME",
    label: "Fixed Time",
    description:
      "Providers define fixed durations (e.g., 2 hours, 4 hours). Example: 'Consultation for 2 hours'.",
  },
  {
    value: "FLEXIBLE_HOURS",
    label: "Flexible Hours",
    description:
      "Providers define minimum and maximum booking duration within a day. Example: 'Boat rental: 1–6 hours between 8 AM – 8 PM'.",
  },
  {
    value: "EVENT_BASED",
    label: "Event Based",
    description:
      "Providers attach bookings to specific event dates/times. Example: 'Wedding package on Feb 20'.",
  },
];

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Booking Configuration
        </h3>

        {/* Booking Type Selection */}
        <div className="space-y-4">
          <div className="relative">
            <SelectField
              label="Booking Type"
              options={BOOKING_TYPE_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              value={bookingConfig?.bookingType || ""}
              onChange={(value) =>
                handleConfigChange("bookingType", value as BookingType)
              }
              required
            />
            {/* Tooltip */}
            {bookingConfig?.bookingType && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    {
                      BOOKING_TYPE_OPTIONS.find(
                        (opt) => opt.value === bookingConfig.bookingType
                      )?.description
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Capacity Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total {getUnitLabel()}
              </label>
              <CounterInput
                value={bookingConfig?.totalUnits || 1}
                onChange={(value) => handleConfigChange("totalUnits", value)}
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
                {serviceType === "TOUR_GUIDE" && "Max adults per tour group"}
                {serviceType === "ACCOMMODATION" && "Max adults per room"}
                {serviceType === "TRANSPORT" && "Max adults per vehicle"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                {serviceType === "TOUR_GUIDE" && "Max children per tour group"}
                {serviceType === "ACCOMMODATION" && "Max children per room"}
                {serviceType === "TRANSPORT" && "Max children per vehicle"}
              </p>
            </div>
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

          {/* Extra Capacity Configuration */}
          {bookingConfig?.allowExtraCapacity && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800">
                Extra Capacity Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
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
