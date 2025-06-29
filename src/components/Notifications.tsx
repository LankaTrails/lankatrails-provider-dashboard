import { Bell } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

const sampleNotifications = [
  { id: 1, message: 'New booking from David', type: 'booking' },
  { id: 2, message: 'Tourist canceled booking #1234', type: 'cancellation' },
  { id: 3, message: 'New message from Emma', type: 'chat' },
];

const Notifications = () => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="relative cursor-pointer p-2 rounded-full hover:bg-muted">
        <Bell className="w-5 h-5" />
        {sampleNotifications.length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 py-0.5 flex items-center justify-center text-[10px]">
            {sampleNotifications.length}
          </Badge>
        )}
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-72 p-2">
      <h4 className="font-medium mb-2">Notifications</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {sampleNotifications.map((n) => (
          <div key={n.id} className="p-2 rounded-md hover:bg-muted cursor-pointer text-sm">
            {n.message}
          </div>
        ))}
        {sampleNotifications.length === 0 && (
          <p className="text-sm text-muted-foreground">You're all caught up!</p>
        )}
      </div>
    </PopoverContent>
  </Popover>
);

export default Notifications;
