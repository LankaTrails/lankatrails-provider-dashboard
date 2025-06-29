
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="logo.png" alt="LankaTrails" className="w-8 h-8" />
              <span className="text-2xl font-bold">LankaTrails</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your ultimate travel companion for exploring the beautiful island of Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/experiences" className="text-gray-300 hover:text-white transition-colors">Experiences</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="font-semibold mb-4">For Providers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/provider-register" className="text-gray-300 hover:text-white transition-colors">Join as Provider</Link></li>
              <li><Link to="/provider-dashboard" className="text-gray-300 hover:text-white transition-colors">Provider Dashboard</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>support@lankatrails.com</li>
              <li>+94 11 234 5678</li>
              <li>Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 LankaTrails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
