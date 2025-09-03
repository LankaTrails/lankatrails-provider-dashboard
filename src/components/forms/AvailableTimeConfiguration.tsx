import React, { useState, useEffect } from "react";
import {
  Plus,
  Clock,
  Calendar,
  Coffee,
  X,
  ChevronDown,
  ChevronRight,
  Copy,
} from "lucide-react";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import type { AvailableTimeDTO, BreakTimeDTO } from "@/types/serviceTypes";

interface AvailableTimeConfigurationProps {
  availableTimes: AvailableTimeDTO[];
  onChange: (availableTimes: AvailableTimeDTO[]) => void;
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Mon", fullLabel: "Monday" },
  { value: "TUESDAY", label: "Tue", fullLabel: "Tuesday" },
  { value: "WEDNESDAY", label: "Wed", fullLabel: "Wednesday" },
  { value: "THURSDAY", label: "Thu", fullLabel: "Thursday" },
  { value: "FRIDAY", label: "Fri", fullLabel: "Friday" },
  { value: "SATURDAY", label: "Sat", fullLabel: "Saturday" },
  { value: "SUNDAY", label: "Sun", fullLabel: "Sunday" },
];

const AvailableTimeConfiguration: React.FC<AvailableTimeConfigurationProps> = ({
  availableTimes,
  onChange,
}) => {
  const [localAvailableTimes, setLocalAvailableTimes] = useState<
    AvailableTimeDTO[]
  >([]);
  const [activeDay, setActiveDay] = useState<string>("MONDAY");
  const [expandedBreaks, setExpandedBreaks] = useState<Record<string, boolean>>(
    {}
  );

  // Initialize with default schedule if empty
  useEffect(() => {
    if (!availableTimes || availableTimes.length === 0) {
      const defaultSchedule: AvailableTimeDTO[] = DAYS_OF_WEEK.map((day) => ({
        availableTimeId: null, // Set to null for new available times
        dayOfWeek: day.value,
        openTime: "09:00",
        closeTime: "18:00",
        is24Hours: false,
        isClosed: false,
        breakTimes: [],
      }));
      setLocalAvailableTimes(defaultSchedule);
      onChange(defaultSchedule);
    } else {
      setLocalAvailableTimes(availableTimes);
    }
  }, [availableTimes, onChange]);

  const updateAvailableTime = (
    dayOfWeek: string,
    updates: Partial<AvailableTimeDTO>
  ) => {
    const updated = localAvailableTimes.map((time) =>
      time.dayOfWeek === dayOfWeek ? { ...time, ...updates } : time
    );
    setLocalAvailableTimes(updated);
    onChange(updated);
  };

  const addBreakTime = (dayOfWeek: string) => {
    const newBreakTime: BreakTimeDTO = {
      breakId: null, // Set to null for new break times
      breakStart: "12:00",
      breakEnd: "13:00",
    };

    const updatedTimes = localAvailableTimes.map((time) =>
      time.dayOfWeek === dayOfWeek
        ? { ...time, breakTimes: [...time.breakTimes, newBreakTime] }
        : time
    );

    setLocalAvailableTimes(updatedTimes);
    onChange(updatedTimes);
    setExpandedBreaks((prev) => ({ ...prev, [dayOfWeek]: true }));
  };

  const updateBreakTime = (
    dayOfWeek: string,
    breakIndex: number,
    updates: Partial<BreakTimeDTO>
  ) => {
    const updatedTimes = localAvailableTimes.map((time) =>
      time.dayOfWeek === dayOfWeek
        ? {
            ...time,
            breakTimes: time.breakTimes.map((breakTime, j) =>
              j === breakIndex ? { ...breakTime, ...updates } : breakTime
            ),
          }
        : time
    );

    setLocalAvailableTimes(updatedTimes);
    onChange(updatedTimes);
  };

  const removeBreakTime = (dayOfWeek: string, breakIndex: number) => {
    const updatedTimes = localAvailableTimes.map((time) =>
      time.dayOfWeek === dayOfWeek
        ? {
            ...time,
            breakTimes: time.breakTimes.filter((_, j) => j !== breakIndex),
          }
        : time
    );

    setLocalAvailableTimes(updatedTimes);
    onChange(updatedTimes);
  };

  const copyToAllDays = (sourceDayOfWeek: string) => {
    const sourceDay = localAvailableTimes.find(
      (time) => time.dayOfWeek === sourceDayOfWeek
    );
    if (!sourceDay) return;

    const updatedTimes = localAvailableTimes.map((time) =>
      time.dayOfWeek === sourceDayOfWeek
        ? time
        : {
            ...time,
            openTime: sourceDay.openTime,
            closeTime: sourceDay.closeTime,
            is24Hours: sourceDay.is24Hours,
            isClosed: sourceDay.isClosed,
            breakTimes: sourceDay.breakTimes.map((breakTime) => ({
              ...breakTime,
              breakId: null, // Set to null for copied break times as they will be new entries
            })),
          }
    );

    setLocalAvailableTimes(updatedTimes);
    onChange(updatedTimes);
  };

  const getDayInfo = (dayOfWeek: string) => {
    return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek);
  };

  const getCurrentDayData = () => {
    if (!localAvailableTimes || localAvailableTimes.length === 0) return null;
    return localAvailableTimes.find((time) => time.dayOfWeek === activeDay);
  };

  const getDayStatus = (dayOfWeek: string) => {
    if (!localAvailableTimes || localAvailableTimes.length === 0) return "";
    const day = localAvailableTimes.find(
      (time) => time.dayOfWeek === dayOfWeek
    );
    if (!day) return "";
    if (day.isClosed) return "Closed";
    if (day.is24Hours) return "24/7";
    return `${day.openTime}-${day.closeTime}`;
  };

  const toggleBreaksExpanded = (dayOfWeek: string) => {
    setExpandedBreaks((prev) => ({ ...prev, [dayOfWeek]: !prev[dayOfWeek] }));
  };

  const currentDay = getCurrentDayData();

  // Early return if data is not loaded yet
  if (!localAvailableTimes || localAvailableTimes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-green-50 p-4 rounded-xl border border-green-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-4 h-4 text-green-600 mr-2" />
            Operating Hours
          </h3>
          <div className="text-center py-8 text-gray-500">
            Loading schedule...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-green-50 p-4 rounded-xl border border-green-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-4 h-4 text-green-600 mr-2" />
          Operating Hours
        </h3>

        {/* Day Tabs - Compact horizontal layout */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAYS_OF_WEEK.map((day) => {
            const isActive = activeDay === day.value;
            const status = getDayStatus(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => setActiveDay(day.value)}
                className={`p-2 text-sm rounded-lg border transition-all ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                <div className="font-medium">{day.label}</div>
                <div
                  className={`text-sm mt-1 ${
                    isActive ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {status}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Day Configuration */}
        {currentDay && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Day Header with Actions */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-600" />
                {getDayInfo(activeDay)?.fullLabel}
              </h4>
              <button
                type="button"
                onClick={() => copyToAllDays(activeDay)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy to All
              </button>
            </div>

            {/* Inline Day Configuration */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CheckboxField
                label="Closed"
                checked={currentDay.isClosed}
                onChange={(checked) =>
                  updateAvailableTime(activeDay, {
                    isClosed: checked,
                    is24Hours: checked ? false : currentDay.is24Hours,
                  })
                }
              />

              <CheckboxField
                label="24 Hours"
                checked={currentDay.is24Hours}
                disabled={currentDay.isClosed}
                onChange={(checked) =>
                  updateAvailableTime(activeDay, {
                    is24Hours: checked,
                    isClosed: checked ? false : currentDay.isClosed,
                  })
                }
              />

              {!currentDay.isClosed && !currentDay.is24Hours && (
                <>
                  <InputField
                    label="Open"
                    type="time"
                    value={currentDay.openTime}
                    onChange={(value) =>
                      updateAvailableTime(activeDay, { openTime: value })
                    }
                    required
                  />

                  <InputField
                    label="Close"
                    type="time"
                    value={currentDay.closeTime}
                    onChange={(value) =>
                      updateAvailableTime(activeDay, { closeTime: value })
                    }
                    required
                  />
                </>
              )}
            </div>

            {/* Break Times - Collapsible */}
            {!currentDay.isClosed && !currentDay.is24Hours && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => toggleBreaksExpanded(activeDay)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    {expandedBreaks[activeDay] ? (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-1" />
                    )}
                    <Coffee className="w-4 h-4 mr-1 text-amber-600" />
                    Break Times ({currentDay.breakTimes.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => addBreakTime(activeDay)}
                    className="flex items-center text-sm text-green-600 hover:text-green-800 px-2 py-1 rounded border border-green-200 hover:bg-green-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </button>
                </div>

                {expandedBreaks[activeDay] && (
                  <div className="space-y-2 pl-4">
                    {currentDay.breakTimes.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No break times set
                      </p>
                    ) : (
                      currentDay.breakTimes.map((breakTime, breakIndex) => (
                        <div
                          key={breakIndex}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <InputField
                            label="Start"
                            type="time"
                            value={breakTime.breakStart}
                            onChange={(value) =>
                              updateBreakTime(activeDay, breakIndex, {
                                breakStart: value,
                              })
                            }
                            required
                          />
                          <InputField
                            label="End"
                            type="time"
                            value={breakTime.breakEnd}
                            onChange={(value) =>
                              updateBreakTime(activeDay, breakIndex, {
                                breakEnd: value,
                              })
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeBreakTime(activeDay, breakIndex)
                            }
                            className="flex items-center justify-center w-6 h-6 text-red-600 hover:text-red-800 hover:bg-red-50 rounded mt-4"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Status Messages - Compact */}
            {currentDay.isClosed && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-sm text-gray-600 text-center">
                Closed on {getDayInfo(activeDay)?.fullLabel}
              </div>
            )}

            {currentDay.is24Hours && (
              <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-700 text-center">
                Open 24 hours
              </div>
            )}
          </div>
        )}

        {/* Quick Actions - Compact */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Quick Setup
          </h4>
          <div className="flex flex-wrap gap-2 justify-between">
            <button
              type="button"
              onClick={() => {
                const businessHours = localAvailableTimes.map((time) => ({
                  ...time,
                  openTime: "08:00",
                  closeTime: "16:00",
                  is24Hours: false,
                  isClosed:
                    time.dayOfWeek === "SUNDAY" ||
                    time.dayOfWeek === "SATURDAY",
                  breakTimes:
                    time.dayOfWeek !== "SUNDAY"
                      ? [
                          {
                            breakId: null,
                            breakStart: "12:00",
                            breakEnd: "13:00",
                          },
                        ]
                      : [],
                }));
                setLocalAvailableTimes(businessHours);
                onChange(businessHours);
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Business (8-4)
            </button>

            <button
              type="button"
              onClick={() => {
                const businessHours = localAvailableTimes.map((time) => ({
                  ...time,
                  openTime: "09:00",
                  closeTime: "17:00",
                  is24Hours: false,
                  isClosed: time.dayOfWeek === "SUNDAY",
                  breakTimes:
                    time.dayOfWeek !== "SUNDAY"
                      ? [
                          {
                            breakId: null,
                            breakStart: "12:00",
                            breakEnd: "13:00",
                          },
                        ]
                      : [],
                }));
                setLocalAvailableTimes(businessHours);
                onChange(businessHours);
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Business (9-5)
            </button>

            <button
              type="button"
              onClick={() => {
                const allOpen = localAvailableTimes.map((time) => ({
                  ...time,
                  openTime: "00:00",
                  closeTime: "23:59",
                  is24Hours: true,
                  isClosed: false,
                  breakTimes: [],
                }));
                setLocalAvailableTimes(allOpen);
                onChange(allOpen);
              }}
              className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              24/7
            </button>

            <button
              type="button"
              onClick={() => {
                const clearBreaks = localAvailableTimes.map((time) => ({
                  ...time,
                  breakTimes: [],
                }));
                setLocalAvailableTimes(clearBreaks);
                onChange(clearBreaks);
                setExpandedBreaks({});
              }}
              className="px-2 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Clear Breaks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableTimeConfiguration;
