// src/components/Hamburgermenu.js
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, 
  faBookmark, 
  faHeart, 
  faUser, 
  faSignOutAlt,
  faStore,
  faUserPlus,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { openMenu, closeMenu } from "../redux/slices/menuSlice";
import { logout } from "../redux/slices/authSlice";

const HamburgerMenu = () => {
    const isOpen = useAppSelector((state) => state.menu.isOpen);
    const dispatch = useAppDispatch();
    const location = useLocation();
    
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          dispatch(closeMenu());
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }, [dispatch]);
    
    useEffect(() => {
      dispatch(closeMenu());
    }, [location, dispatch]);

    const isActive = (path) => {
      return location.pathname === path;
    };

    const handleLogout = () => {
      dispatch(logout());
      // Additional logout logic if needed
    };

    return (
        <>
            {/* Hamburger Button */}
            <button 
                onClick={() => dispatch(openMenu())} 
                className="text-black hover:text-green-600 focus:outline-none transition-colors duration-200"
                aria-label="Open menu"
            >
                <FontAwesomeIcon icon={faBars} className="text-2xl" />
            </button>

            {/* Sidebar Menu */}
            <div 
                className={`fixed top-0 left-0 w-80 h-full bg-white shadow-xl transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
                aria-hidden={!isOpen}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-black">
                        Uber <span className="text-green-600">Eats</span>
                    </h1>
                    <button 
                        onClick={() => dispatch(closeMenu())} 
                        className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close menu"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Sidebar Content */}
                <nav className="flex flex-col px-2 py-4">
                    {/* User Section */}
                    <div className="px-4 py-2 mb-4">
                        <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Your Account</h2>
                        <ul className="space-y-1">
                            <li>
                                <Link 
                                    to="/user-orders" 
                                    className={`flex items-center px-4 py-2 rounded-lg ${isActive('/user-orders') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FontAwesomeIcon icon={faBookmark} className="w-5 h-5" />
                                    <span className="ml-3">Orders</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/favorites" 
                                    className={`flex items-center px-4 py-2 rounded-lg ${isActive('/favorites') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                                    <span className="ml-3">Favorites</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/profile" 
                                    className={`flex items-center px-4 py-2 rounded-lg ${isActive('/profile') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                                    <span className="ml-3">Profile</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Business Options */}
                    <div className="px-4 py-2 mb-4">
                        <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Business</h2>
                        <ul className="space-y-1">
                            <li>
                                <Link 
                                    to="/restaurant-login" 
                                    className={`flex items-center px-4 py-2 rounded-lg ${isActive('/restaurant-login') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" />
                                    <span className="ml-3">Restaurant Login</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/restaurant-signup" 
                                    className={`flex items-center px-4 py-2 rounded-lg ${isActive('/add-restaurant') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FontAwesomeIcon icon={faStore} className="w-5 h-5" />
                                    <span className="ml-3">Add your restaurant</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Sign Out Button */}
                    <div className="mt-auto px-4 pt-4 pb-2 border-t border-gray-100">
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center w-full px-4 py-2 text-left rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                            <span className="ml-3">Sign out</span>
                        </button>
                    </div>
                </nav>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out" 
                    onClick={() => dispatch(closeMenu())}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default HamburgerMenu;