import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Notifications from "@/components/Notifications";
import { fileUrl } from "@/lib/config";

const Header = () => {
  const { user, isProvider, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const showUser = isProvider && !["/login", "/register"].includes(location.pathname);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={showUser ? "/provider" : "/"} className="flex items-center">
            <img src="/logo.png" alt="LankaTrails" className="h-10 w-10" />
            <span className="ml-0 text-2xl font-bold text-primary-500">
              Lanka
              <span className="text-2xl font-bold text-[#ff6600]">Trails</span>
            </span>
          </Link>

          <div className="hidden items-center space-x-3 md:flex">
            {showUser ? (
              <>
                <Notifications />
                <button
                  onClick={() => navigate("/provider/profile")}
                  className="flex items-center space-x-2 hover:opacity-80"
                  title="Profile"
                >
                  <img
                    src={user?.profilePictureUrl ? fileUrl(user.profilePictureUrl) : "/default-avatar.png"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border object-cover"
                  />
                </button>
                <Button size="icon" variant="outline" onClick={handleLogout} aria-label="Sign out" title="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-primary-500 text-white hover:bg-primary-600" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 border-t pb-4 pt-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {showUser ? (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => { setIsMenuOpen(false); navigate("/provider"); }}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { setIsMenuOpen(false); navigate("/provider/profile"); }}>
                    Profile
                  </Button>
                  <Button variant="outline" className="flex gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full border-primary-500 text-primary-500 hover:bg-primary-50" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button className="w-full bg-primary-500 text-white hover:bg-primary-600" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
