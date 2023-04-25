import { FC, ReactNode, useEffect, useState } from "react";
import { Logo, User } from "../assets/svgs/svgs";
import { logout } from "../utils/functions";
import { Link, useLocation } from "react-router-dom";

import {
  Dashboard,
  UserGroup,
  Group,
  Inventory,
  Client,
  Activities,
  Invoice,
} from "../assets/svgs/svgs";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");

  // Update the activePath state whenever the location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Function to check if the given path is active
  const isActive = (path: string): string => {
    return activePath === path ? "active" : "";
  };

  // Render the layout with the header, sidebar, and main content
  return (
    <div className="layout">
      <div className="header">
        <div className="brand">
          <Logo />
        </div>
        <div className="rightNav">
          <div className="userAvatar">
            <User />
            <div className="text">Danozaur</div>
          </div>
          <div className="rightItem">
            <Link to="/invoice-section">
              <div className="newInvoiceButton">New Invoice</div>
            </Link>
            <div className="logoutButton">
              <div className="text" onClick={logout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bodyHolder">
        <div className="sideBar">
          <ul>
            {/* Render sidebar menu items with the given paths and icons */}
            {[
              { path: "/", icon: <Dashboard />, text: "Dashboard" },
              { path: "/groups", icon: <Group />, text: "Groups" },
              { path: "/inventories", icon: <Inventory />, text: "Inventories" },
              { path: "/shops", icon: <Client />, text: "Clients" },
              { path: "/invoices", icon: <Invoice />, text: "Invoices" },
              { path: "/users", icon: <UserGroup />, text: "Users" },
              { path: "/user-activities", icon: <Activities />, text: "User Activities" },
            ].map(({ path, icon, text }) => (
              <Link to={path} key={path}>
                <li className={isActive(path)}>
                  {icon}
                  <div className="text">{text}</div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="mainContent">
          {/* Render the children components */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
