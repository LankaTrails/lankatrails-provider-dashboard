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
  } else if (base === "profile") {
    links = [
      { to: `/provider/profile/details`, label: "Profile" },
      { to: `/provider/profile/contact`, label: "Contact Person" },
    ];
  }else if (base === "policy") {
    links = [
      { to: `/provider/policy/all`, label: "All Policies" },
      // { to: `/provider/policy/add`, label: "New Policy" },
      { to: `/provider/policy/activity`, label: "Activity" },
      { to: `/provider/policy/tour-guide`, label: "Tour Guide" },
      { to: `/provider/policy/transport`, label: "Transportation" },
      { to: `/provider/policy/food-beverage`, label: "Food & Beverage" },
      { to: `/provider/policy/accommodation`, label: "Accommodation" },
    ];
  } else {
    // Default empty or general links if needed
    links = [];
  }

  // Helper function to determine if a link should be active
  const shouldLinkBeActive = (
    link: { to: string; label: string },
    isActive: boolean
  ) => {
    const isBaseUrl = location.pathname === `/provider/${base}`;

    // For service types, make List button active when at base URL or /list
    if (
      [
        "activity",
        "transportation",
        "accommodation",
        "food-beverage",
        "tour-guides",
      ].includes(base || "")
    ) {
      const isListButton = link.label === "List";
      return isActive || (isListButton && isBaseUrl);
    }

    // For messages, make Inbox button active when at base URL or /inbox
    if (base === "messages") {
      const isInboxButton = link.label === "Inbox";
      return isActive || (isInboxButton && isBaseUrl);
    }

    // For analytics, make Overview button active when at base URL or /overview
    if (base === "analytics") {
      const isOverviewButton = link.label === "Overview";
      return isActive || (isOverviewButton && isBaseUrl);
    }

    // For profile, make Profile button active when at base URL or /details
    if (base === "profile") {
      const isProfileButton = link.label === "Profile";
      return isActive || (isProfileButton && isBaseUrl);
    }

    if (base === "policy") {
      const isProfileButton = link.label === "All Policies";
      return isActive || (isProfileButton && isBaseUrl);
    }

    return isActive;
  };

  return (
    <div className="rounded-lg border bg-card sticky top-[72px] z-40">
      <div className="container mx-auto px-4 flex space-x-4 overflow-x-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => {
              const shouldBeActive = shouldLinkBeActive(link, isActive);

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
