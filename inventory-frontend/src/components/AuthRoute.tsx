import { FC, ReactNode, useState } from "react";
import { logout } from "../utils/functions";
import { useAuth } from "../utils/hooks";
import { Route } from "react-router-dom";
import Layout from "./Layout";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  // Declare loading state to control rendering
  const [loading, setLoading] = useState(true);

  // Use the custom useAuth hook to handle authentication
  useAuth({
    // On error, call the logout function to remove user session
    errorCallBack: () => {
      logout();
    },
    // On success, set loading state to false to render the content
    successCallBack: () => {
      setLoading(false);
    },
  });

  // Render a loading message if the loading state is true
  if (loading) {
    return <i>loading...</i>;
  }

  // Render the Route component with the children prop when authenticated
  return <Route>{children}</Route>;
};

export default AuthRoute;