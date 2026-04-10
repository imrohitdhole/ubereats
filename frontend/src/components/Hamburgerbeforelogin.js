import React, { useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSignInAlt, 
  faUserPlus, 
  faUtensils, 
  faStore, 
  faTimes,
  faChevronRight,
  faHome
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeMenu } from "../redux/slices/menuSlice";

const SidebarBeforeLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  const handleClose = useCallback(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);

  const MenuItem = ({ icon, label, path }) => (
    <li
      className="transition-all duration-200 cursor-pointer rounded-xl overflow-hidden group"
      onClick={() => {
        navigate(path);
        handleClose();
      }}
    >
      <div className="flex items-center px-4 py-3 hover:bg-green-50 group-hover:text-green-600">
        <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center mr-3">
          <FontAwesomeIcon icon={icon} className="text-gray-500 group-hover:text-green-600" />
        </div>
        <span className="font-medium text-gray-700 group-hover:text-green-600 flex-grow">{label}</span>
        <FontAwesomeIcon 
          icon={faChevronRight} 
          className="text-gray-300 group-hover:text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" 
        />
      </div>
    </li>
  );

  const userItems = [
    { label: "Sign In", icon: faSignInAlt, path: "/login" },
    { label: "Sign Up", icon: faUserPlus, path: "/signup" },
    { label: "Browse Restaurants", icon: faUtensils, path: "/restaurants" }
  ];

  const businessItems = [
    { label: "Restaurant Login", icon: faSignInAlt, path: "/restaurant-login" },
    { label: "Add Your Restaurant", icon: faStore, path: "/restaurant-signup" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex transition-all">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="bg-white w-80 h-screen shadow-xl fixed left-0 top-0 transform transition-all duration-300 ease-in-out z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faHome} className="text-green-600" />
            </div>
            <div className="ml-3">
              <span className="text-lg font-semibold text-gray-900">Uber</span>
              <span className="text-lg font-bold text-green-600">Eats</span>
            </div>
          </div>
          
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {/* User Section */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider px-4 mb-3">For Users</h3>
            <ul className="space-y-1">
              {userItems.map((item) => (
                <MenuItem key={item.label} {...item} />
              ))}
            </ul>
          </div>

          {/* Business Section */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider px-4 mb-3">For Businesses</h3>
            <ul className="space-y-1">
              {businessItems.map((item) => (
                <MenuItem key={item.label} {...item} />
              ))}
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Get started with UberEats</h4>
              <p className="text-gray-600 text-sm mb-3">Create an account and start ordering from restaurants near you.</p>
              <button 
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={() => {
                  navigate("/signup");
                  handleClose();
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarBeforeLogin;