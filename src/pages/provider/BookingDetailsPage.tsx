import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CalendarView from "@/components/CalendarView";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { findServiceById } from "@/services/services";

// Dummy data for demonstration
const bookings = [
  {
    id: 1,
    customer: "John Smith",
    service: "Sigiriya Rock Climb Guide",
    serviceId: 101,
    serviceType: "tour-guide",
    type: "activity",
    dateFrom: "2025-07-05",
    dateTo: "2025-07-05",
    status: "pending",
    amount: "85",
    slots: [
      { date: "2025-07-05", start: "09:00", end: "10:00", bookings: 2, details: ["Booking A", "Booking B"] },
      { date: "2025-07-05", start: "10:00", end: "11:00", bookings: 1, details: ["Booking C"] },
    ],
  },
  {
    id: 2,
    customer: "Emma Wilson",
    service: "Airport Transfer",
    serviceId: 202,
    serviceType: "transport",
    type: "transport",
    dateFrom: "2025-07-06",
    dateTo: "2025-07-06",
    status: "confirmed",
    amount: "150",
    slots: [
      { date: "2025-07-06", start: "08:00", end: "12:00", duration: "4h", bookings: 1, details: ["Booking D"] },
    ],
  },
  // ... more bookings
];

// Abstracted booking fetcher (replace with backend call in future)
const getBookingById = (id) => bookings.find((b) => b.id === Number(id));

const BookingDetailsPage = () => {
  const { id } = useParams();
  const booking = getBookingById(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);

  useEffect(() => {
    if (booking && booking.serviceId && booking.serviceType) {
      findServiceById(booking.serviceType, booking.serviceId)
        .then(setServiceDetails)
        .catch(() => setServiceDetails(null));
    }
  }, [booking]);

  if (!booking) return <div>Booking not found.</div>;

  // Prepare calendar bookings for CalendarView
  const calendarBookings = booking.slots.map((slot, idx) => ({
    id: idx,
    date: slot.date,
    title: booking.service,
  }));

  // Determine if calendar and popup should show time slots or durations
  const isTimeSlotType = ["activity", "tour guide", "food", "beverage"].includes(booking.type);
  const isTransportType = booking.type === "transport";

  // When a date is clicked in the calendar, show slots for that date
  const handleDateClick = (dateObj) => {
    if (!dateObj) return;
    const dateISO = dateObj.toISOString().slice(0, 10);
    setSelectedDate(dateISO);
    // Show all slots for this date in the dialog
    const slotsForDate = booking.slots.filter((slot) => slot.date === dateISO);
    if (slotsForDate.length > 0) {
      setSelectedSlot(slotsForDate);
      setDialogOpen(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {serviceDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div><b>Name:</b> {serviceDetails.serviceName || booking.service}</div>
            {serviceDetails.tourGuideType && <div><b>Tour Guide Type:</b> {serviceDetails.tourGuideType}</div>}
            {serviceDetails.languages && <div><b>Languages:</b> {serviceDetails.languages.join(", ")}</div>}
            {/* Add more fields as needed */}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><b>Customer:</b> {booking.customer}</div>
          <div><b>Service:</b> {booking.service}</div>
          <div><b>Booking Dates:</b> {booking.dateFrom} to {booking.dateTo}</div>
          <div><b>Status:</b> {booking.status}</div>
          <div><b>Amount:</b> LKR {booking.amount}</div>
          {booking.status === "pending" && (
            <div className="space-x-2 mt-2">
              <Button variant="success">Accept</Button>
              <Button variant="destructive">Decline</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Calendar for all types */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView
            bookings={calendarBookings}
            onDateClick={handleDateClick}
          />
        </CardContent>
      </Card>
      {/* Slot details popup */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Slot Details</DialogTitle>
          {selectedSlot && Array.isArray(selectedSlot) && selectedSlot.length > 0 && (
            <div className="space-y-4">
              {selectedSlot.map((slot, idx) => (
                <div key={idx} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  {isTimeSlotType && (
                    <>
                      <div><b>Start:</b> {slot.start}</div>
                      <div><b>End:</b> {slot.end}</div>
                    </>
                  )}
                  {isTransportType && (
                    <>
                      <div><b>Start:</b> {slot.start}</div>
                      <div><b>End:</b> {slot.end}</div>
                      <div><b>Duration:</b> {slot.duration}</div>
                    </>
                  )}
                  <div><b>Bookings:</b> {slot.bookings}</div>
                  <div><b>Details:</b>
                    <ul className="list-disc ml-6">
                      {slot.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDetailsPage;
