import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const data = [
  { name: 'Jan', views: 4000, bookings: 240, earnings: 2400 },
  { name: 'Feb', views: 3000, bookings: 221, earnings: 2210 },
  { name: 'Mar', views: 2000, bookings: 229, earnings: 2290 },
  { name: 'Apr', views: 2780, bookings: 200, earnings: 2000 },
  { name: 'May', views: 1890, bookings: 218, earnings: 2181 },
  { name: 'Jun', views: 2390, bookings: 250, earnings: 2500 },
];

const AnalyticsCharts = () => (
  <Card>
    <CardHeader>
      <CardTitle>Performance Analytics</CardTitle>
    </CardHeader>
    <CardContent className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="earnings" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default AnalyticsCharts;
