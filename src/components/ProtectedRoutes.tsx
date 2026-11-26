import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/** Only a signed-in ROLE_PROVIDER user may see provider pages. */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isProvider } = useAuth();
  const location = useLocation();

  if (!isProvider) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
