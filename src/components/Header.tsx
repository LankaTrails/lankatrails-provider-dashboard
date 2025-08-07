import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;
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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="LankaTrails" className="w-10 h-10" />
            <span className="text-2xl ml-0 font-bold text-primary-500">
              Lanka
              <span className="text-2xl font-bold text-[#ff6600]">Trails</span>
            </span>
          </Link>

          {/* Desktop User / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {showUser ? (
              <>
                <button
                  onClick={() => navigate("/provider/profile")}
                  className="flex items-center space-x-2 hover:opacity-80"
                >
                  <img
                    src={
                      user && user.profilePictureUrl
                        ? `${baseUrl}${user.profilePictureUrl}`
                        : "/default-avatar.png"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  {/* <span className="font-medium text-gray-700 hidden lg:inline">
                    {(user?.businessName && user.businessName) || "Provider"}
                  </span> */}
                </button>
                {/* <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button> */}
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
