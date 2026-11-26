import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarCheck, Star } from "lucide-react";
import { getInsights, CATEGORY_TO_SLUG, type ProviderInsights } from "@/services/insights";
import { formatDate } from "@/lib/format";

type Item = { key: string; icon: "booking" | "review"; title: string; detail: string; date: string; to: string };

/** Header bell listing the latest bookings and reviews (newest first). */
const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getInsights()
      .then((insights: ProviderInsights) => {
        const bookings: Item[] = insights.recentBookings.map((b) => ({
          key: `b${b.bookingId}`, icon: "booking", title: `${b.touristName} booked ${b.serviceName}`,
          detail: `${b.status.toLowerCase()} · ${formatDate(b.startDateTime)}`, date: b.startDateTime,
          to: `/provider/${CATEGORY_TO_SLUG[b.category]}/${b.serviceId}/bookings`,
        }));
        const reviews: Item[] = insights.recentReviews.map((r) => ({
          key: `r${r.reviewId}`, icon: "review", title: `${r.touristName} rated ${r.serviceName} ${r.rate}/5`,
          detail: r.review, date: r.createdDate, to: "/provider/analytics",
        }));
        setItems([...bookings, ...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8));
      })
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {!!items?.length && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
          <p className="border-b px-4 py-2 text-sm font-semibold">Recent activity</p>
          {items === null ? (
            <p className="px-4 py-3 text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No bookings or reviews yet.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {items.map((item) => (
                <li key={item.key}>
                  <Link to={item.to} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-gray-50">
                    {item.icon === "booking" ? (
                      <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Star className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    )}
                    <span className="text-sm">
                      <span className="block font-medium">{item.title}</span>
                      <span className="line-clamp-2 text-gray-500">{item.detail}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
