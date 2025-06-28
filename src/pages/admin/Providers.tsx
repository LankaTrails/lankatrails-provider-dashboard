import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, BadgeX, Eye, ListFilter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data - in a real app, this would come from an API
const allProviders = [
    { name: "Ella Spice Garden", owner: "Nimal Perera", service: "Activities & Experiences", location: "Ella, Uva", status: "Approved", date: "2023-06-23" },
    { name: "Kandy View Hotel", owner: "Sunil Jayasuriya", service: "Accommodation", location: "Kandy, Central", status: "Pending", date: "2023-06-24" },
    { name: "Galle Fort Tours", owner: "Anura Bandara", service: "Tour Guide", location: "Galle, Southern", status: "Approved", date: "2023-06-25" },
    { name: "Colombo Cabs", owner: "Saman Kumara", service: "Transport Services", location: "Colombo, Western", status: "Rejected", date: "2023-06-26" },
    { name: "Mirissa Beach Restaurant", owner: "Kamal Silva", service: "Food & Restaurants", location: "Mirissa, Southern", status: "Pending", date: "2023-06-27" },
    { name: "Sigiriya Adventures", owner: "Kamala Devi", service: "Activities & Experiences", location: "Sigiriya, Central", status: "Approved", date: "2023-06-28" },
    { name: "Nuwara Eliya Grand Hotel", owner: "Priya Kumar", service: "Accommodation", location: "Nuwara Eliya, Central", status: "Approved", date: "2023-07-01" },
    { name: "Yala Safari Jeeps", owner: "Ajith Perera", service: "Transport Services", location: "Yala, Southern", status: "Pending", date: "2023-07-02" },
];

const Providers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState({ Approved: true, Pending: true, Rejected: true });

    const handleStatusChange = (status: string) => {
        setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const filteredProviders = allProviders
        .filter(p => statusFilters[p.status as keyof typeof statusFilters])
        .filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.service.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

    return (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <Card>
                <CardHeader>
                    <CardTitle>Provider Management</CardTitle>
                    <CardDescription>View, manage, and approve provider accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, owner, or service..."
                                className="pl-8 sm:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked={statusFilters.Approved} onCheckedChange={() => handleStatusChange('Approved')}>Approved</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.Pending} onCheckedChange={() => handleStatusChange('Pending')}>Pending</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={statusFilters.Rejected} onCheckedChange={() => handleStatusChange('Rejected')}>Rejected</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead className="hidden md:table-cell">Service Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                                    <TableHead className="hidden lg:table-cell">Registered On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProviders.map((provider) => (
                                    <motion.tr key={provider.name} variants={itemVariants} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="font-medium">{provider.name}</div>
                                            <div className="text-sm text-muted-foreground">{provider.owner}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{provider.service}</TableCell>
                                        <TableCell>
                                            <Badge variant={provider.status === 'Approved' ? 'default' : provider.status === 'Pending' ? 'secondary' : 'destructive'} className={`capitalize ${provider.status === 'Approved' ? 'bg-green-600 hover:bg-green-600/80' : ''}`}>{provider.status}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">{provider.location}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{provider.date}</TableCell>
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
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Providers;
