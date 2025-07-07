
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Star,
  Heart,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import AddService from '@/components/AddService';
import EditService from '@/components/EditService';

const Index = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary-500" />,
      title: "Wider Reach",
      description: "Connect with a global audience of travelers actively looking for services in Sri Lanka."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary-500" />,
      title: "Easy Management",
      description: "Manage your bookings, availability, and listings with our intuitive provider dashboard."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary-500" />,
      title: "Direct Communication",
      description: "Communicate directly with your customers to provide a personalized and seamless experience."
    },
    {
      icon: <Star className="w-8 h-8 text-primary-500" />,
      title: "Build Your Reputation",
      description: "Gather reviews and build a strong online reputation to attract more customers."
    }
  ];

  const destinations = [
    {
      name: "Sigiriya",
      image: "/sigiri.jpg",
      description: "Climb the ancient rock fortress of Sigiriya, a UNESCO World Heritage site, and marvel at the stunning frescoes and panoramic views from its summit."
    },
    {
      name: "Kandy",
      image: "/kandy.jpg",
      description: "Experience the cultural heart of Sri Lanka in Kandy. Visit the sacred Temple of the Tooth Relic and enjoy the serene beauty of Kandy Lake."
    },
    {
      name: "Unawatuna",
      image: "/unawatuna.jpg",
      description: "Relax on the golden sands of Unawatuna beach, known for its calm, turquoise waters and vibrant coral reefs, perfect for swimming and snorkeling."
    }
  ];



  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-20"></div>
        <motion.div 
          className="relative container mx-auto px-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6" variants={itemVariants}>
            Showcase Your Service
            <br />
            <span className="text-yellow-300">Reach a Global Audience</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90" variants={itemVariants}>
            Join LankaTrails to increase your visibility, streamline your bookings, and improve customer engagement.
          </motion.p>
          <motion.div className="flex justify-center" variants={itemVariants}>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-transform transform hover:scale-105">
                Become a Provider <Users className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LankaTrails?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience Sri Lanka like never before with our comprehensive travel platform
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, scale: 1.05 }} className="h-full">
                <Card className="text-center shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Destinations Section */}
      <motion.section
        className="py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Iconic locations our providers help you experience.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {destinations.map((destination, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, scale: 1.05 }}>
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">{destination.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white">
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600 font-semibold px-0">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-ocean text-white"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join LankaTrails and connect with travelers from around the world.
          </p>
          <div className="flex justify-center">
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Join as a Service Provider <Heart className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.section>
      <Footer />

      {/* <AddService /> */}
      <EditService />
    </div>
  );
};

export default Index;
