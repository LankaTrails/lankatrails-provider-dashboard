import { useEffect, useState } from "react";
import { AlertCircle, CalendarCheck, Loader2, Star, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { getInsights, type ProviderInsights, type ServiceCategoryName } from "@/services/insights";
import { errorMessage } from "@/lib/apiError";
import { formatCurrency, formatDate } from "@/lib/format";

/** KPIs, monthly chart, top services and latest reviews for all services or one category. */
const InsightsView = ({ category }: { category?: ServiceCategoryName }) => {
  const [insights, setInsights] = useState<ProviderInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setInsights(null);
    setError(null);
    getInsights(category)
      .then((data) => active && setInsights(data))
      .catch((loadError) => active && setError(errorMessage(loadError, "Could not load analytics")));
    return () => {
      active = false;
    };
  }, [category]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!insights) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading analytics...
      </div>
    );
  }

  const kpis = [
    { label: "Revenue", value: formatCurrency(insights.totalRevenue), icon: Wallet },
    { label: "Bookings", value: String(insights.totalBookings), icon: CalendarCheck,
      note: `${insights.upcomingBookings} upcoming` },
    { label: "Average rating", value: insights.averageRating != null ? insights.averageRating.toFixed(1) : "—", icon: Star,
      note: `${insights.reviewCount} review${insights.reviewCount === 1 ? "" : "s"}` },
    { label: "Active services", value: `${insights.activeServices} / ${insights.totalServices}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, note }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {note && <p className="text-xs text-gray-500">{note}</p>}
              </div>
              <Icon className="h-8 w-8 text-primary-500" />
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsCharts monthly={insights.monthly} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top services</CardTitle>
            <CardDescription>By revenue from paid bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.topServices.length === 0 ? (
              <p className="text-sm text-gray-500">No paid bookings yet.</p>
            ) : (
              <ul className="divide-y">
                {insights.topServices.map((s) => (
                  <li key={s.serviceId} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-medium">{s.serviceName}</span>
                    <span className="text-gray-600">
                      {s.bookings} booking{s.bookings === 1 ? "" : "s"} · {formatCurrency(s.revenue)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest reviews</CardTitle>
            <CardDescription>What tourists are saying</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.recentReviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-3">
                {insights.recentReviews.map((r) => (
                  <li key={r.reviewId} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.serviceName}</span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" /> {r.rate}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{r.review}</p>
                    <p className="mt-1 text-xs text-gray-500">{r.touristName} · {formatDate(r.createdDate)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsView;
