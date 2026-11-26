import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProviderInsights } from "@/services/insights";
import { formatCurrency } from "@/lib/format";

const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" });

/** Bookings (bars) and revenue (line) for the last six months. */
const AnalyticsCharts = ({ monthly }: { monthly: ProviderInsights["monthly"] }) => {
  const data = monthly.map((m) => ({ name: monthLabel(m.month), bookings: m.bookings, revenue: Number(m.revenue) }));
  const empty = data.every((d) => d.bookings === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance (last 6 months)</CardTitle>
        <CardDescription>Paid bookings and the revenue they earned</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-sm text-gray-500">
            No paid bookings in the last six months yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="bookings" allowDecimals={false} stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="revenue" orientation="right" stroke="#6b7280" fontSize={12}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(value: number, name: string) => (name === "Revenue" ? formatCurrency(value) : value)} />
              <Legend />
              <Bar yAxisId="bookings" dataKey="bookings" name="Bookings" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Line yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCharts;
