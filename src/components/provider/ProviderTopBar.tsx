import { NavLink, useLocation } from "react-router-dom";

const ProviderTopBar = () => {
  const location = useLocation();

  // Extract current base (e.g., activity, transport, messages, analytics)
  const match = location.pathname.match(/^\/provider\/([^/]+)/);
  const base = match ? match[1] : null;

  // Define topbar links based on base
  let links: { to: string; label: string }[] = [];

  if (
    [
      "activity",
      "transportation",
      "accommodation",
      "food-beverage",
      "tour-guides",
    ].includes(base || "")
  ) {
    // Service types share the same top bar
    links = [
      { to: `/provider/${base}/list`, label: "List" },
      { to: `/provider/${base}/add`, label: "Add New" },
      { to: `/provider/${base}/bookings`, label: "Bookings" },
      { to: `/provider/${base}/reviews`, label: "Reviews" },
      { to: `/provider/${base}/analytics`, label: "Analytics" },
    ];
  } else if (base === "messages") {
    links = [
      { to: `/provider/messages/inbox`, label: "Inbox" },
      { to: `/provider/messages/sent`, label: "Sent" },
    ];
  } else if (base === "analytics") {
    links = [
      { to: `/provider/analytics/overview`, label: "Overview" },
      { to: `/provider/analytics/performance`, label: "Performance" },
    ];
  } else {
    // Default empty or general links if needed
    links = [];
  }

  return (
    <div className="rounded-lg border bg-card sticky top-[72px] z-40">
      <div className="container mx-auto px-4 flex space-x-4 overflow-x-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => {
              // Special handling for List button - make it active when at base URL or /list
              const isListButton = link.label === "List";
              const isBaseUrl = location.pathname === `/provider/${base}`;
              const shouldBeActive = isActive || (isListButton && isBaseUrl);

              return `py-2 px-3 text-sm font-medium ${
                shouldBeActive
                  ? "border-b-2 border-primary-500 text-primary-500"
                  : "text-gray-600 hover:text-primary-500"
              }`;
            }}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProviderTopBar;
