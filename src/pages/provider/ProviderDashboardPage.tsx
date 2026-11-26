import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, BarChart3, CalendarCheck, CreditCard, Loader2, MessageSquare, Star, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getInsights, CATEGORY_TO_SLUG, type ProviderInsights } from "@/services/insights";
import { getAccountStatus, type StripeAccountStatus } from "@/services/onboarding";
import { errorMessage } from "@/lib/apiError";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

const statusVariant = (status: string) =>
  status === "CONFIRMED" ? "default" : status === "PENDING" ? "secondary" : "outline";

const ProviderDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<ProviderInsights | null>(null);
  const [payments, setPayments] = useState<StripeAccountStatus | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInsights().then(setInsights).catch((e) => setError(errorMessage(e, "Could not load your dashboard")));
    // Tourists can only book providers who can be paid, so surface missing payment setup here
    getAccountStatus().then(setPayments).catch(() => setPayments(null));
  }, []);

  const paymentsReady = payments?.charges_enabled && payments?.payouts_enabled;

  const stats = insights
    ? [
        { title: "Revenue", value: formatCurrency(insights.totalRevenue), icon: <Wallet className="h-6 w-6" />,
          gradient: "from-emerald-500 to-teal-500" },
        { title: "Bookings", value: String(insights.totalBookings), note: `${insights.upcomingBookings} upcoming`,
          icon: <CalendarCheck className="h-6 w-6" />, gradient: "from-indigo-500 to-blue-500" },
        { title: "Average rating", value: insights.averageRating != null ? insights.averageRating.toFixed(1) : "—",
          note: `${insights.reviewCount} reviews`, icon: <Star className="h-6 w-6" />, gradient: "from-amber-500 to-orange-500" },
        { title: "Active services", value: `${insights.activeServices} / ${insights.totalServices}`,
          icon: <TrendingUp className="h-6 w-6" />, gradient: "from-rose-500 to-pink-500" },
      ]
    : [];

  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome{user?.businessName ? `, ${user.businessName}` : ""}</h1>
        <p className="text-gray-600">Here is how your services are doing.</p>
      </div>

      {payments !== undefined && !paymentsReady && (
        <Alert>
          <CreditCard className="h-4 w-4" />
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>Set up payouts with Stripe so tourists can book and pay for your services online.</span>
            <Button size="sm" asChild>
              <Link to="/provider/onboarding">{payments ? "Finish payment setup" : "Set up payments"}</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!insights && !error ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading your dashboard...
        </div>
      ) : (
        insights && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className={`border-0 bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {stat.note && <p className="text-xs opacity-80">{stat.note}</p>}
                      </div>
                      <div className="rounded-lg bg-white/20 p-2">{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Manage services", icon: TrendingUp, to: "/provider/accommodation" },
                { label: "Messages", icon: MessageSquare, to: "/provider/messages" },
                { label: "Analytics", icon: BarChart3, to: "/provider/analytics" },
                { label: "Payments", icon: CreditCard, to: "/provider/onboarding" },
              ].map(({ label, icon: Icon, to }) => (
                <Button key={label} variant="outline" className="flex h-24 flex-col items-center justify-center gap-1" onClick={() => navigate(to)}>
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{label}</span>
                </Button>
              ))}
            </div>

            <Card className="shadow">
              <CardHeader>
                <CardTitle className="text-lg">Recent bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.recentBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No bookings yet. They will appear here as tourists book your services.</p>
                ) : (
                  insights.recentBookings.map((booking) => (
                    <Link
                      key={booking.bookingId}
                      to={`/provider/${CATEGORY_TO_SLUG[booking.category]}/${booking.serviceId}/bookings`}
                      className="flex items-center justify-between rounded border p-3 transition-colors hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{booking.touristName}</p>
                        <p className="text-sm text-gray-600">{booking.serviceName}</p>
                        <p className="text-xs text-gray-500">{formatDate(booking.startDateTime)}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusVariant(booking.status)}>{booking.status.toLowerCase()}</Badge>
                        <p className="mt-1 text-sm font-medium">{formatCurrency(booking.totalPrice)}</p>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )
      )}
    </div>
  );
};

export default ProviderDashboardPage;
