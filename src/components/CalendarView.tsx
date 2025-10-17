// components/CalendarView.tsx
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface Booking {
  id: number;
  date: string;
  title: string;
}

interface CalendarViewProps {
  bookings: Booking[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

const CalendarView = ({ bookings, onDateSelect, selectedDate }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Function to get the month and year as string
  const getMonthYearString = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
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
    return bookings.filter(booking => booking.date === date);
  };

  // Function to handle date click
  const handleDateClick = (date: string) => {
    onDateSelect(date);
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const todayFormatted = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border rounded-lg opacity-30"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const dateBookings = getBookingsForDate(dateStr);
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === todayFormatted;
      
      days.push(
        <div
          key={day}
          className={`p-2 border rounded-lg cursor-pointer transition-colors min-h-[80px] ${
            isSelected 
              ? 'bg-primary-100 border-primary-500' 
              : 'hover:bg-gray-50'
          } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${
              isSelected ? 'text-primary-700' : 
              isToday ? 'text-blue-700' : 'text-gray-700'
            }`}>
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
              {dateBookings.slice(0, 2).map(booking => (
                <div key={booking.id} className="text-xs text-gray-600 truncate">
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
        <h3 className="text-lg font-semibold">{getMonthYearString(currentDate)}</h3>
        <div className="space-x-2">
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
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {generateCalendarDays()}
      </div>
    </CardContent>
  );
};

export default CalendarView;