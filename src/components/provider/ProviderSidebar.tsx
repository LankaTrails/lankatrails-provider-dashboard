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
  { label: "Profile", slug: "profile" },
  { label: "Messages", slug: "messages" },
  { label: "Analytics", slug: "analytics" },
];

const ProviderSidebar = () => {
  const { user } = useAuth();
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

  return (
    <aside className="lg:w-64 w-full lg:sticky lg:top-28 lg:self-start mb-8 lg:mb-0">
      <Card className="shadow-lg">
        <CardHeader
          onClick={() => navigate("/profile")}
          className="items-center text-center pb-0 cursor-pointer hover:bg-gray-50  transition-colors"
        >
          <img
            src={user?.profilePictureUrl || "/default-avatar.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white -mt-12 mx-auto shadow-md"
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
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

export default ProviderSidebar;
