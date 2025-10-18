// components/CalendarView.tsx
import { CardContent } from "@/components/ui/card";
import { useState } from "react";

interface Booking {
  id: number;
  date: string;
  title: string;
}

interface CalendarViewProps {
  bookings: Booking[];
  onDateSelect: (date: string) => void;
  onDateRangeSelect?: (startDate: string, endDate: string) => void;
  selectedDate: string | null;
  selectedDateRange?: { start: string; end: string } | null;
}

const CalendarView = ({
  bookings,
  onDateSelect,
  onDateRangeSelect,
  selectedDate,
  selectedDateRange,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rangeSelectionMode, setRangeSelectionMode] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Function to get the month and year as string
  const getMonthYearString = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Function to get the number of days in a month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Function to get the day of the week for the first day of the month
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Function to check if a date has bookings
  const getBookingsForDate = (date: string) => {
    return bookings.filter((booking) => booking.date === date);
  };

  // Function to handle date click
  const handleDateClick = (date: string) => {
    if (rangeSelectionMode) {
      if (!rangeStart) {
        // First click - set range start
        setRangeStart(date);
      } else {
        // Second click - complete range selection
        const startDate = rangeStart < date ? rangeStart : date;
        const endDate = rangeStart < date ? date : rangeStart;

        if (onDateRangeSelect) {
          onDateRangeSelect(startDate, endDate);
        }

        // Reset range selection
        setRangeStart(null);
        setRangeSelectionMode(false);
      }
    } else {
      // Single date selection
      onDateSelect(date);
    }
  };

  // Function to toggle range selection mode
  const toggleRangeMode = () => {
    setRangeSelectionMode(!rangeSelectionMode);
    setRangeStart(null);
  };

  // Function to check if date is in selected range
  const isDateInRange = (date: string) => {
    if (!selectedDateRange) return false;
    return date >= selectedDateRange.start && date <= selectedDateRange.end;
  };

  // Function to check if date is range boundary
  const isRangeBoundary = (date: string) => {
    if (!selectedDateRange) return false;
    return date === selectedDateRange.start || date === selectedDateRange.end;
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const todayFormatted = formatDate(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="p-2 border rounded-lg opacity-30"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const dateBookings = getBookingsForDate(dateStr);
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === todayFormatted;
      const isInRange = isDateInRange(dateStr);
      const isBoundary = isRangeBoundary(dateStr);
      const isRangeStart = rangeStart === dateStr;

      let cellClasses = `p-2 border rounded-lg cursor-pointer transition-colors min-h-[80px] `;

      if (rangeSelectionMode) {
        cellClasses += `hover:bg-blue-100 `;
        if (isRangeStart) {
          cellClasses += `bg-blue-200 border-blue-400 `;
        } else {
          cellClasses += `hover:bg-blue-50 `;
        }
      } else {
        if (isSelected) {
          cellClasses += `bg-primary-100 border-primary-500 `;
        } else if (isInRange) {
          if (isBoundary) {
            cellClasses += `bg-primary-200 border-primary-400 `;
          } else {
            cellClasses += `bg-primary-50 border-primary-200 `;
          }
        } else {
          cellClasses += `hover:bg-gray-50 `;
        }
      }

      if (isToday && !isSelected && !isInRange) {
        cellClasses += `bg-blue-50 border-blue-200 `;
      }

      days.push(
        <div
          key={day}
          className={cellClasses}
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${
                isSelected || isBoundary
                  ? "text-primary-700"
                  : isRangeStart
                  ? "text-blue-700"
                  : isInRange
                  ? "text-primary-600"
                  : isToday
                  ? "text-blue-700"
                  : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {dateBookings.length > 0 && (
              <span className="text-xs bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {dateBookings.length}
              </span>
            )}
          </div>
          {dateBookings.length > 0 && (
            <div className="mt-1 space-y-1">
              {dateBookings.slice(0, 2).map((booking) => (
                <div
                  key={booking.id}
                  className="text-xs text-gray-600 truncate"
                >
                  • {booking.title}
                </div>
              ))}
              {dateBookings.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dateBookings.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <CardContent>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {getMonthYearString(currentDate)}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 text-xs border rounded transition-colors ${
              rangeSelectionMode
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "hover:bg-gray-50"
            }`}
            onClick={toggleRangeMode}
          >
            {rangeSelectionMode ? "Cancel Range" : "Select Range"}
          </button>
          <button
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
            onClick={goToPreviousMonth}
          >
            ‹
          </button>
          <button
            className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
            onClick={goToNextMonth}
          >
            ›
          </button>
        </div>
      </div>

      {rangeSelectionMode && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          {rangeStart
            ? `Range start: ${rangeStart}. Click another date to complete the range.`
            : "Range selection mode: Click a date to start selecting a range."}
        </div>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{generateCalendarDays()}</div>
    </CardContent>
  );
};

export default CalendarView;
