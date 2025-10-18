import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const { login, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log errorMessage changes
  useEffect(() => {
    console.log('🔴 errorMessage state changed:', errorMessage);
  }, [errorMessage]);

  // Debug: Log renders
  console.log('🎨 Login component rendering, errorMessage:', errorMessage, 'isLoading:', isLoading);

  // Sync authError from Redux to local state
  useEffect(() => {
    if (authError) {
      console.log('📥 Syncing authError from Redux:', authError);
      setErrorMessage(authError);
    }
  }, [authError]);

  // Handle registration success message from location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== Login attempt started ===');
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      console.log('Attempting login with:', email);
      await login(email, password);
      console.log('Login successful, navigating to provider dashboard');
      navigate('/provider');
    } catch (err: any) {
      console.error('=== Login error caught in component ===', err);
      // Error will be synced from Redux via useEffect
      // The authError from Redux will be automatically set to local errorMessage
    } finally {
      console.log('=== Login attempt finished, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/login.jpg')" }}
    >
      <div className="min-h-screen bg-black/40">
        {/* <Header /> */}
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
          <motion.div 
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="text-center mb-8">
              <motion.div 
                className="flex justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: -10 }}
              >
                <div className="w-16 h-16 bg-gradient-ocean rounded-xl flex items-center justify-center shadow-lg">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-extrabold text-white mb-2 [text-shadow:2px_2px_4px_rgb(0_0_0/_40%)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Provider Portal
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-200 [text-shadow:1px_1px_2px_rgb(0_0_0/_40%)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Sign in to manage your services
              </motion.p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4"
                    >
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          {successMessage}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4"
                      onAnimationStart={() => console.log('🎬 Alert animation started')}
                      onAnimationComplete={() => console.log('✅ Alert animation completed')}
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errorMessage}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.business@example.com"
                      required
                      className="bg-white/70 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="bg-white/70 h-11 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 text-base h-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </form>

                <div className="text-center pt-6">
                  <p className="text-sm text-gray-700">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                      Sign up here
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

export default Login;