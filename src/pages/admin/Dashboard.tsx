import {
  ShoppingCart,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BadgeCheck, BadgeX, Eye } from "lucide-react";

const providers = [
  { name: "Ella Spice Garden", owner: "Nimal Perera", service: "Activities & Experiences", location: "Ella, Uva", status: "Approved", date: "2023-06-23" },
  { name: "Kandy View Hotel", owner: "Sunil Jayasuriya", service: "Accommodation", location: "Kandy, Central", status: "Pending", date: "2023-06-24" },
  { name: "Galle Fort Tours", owner: "Anura Bandara", service: "Tour Guide", location: "Galle, Southern", status: "Approved", date: "2023-06-25" },
  { name: "Colombo Cabs", owner: "Saman Kumara", service: "Transport Services", location: "Colombo, Western", status: "Rejected", date: "2023-06-26" },
  { name: "Mirissa Beach Restaurant", owner: "Kamal Silva", service: "Food & Restaurants", location: "Mirissa, Southern", status: "Pending", date: "2023-06-27" },
  { name: "Sigiriya Adventures", owner: "Kamala Devi", service: "Activities & Experiences", location: "Sigiriya, Central", status: "Approved", date: "2023-06-28" },
];

const monthlySignups = [
  { month: 'Jan', signups: 4 }, { month: 'Feb', signups: 3 }, { month: 'Mar', signups: 5 },
  { month: 'Apr', signups: 7 }, { month: 'May', signups: 6 }, { month: 'Jun', signups: 8 },
];

const providerStatusData = [
  { name: 'Approved', value: providers.filter(p => p.status === 'Approved').length },
  { name: 'Pending', value: providers.filter(p => p.status === 'Pending').length },
  { name: 'Rejected', value: providers.filter(p => p.status === 'Rejected').length },
];

const COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

const Dashboard = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <motion.div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="text-green-500">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Bookings</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Monthly Signups</CardTitle>
            </CardHeader>
            <CardContent className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySignups} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}} />
                  <Bar dataKey="signups" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>Recent Provider Registrations</CardTitle>
              <CardDescription>Manage provider accounts and view their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead className="hidden md:table-cell">Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.slice(0, 5).map((provider) => (
                    <motion.tr key={provider.name} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-muted-foreground hidden md:inline">{provider.owner}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{provider.service}</TableCell>
                      <TableCell>
                        <Badge variant={provider.status === 'Approved' ? 'default' : provider.status === 'Pending' ? 'secondary' : 'destructive'} className={`capitalize ${provider.status === 'Approved' ? 'bg-green-600 hover:bg-green-600/80' : ''}`}>{provider.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10"><Eye className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-green-500 hover:bg-green-500/10"><BadgeCheck className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10"><BadgeX className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>Provider Status Overview</CardTitle>
              <CardDescription>Distribution of provider account statuses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={providerStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {providerStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}

export default Dashboard;
