import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, ArrowLeft, Briefcase, Clock } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.businessName || '',
    email: user?.email || '',
    location: user?.role || '',
    avatar: user?.logoUrl || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // updateUser(form);
    setEditOpen(false);
  };

  // Dummy data – replace with real API data when available
  const services = [
    'Sri Lanka Cultural Triangle Tour',
    'Colombian Coffee Region Adventure',
    'Custom Itinerary Planning'
  ];

  const reminders = [
    'Reply to Emma Wilson – inquiry about Yala Safari',
    'Prepare itinerary for David Chen – July 3',
    'Renew Tour Guide Certification – Aug 15'
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Please sign in to view profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-rose-50">
      {/* <Header /> */}
      {/* Cover banner */}
      <div className="relative h-48 md:h-60 lg:h-72 overflow-hidden">
        {/* dynamic stripes */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700 via-emerald-600 to-orange-500">
          {[...Array(6)].map((_,i)=>(
            <span key={i} className={`absolute inset-y-0 w-1/6 bg-white/5 transform skew-x-[-20deg]`} style={{left:`${i*16.666}%`}} />
          ))}
        </div>

      </div>

      <div className="container mx-auto px-4 mt-8 pb-12">
        {/* Back link */}
        <div className="mb-6">
          <Link to="/provider" className="inline-flex items-center text-primary-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Profile header card */}
        <Card className="p-6 md:p-8 lg:p-10 shadow-xl mb-10 relative overflow-visible">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            <div className="-mt-24 w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={user.logoUrl || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 md:mt-0 space-y-1 flex-1">
              <h2 className="text-3xl font-extrabold">{user.businessName || "Provider"}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.role || 'Sri Lanka'}</span>
              </div>
              <p className="text-gray-600">{user.email}</p>
              <div className="grid grid-cols-3 gap-8 text-center mt-6">
                <div className="px-3">
                  <p className="text-2xl font-extrabold text-primary-600">5</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div className="px-3">
                  <p className="text-2xl font-extrabold text-primary-600">126</p>
                  <p className="text-sm text-gray-600">Trips Organized</p>
                </div>
                <div className="px-3">
                  <p className="text-2xl font-extrabold text-primary-600">72</p>
                  <p className="text-sm text-gray-600">5-Star Reviews</p>
                </div>
              </div>
            </div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="self-start md:self-center">
                  <Edit className="w-4 h-4 mr-1" /> Edit profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Avatar URL</label>
                    <input name="avatar" value={form.avatar} onChange={handleChange} className="w-full border rounded p-2" />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <hr className="my-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-2"><Briefcase className="w-4 h-4" /> Services Provided</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {services.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-2"><Clock className="w-4 h-4" /> Reminders</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {reminders.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Main content grid */}
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-lg">
              <img
                src={user.logoUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-full h-56 object-cover"
              />
              <CardContent className="p-4 text-center space-y-1">
                <h2 className="text-2xl font-bold">{user.businessName}</h2>
                <p className="text-gray-500">{user.email}</p>
                {user.role && <p className="text-sm text-gray-600">{user.role}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <span>Certified Tour Guide</span>
                  <Badge variant="secondary">Locked</Badge>
                </div>
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <span>100+ Trips Completed</span>
                  <Badge variant="secondary">Locked</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
          
            
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
