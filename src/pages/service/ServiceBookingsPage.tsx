import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, Calendar } from "lucide-react";
import CalendarView from '@/components/CalendarView';
import ProviderTopBar from "@/components/provider/ProviderTopBar";

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const ServiceBookingsPage = () => {
  const { serviceType } = useParams();
  const title = formatServiceTitle(serviceType);

  // Generate mock data based on service type with current dates
  const generateMockBookings = (serviceType: string) => {
    const today = new Date();
    const getDateString = (daysOffset: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() + daysOffset);
      return date.toISOString().split('T')[0];
    };

    const baseBookings = {
      'activity': [
        {
          id: 1,
          customer: "John Smith",
          service: "Sigiriya Rock Climbing",
          date: getDateString(2),
          status: "confirmed",
          amount: "85",
          slots: [
            { start: "09:00", end: "12:00", duration: "3h", bookings: 1, details: ["John Smith - Rock climbing with safety gear"], customer: "John Smith", amount: "85", status: "confirmed" as const },
            { start: "14:00", end: "17:00", duration: "3h", bookings: 2, details: ["Group adventure - 4 climbers", "Professional guide included"], customer: "Adventure Group", amount: "200", status: "confirmed" as const }
          ]
        },
        {
          id: 2,
          customer: "Emma Wilson",
          service: "White Water Rafting",
          date: getDateString(5),
          status: "pending",
          amount: "120",
          slots: [
            { start: "08:00", end: "12:00", duration: "4h", bookings: 1, details: ["Emma Wilson - Kelani River rafting", "Includes: Equipment & lunch"], customer: "Emma Wilson", amount: "120", status: "pending" as const }
          ]
        },
        {
          id: 3,
          customer: "David Chen",
          service: "Zip Lining Adventure",
          date: getDateString(2),
          status: "completed",
          amount: "95",
          slots: [
            { start: "10:00", end: "11:30", duration: "1.5h", bookings: 1, details: ["David Chen - Zip line through forest canopy"], customer: "David Chen", amount: "95", status: "completed" as const }
          ]
        },
        {
          id: 4,
          customer: "Sarah Miller",
          service: "Hiking & Trekking",
          date: getDateString(7),
          status: "confirmed",
          amount: "75",
          slots: [
            { start: "06:00", end: "14:00", duration: "8h", bookings: 1, details: ["Sarah Miller - Adam's Peak sunrise trek", "Guide & breakfast included"], customer: "Sarah Miller", amount: "75", status: "confirmed" as const }
          ]
        }
      ],
      'tour-guides': [
        {
          id: 1,
          customer: "Michael Brown",
          service: "Cultural Triangle Tour",
          date: getDateString(3),
          status: "confirmed",
          amount: "150",
          slots: [
            { start: "08:00", end: "18:00", duration: "10h", bookings: 1, details: ["Michael Brown - Sigiriya, Dambulla, Polonnaruwa", "Private guide with AC vehicle"], customer: "Michael Brown", amount: "150", status: "confirmed" as const }
          ]
        },
        {
          id: 2,
          customer: "Lisa Johnson",
          service: "Kandy City Tour",
          date: getDateString(1),
          status: "pending",
          amount: "80",
          slots: [
            { start: "09:00", end: "15:00", duration: "6h", bookings: 1, details: ["Lisa Johnson - Temple of Tooth, Royal Gardens", "English speaking guide"], customer: "Lisa Johnson", amount: "80", status: "pending" as const }
          ]
        },
        {
          id: 3,
          customer: "Robert Wilson",
          service: "Galle Fort Walking Tour",
          date: getDateString(3),
          status: "confirmed",
          amount: "45",
          slots: [
            { start: "16:00", end: "18:00", duration: "2h", bookings: 1, details: ["Robert Wilson - Historical fort tour", "Photography spots included"], customer: "Robert Wilson", amount: "45", status: "confirmed" as const }
          ]
        },
        {
          id: 4,
          customer: "Anderson Family",
          service: "Wildlife Safari Guide",
          date: getDateString(1),
          status: "confirmed",
          amount: "200",
          slots: [
            { start: "05:30", end: "09:30", duration: "4h", bookings: 4, details: ["Anderson Family - Yala National Park", "Jeep safari with experienced guide"], customer: "Anderson Family", amount: "200", status: "confirmed" as const },
            { start: "15:00", end: "19:00", duration: "4h", bookings: 2, details: ["Evening safari - Bird watching", "Sunset photography session"], customer: "Photography Group", amount: "120", status: "confirmed" as const }
          ]
        }
      ],
      'transportation': [
        {
          id: 1,
          customer: "James Taylor",
          service: "Airport Transfer",
          date: getDateString(1),
          status: "confirmed",
          amount: "35",
          slots: [
            { start: "14:00", end: "16:00", duration: "2h", bookings: 1, details: ["James Taylor - BIA to Colombo hotel", "Luxury sedan with AC"], customer: "James Taylor", amount: "35", status: "confirmed" as const }
          ]
        },
        {
          id: 2,
          customer: "Maria Garcia",
          service: "City to City Transfer",
          date: getDateString(4),
          status: "pending",
          amount: "85",
          slots: [
            { start: "08:00", end: "12:00", duration: "4h", bookings: 1, details: ["Maria Garcia - Colombo to Kandy", "Van with driver"], customer: "Maria Garcia", amount: "85", status: "pending" as const }
          ]
        },
        {
          id: 3,
          customer: "Thompson Group",
          service: "Tour Vehicle Rental",
          date: getDateString(2),
          status: "confirmed",
          amount: "120",
          slots: [
            { start: "07:00", end: "19:00", duration: "12h", bookings: 6, details: ["Thompson Group - Full day tour vehicle", "Mini bus with experienced driver"], customer: "Thompson Group", amount: "120", status: "confirmed" as const }
          ]
        },
        {
          id: 4,
          customer: "Kevin Lee",
          service: "Tuk Tuk City Tour",
          date: getDateString(2),
          status: "completed",
          amount: "25",
          slots: [
            { start: "10:00", end: "13:00", duration: "3h", bookings: 2, details: ["Kevin Lee - Colombo city highlights", "Traditional tuk tuk experience"], customer: "Kevin Lee", amount: "25", status: "completed" as const }
          ]
        }
      ],
      'accommodation': [
        {
          id: 1,
          customer: "Williams Family",
          service: "Beach Villa Rental",
          date: getDateString(5),
          status: "confirmed",
          amount: "180",
          slots: [
            { start: "15:00", end: "11:00", duration: "20h", bookings: 4, details: ["Williams Family - 3BR beachfront villa", "Private pool, chef service available"], customer: "Williams Family", amount: "180", status: "confirmed" as const }
          ]
        },
        {
          id: 2,
          customer: "Sophie Martin",
          service: "Boutique Hotel Room",
          date: getDateString(3),
          status: "pending",
          amount: "95",
          slots: [
            { start: "14:00", end: "12:00", duration: "22h", bookings: 2, details: ["Sophie Martin - Deluxe room with garden view", "Breakfast included"], customer: "Sophie Martin", amount: "95", status: "pending" as const }
          ]
        },
        {
          id: 3,
          customer: "Ahmed Hassan",
          service: "Eco Lodge Stay",
          date: getDateString(1),
          status: "confirmed",
          amount: "75",
          slots: [
            { start: "16:00", end: "10:00", duration: "18h", bookings: 1, details: ["Ahmed Hassan - Tree house accommodation", "Nature walks included"], customer: "Ahmed Hassan", amount: "75", status: "confirmed" as const }
          ]
        },
        {
          id: 4,
          customer: "Chen Family",
          service: "Heritage Homestay",
          date: getDateString(6),
          status: "confirmed",
          amount: "60",
          slots: [
            { start: "17:00", end: "09:00", duration: "16h", bookings: 3, details: ["Chen Family - Traditional Sri Lankan home", "Home-cooked meals included"], customer: "Chen Family", amount: "60", status: "confirmed" as const }
          ]
        }
      ],
      'food-beverage': [
        {
          id: 1,
          customer: "Daniel Rodriguez",
          service: "Cooking Class Experience",
          date: getDateString(2),
          status: "confirmed",
          amount: "45",
          slots: [
            { start: "10:00", end: "14:00", duration: "4h", bookings: 1, details: ["Daniel Rodriguez - Traditional Sri Lankan cooking", "Market visit + cooking + lunch"], customer: "Daniel Rodriguez", amount: "45", status: "confirmed" as const }
          ]
        },
        {
          id: 2,
          customer: "Isabella White",
          service: "Tea Plantation Tour",
          date: getDateString(4),
          status: "pending",
          amount: "35",
          slots: [
            { start: "09:00", end: "12:00", duration: "3h", bookings: 1, details: ["Isabella White - Tea factory & tasting", "Nuwara Eliya highlands"], customer: "Isabella White", amount: "35", status: "pending" as const }
          ]
        },
        {
          id: 3,
          customer: "Kumar Family",
          service: "Spice Garden Tour",
          date: getDateString(2),
          status: "confirmed",
          amount: "30",
          slots: [
            { start: "14:00", end: "16:30", duration: "2.5h", bookings: 4, details: ["Kumar Family - Spice garden in Matale", "Spice products included"], customer: "Kumar Family", amount: "30", status: "confirmed" as const }
          ]
        },
        {
          id: 4,
          customer: "Oliver Green",
          service: "Street Food Tour",
          date: getDateString(1),
          status: "completed",
          amount: "25",
          slots: [
            { start: "18:00", end: "21:00", duration: "3h", bookings: 1, details: ["Oliver Green - Colombo street food experience", "Local guide with food tastings"], customer: "Oliver Green", amount: "25", status: "completed" as const }
          ]
        }
      ]
    };

    // Add additional bookings for same dates to test multiple bookings per date
    const additionalBookings = [
      {
        id: 101,
        customer: "Alex Thompson",
        service: "Morning Adventure",
        date: getDateString(2), // Same date as some existing bookings
        status: "pending",
        amount: "65",
        slots: [
          { start: "07:00", end: "09:00", duration: "2h", bookings: 1, details: ["Alex Thompson - Early morning activity", "Equipment provided"], customer: "Alex Thompson", amount: "65", status: "pending" as const }
        ]
      },
      {
        id: 102,
        customer: "Rachel Green",
        service: "Afternoon Session",
        date: getDateString(1), // Same date as some existing bookings
        status: "confirmed",
        amount: "55",
        slots: [
          { start: "13:00", end: "15:30", duration: "2.5h", bookings: 1, details: ["Rachel Green - Afternoon adventure", "Refreshments included"], customer: "Rachel Green", amount: "55", status: "confirmed" as const }
        ]
      },
      {
        id: 103,
        customer: "Mark Davis",
        service: "Evening Experience",
        date: getDateString(3), // Same date as some existing bookings
        status: "confirmed",
        amount: "70",
        slots: [
          { start: "17:30", end: "19:30", duration: "2h", bookings: 1, details: ["Mark Davis - Sunset experience", "Photography session included"], customer: "Mark Davis", amount: "70", status: "confirmed" as const }
        ]
      }
    ];

    const allBookings = [...baseBookings[serviceType as keyof typeof baseBookings] || baseBookings['activity'], ...additionalBookings];
    return allBookings;
  };

  const recentBookings = generateMockBookings(serviceType || 'activity');
  
  const calendarBookings = recentBookings.map((b) => ({ 
    id: b.id, 
    date: b.date, 
    title: b.service,
    customer: b.customer,
    amount: b.amount,
    status: b.status as 'confirmed' | 'pending' | 'completed' | 'cancelled',
    slots: b.slots
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
          <CardDescription>
            Manage all your bookings and reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{booking.customer}</h4>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {booking.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "default"
                        : booking.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-lg font-semibold text-primary-500">
                    {booking.amount}
                  </p>
                  <div className="space-x-2">
                    {booking.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <CalendarView bookings={calendarBookings} />
      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
          <CardDescription>
            Manage your availability and schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-500" />
              <p className="text-lg font-medium">Calendar View</p>
              <p className="text-sm">Manage your availability and bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceBookingsPage;
