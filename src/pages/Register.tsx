
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import Header from '@/components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [brnProof, setBrnProof] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    navigate('/provider-dashboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBrnProof(e.target.files[0]);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/sigup.jpg')" }}
    >
      <div className="min-h-screen bg-black/30">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <div className="w-16 h-16 bg-gradient-ocean rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold text-white mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Become a LankaTrails Provider
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-200 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Register your service and connect with travelers
            </motion.p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Provider Registration</CardTitle>
              <CardDescription className="text-center">
                Fill in your details to create a provider account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="e.g., Ella Spice Garden" required className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brn">Business Registration No.</Label>
                    <Input id="brn" placeholder="e.g., PV123456" required className="bg-white/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brn-proof" className="flex items-center font-medium">
                    Business Registration Proof
                  </Label>
                  <div className="relative flex items-center justify-center w-full">
                    <label htmlFor="brn-proof" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>
                      </div>
                      <Input id="brn-proof" type="file" accept=".pdf" onChange={handleFileChange} required className="hidden" />
                    </label>
                  </div>
                  {brnProof && <p className="text-sm text-green-600 mt-2 font-medium">Selected file: {brnProof.name}</p>}
                  {!brnProof && <p className="text-sm text-gray-500 mt-2">Please upload your business registration document.</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner's Name</Label>
                    <Input id="ownerName" placeholder="Enter owner's full name" required className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="food">Food & Restaurants</SelectItem>
                        <SelectItem value="transport">Transport Services</SelectItem>
                        <SelectItem value="guide">Tour Guide</SelectItem>
                        <SelectItem value="activities">Activities & Experiences</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input id="email" type="email" placeholder="Enter business email" required className="bg-white/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      className="pr-10 bg-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+94 70 123 4567" required className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, Province" required className="bg-white/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your services and what makes you unique"
                    rows={3}
                    className="bg-white/50"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 text-base">
                    Create Provider Account
                  </Button>
                </motion.div>
              </form>

              <div className="text-center pt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  </div>
  );
};

export default Register;
