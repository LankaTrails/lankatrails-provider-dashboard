import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, Users, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeSlot {
  start: string;
  end: string;
  duration?: string;
  bookings: number;
  details: string[];
  customer?: string;
  amount?: string;
  status?: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

interface Booking {
  id: number;
  date: string; // ISO format yyyy-mm-dd
  title: string;
  customer?: string;
  amount?: string;
  status?: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  slots?: TimeSlot[];
}

interface CalendarViewProps {
  bookings: Booking[];
  onDateClick?: (date: Date) => void;
}

/**
 * Provider calendar component with simple daily / weekly switch.
 * Uses react-day-picker (wrapped by shadcn `Calendar`).
 * Only frontend-side highlighting based on sample data.
 */
const CalendarView: React.FC<CalendarViewProps> = ({ bookings, onDateClick }) => {
  const [view, setView] = useState<'daily' | 'weekly'>('weekly');
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedDateSchedule, setSelectedDateSchedule] = useState<Booking[]>([]);
  const [selectedDateString, setSelectedDateString] = useState<string>('');

  const toggleView = (v: 'daily' | 'weekly') => () => setView(v);

  const selectedISO = selected ? format(selected, 'yyyy-MM-dd') : '';
  const todaysBookings = bookings.filter((b) =>
    view === 'daily'
      ? b.date === selectedISO
      : // weekly view: is in same week as selected date
        (() => {
          const date = new Date(b.date);
          const start = selected ? new Date(selected) : new Date();
          const startOfWeek = new Date(start);
          startOfWeek.setDate(start.getDate() - start.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return date >= startOfWeek && date <= endOfWeek;
        })()
  );

  // Handle calendar date click to show schedule
  const handleCalendarDateClick = (date: Date | undefined) => {
    setSelected(date);
    if (onDateClick) {
      onDateClick(date!);
    }
    
    if (date) {
      const dateISO = format(date, 'yyyy-MM-dd');
      const dayBookings = bookings.filter(b => b.date === dateISO);
      
      // Always show dialog, even if no bookings (to show empty state)
      setSelectedDateString(format(date, 'EEEE, MMMM do, yyyy'));
      setSelectedDateSchedule(dayBookings);
      setScheduleDialogOpen(true);
    }
  };

  // Get status color for badges
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === 'daily' ? 'default' : 'outline'}
            onClick={toggleView('daily')}
          >
            Daily
          </Button>
          <Button
            size="sm"
            variant={view === 'weekly' ? 'default' : 'outline'}
            onClick={toggleView('weekly')}
          >
            Weekly
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleCalendarDateClick}
          modifiers={{ booked: bookings.map((b) => new Date(b.date)) }}
          modifiersClassNames={{ booked: 'bg-blue-100 text-blue-900 font-semibold cursor-pointer hover:bg-blue-200' }}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <h4 className="font-semibold mb-2">
          {view === 'daily' ? 'Bookings for Selected Day' : 'Bookings this Week'}
        </h4>
        {todaysBookings.length ? (
          todaysBookings.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-lg border flex items-center justify-between bg-muted/50"
            >
              <span>{b.title}</span>
              <span className="text-sm text-muted-foreground">
                {b.date}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No bookings.</p>
        )}
      </div>

      {/* Schedule Details Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Schedule for {selectedDateString}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <AnimatePresence>
              {selectedDateSchedule.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{booking.title}</h3>
                      {booking.customer && (
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{booking.customer}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {booking.status && (
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      )}
                      {booking.amount && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          <span>LKR {booking.amount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {booking.slots && booking.slots.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Slots
                      </h4>
                      <div className="grid gap-3">
                        {booking.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-gray-800">
                                  {slot.start} - {slot.end}
                                </span>
                                {slot.duration && (
                                  <Badge variant="outline" className="text-xs">
                                    {slot.duration}
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {slot.bookings} booking{slot.bookings !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            
                            {slot.details && slot.details.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-600 mb-1">Booking Details:</p>
                                <div className="space-y-1">
                                  {slot.details.map((detail, detailIndex) => (
                                    <div
                                      key={detailIndex}
                                      className="text-sm text-gray-700 bg-gray-50 rounded px-2 py-1"
                                    >
                                      {detail}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {selectedDateSchedule.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No bookings scheduled</p>
                <p className="text-sm">This date has no scheduled bookings or activities.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CalendarView;
