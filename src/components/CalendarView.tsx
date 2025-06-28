import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface Booking {
  id: number;
  date: string; // ISO format yyyy-mm-dd
  title: string;
}

interface CalendarViewProps {
  bookings: Booking[];
}

/**
 * Provider calendar component with simple daily / weekly switch.
 * Uses react-day-picker (wrapped by shadcn `Calendar`).
 * Only frontend-side highlighting based on sample data.
 */
const CalendarView: React.FC<CalendarViewProps> = ({ bookings }) => {
  const [view, setView] = useState<'daily' | 'weekly'>('weekly');
  const [selected, setSelected] = useState<Date | undefined>(new Date());

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
          onSelect={setSelected}
          modifiers={{ booked: bookings.map((b) => new Date(b.date)) }}
          modifiersClassNames={{ booked: 'bg-primary-200 text-primary-900' }}
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
    </Card>
  );
};

export default CalendarView;
