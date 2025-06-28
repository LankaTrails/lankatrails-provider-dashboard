import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 }, { month: 'Aug', revenue: 6500 },
];

const bookingsByCategoryData = [
  { category: 'Accommodation', bookings: 120 },
  { category: 'Experiences', bookings: 250 },
  { category: 'Tours', bookings: 180 },
  { category: 'Transport', bookings: 90 },
  { category: 'Food', bookings: 150 },
];

const providerLocationData = [
  { name: 'Western', value: 40 },
  { name: 'Central', value: 25 },
  { name: 'Southern', value: 30 },
  { name: 'Uva', value: 15 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const kpiData = [
  { title: "Total Revenue", value: "$125,650", icon: DollarSign, change: "+15.2%", changeType: "increase" },
  { title: "Total Bookings", value: "8,450", icon: ShoppingCart, change: "+12.1%", changeType: "increase" },
  { title: "Active Providers", value: "1,250", icon: Users, change: "+5.8%", changeType: "increase" },
  { title: "Conversion Rate", value: "4.8%", icon: Activity, change: "-0.5%", changeType: "decrease" },
];

const Analytics = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>{kpi.change} vs last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div className="grid gap-6 lg:grid-cols-2" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over the last 8 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Bookings by Category</CardTitle>
              <CardDescription>Distribution of bookings across service categories.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                  <Bar dataKey="bookings" fill="#0088FE" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Provider Geographic Distribution</CardTitle>
            <CardDescription>Provider concentration by province.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={providerLocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {providerLocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
