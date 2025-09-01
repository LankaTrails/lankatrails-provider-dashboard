import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { label: "Dashboard", slug: "dashboard" },
  { label: "Activity Provider", slug: "activity" },
  { label: "Tour Guides", slug: "tour-guides" },
  { label: "Transportation Services", slug: "transportation" },
  { label: "Food & Beverage Services", slug: "food-beverage" },
  { label: "Accommodation Providers", slug: "accommodation" },
  { label: "Messages", slug: "messages" },
  { label: "Policy Management", slug: "policy" },
  { label: "Licenses Management", slug: "licenses" },
  { label: "Analytics", slug: "analytics" },
];

const ProviderSidebar = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (slug: string) => {
    // Special handling for Dashboard - make it active when at base /provider URL or /provider/dashboard
    if (slug === "dashboard") {
      return (
        location.pathname === "/provider" ||
        location.pathname.includes("dashboard")
      );
    }
    return location.pathname.includes(slug);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="lg:w-64 w-full lg:sticky lg:top-28 lg:self-start mb-8 lg:mb-0">
      <Card className="shadow-lg">
        <CardHeader
          onClick={() => navigate("/provider/profile")}
          className="items-center text-center pb-0 cursor-pointer hover:bg-gray-50  transition-colors"
        >
          <img
            src={
              user && user.profilePictureUrl
                ? `${baseUrl}${user.profilePictureUrl}`
                : "/default-avatar.png"
            }
            alt="avatar"
            className={`w-24 h-24 rounded-full object-cover border-4 -mt-12 mx-auto shadow-md ${
              location.pathname === "/provider/profile"
                ? "border-primary-500"
                : "border-white"
            }`}
          />
          <CardTitle className="mt-2 text-xl">{user?.businessName}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 mt-4">
            {tabs.map((tab) => (
              <li key={tab.slug}>
                <Button
                  variant={isActive(tab.slug) ? "default" : "outline"}
                  className="w-full justify-start capitalize"
                  onClick={() => navigate(`/provider/${tab.slug}`)}
                >
                  {tab.label}
                </Button>
              </li>
            ))}
            <li>
              <Button
                variant="outline"
                className="w-full justify-start capitalize bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

export default ProviderSidebar;
