import React from "react";
import { useSelector } from "react-redux";
import SidebarBeforeLogin from "./SidebarBeforeLogin";

const SidebarContainer = () => {
  const isMenuOpen = useSelector((state) => state.menu.isOpen);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Don't render anything if the menu is closed
  if (!isMenuOpen) return null;

  // Render different sidebar based on authentication status
  return isAuthenticated ? null : <SidebarBeforeLogin />;
};

export default SidebarContainer;