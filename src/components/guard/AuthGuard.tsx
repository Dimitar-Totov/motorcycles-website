import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

interface Props {
  children: React.ReactNode;
  require: "auth" | "guest";
  redirectTo: string;
}

export default function AuthGuard({ children, require, redirectTo }: Props) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (require === "auth" && !user) return <Navigate to={redirectTo} replace />;
  if (require === "guest" && user) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
}
