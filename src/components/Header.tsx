import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const showUser =
    !!user && !["/login", "/register"].includes(location.pathname);

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="LankaTrails" className="w-8 h-8" />
            <span className="text-2xl font-bold text-primary-500">
              LankaTrails
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/destinations"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Destinations
            </Link>
            <Link
              to="/experiences"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop User / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {showUser ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 hover:opacity-80"
                >
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="font-medium text-gray-700 hidden lg:inline">
                    {(user?.name && user.name.split(" ")[0]) || "Provider"}
                  </span>
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-50"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation & auth */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/destinations"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                Destinations
              </Link>
              <Link
                to="/experiences"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                Experiences
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                About
              </Link>
              {showUser ? (
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-primary-500 text-primary-500 hover:bg-primary-50"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    asChild
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;