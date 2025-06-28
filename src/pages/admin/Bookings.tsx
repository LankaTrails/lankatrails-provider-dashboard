import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ListFilter, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for bookings
const allBookings = [
  { id: "BK001", customer: "John Doe", provider: "Ella Spice Garden", service: "Spice Plantation Tour", date: "2023-08-15", status: "Confirmed" },
  { id: "BK002", customer: "Jane Smith", provider: "Kandy View Hotel", service: "Deluxe Room - 2 Nights", date: "2023-08-20", status: "Pending" },
  { id: "BK003", customer: "Peter Jones", provider: "Galle Fort Tours", service: "Historical Walking Tour", date: "2023-08-18", status: "Confirmed" },
  { id: "BK004", customer: "Mary Williams", provider: "Colombo Cabs", service: "Airport Transfer", date: "2023-08-22", status: "Cancelled" },
  { id: "BK005", customer: "David Brown", provider: "Sigiriya Adventures", service: "Hot Air Balloon Ride", date: "2023-09-01", status: "Pending" },
  { id: "BK006", customer: "Susan Davis", provider: "Mirissa Beach Restaurant", service: "Seafood Dinner Reservation", date: "2023-08-25", status: "Confirmed" },
  { id: "BK007", customer: "Robert Wilson", provider: "Yala Safari Jeeps", service: "Full-Day Safari", date: "2023-09-05", status: "Confirmed" },
  { id: "BK008", customer: "Linda Taylor", provider: "Nuwara Eliya Grand Hotel", service: "High Tea Experience", date: "2023-08-30", status: "Cancelled" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Confirmed': return { variant: 'default', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-600/80' };
    case 'Pending': return { variant: 'secondary', icon: Clock, color: '' };
    case 'Cancelled': return { variant: 'destructive', icon: XCircle, color: '' };
    default: return { variant: 'outline', icon: Clock, color: '' };
  }
};

const Bookings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState({ Confirmed: true, Pending: true, Cancelled: true });

    const handleStatusChange = (status: string) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const filteredBookings = allBookings
        .filter(b => statusFilters[b.status as keyof typeof statusFilters])
        .filter(b =>
            b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.provider.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

    return (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Management</CardTitle>
                    <CardDescription>View, track, and manage all customer bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by ID, customer, or provider..."
                                className="pl-8 sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={statusFilters.Confirmed} onCheckedChange={() => handleStatusChange('Confirmed')}>Confirmed</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.Pending} onCheckedChange={() => handleStatusChange('Pending')}>Pending</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.Cancelled} onCheckedChange={() => handleStatusChange('Cancelled')}>Cancelled</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden md:table-cell">Provider</TableHead>
                                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => {
                                    const statusInfo = getStatusVariant(booking.status);
                                    return (
                                        <motion.tr key={booking.id} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                            <TableCell>{booking.customer}</TableCell>
                                            <TableCell className="hidden md:table-cell">{booking.provider}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{booking.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusInfo.variant as any} className={`capitalize ${statusInfo.color}`}>
                                                    <statusInfo.icon className="mr-1 h-3 w-3" />
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10"><Eye className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Bookings;
