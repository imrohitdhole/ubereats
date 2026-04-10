import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ requiredType }) => {
  const { isAuthenticated, user, restaurant } = useAppSelector((state) => state.auth);
  const userToken = localStorage.getItem('token');
  const restaurantToken = localStorage.getItem('restaurantAuth');

  console.log('🟢 User Token:', userToken);
  console.log('🟠 Restaurant Token:', restaurantToken);
  console.log('🔵 Auth State:', { isAuthenticated, user, restaurant });

  // Helper function to check if a token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Handle expired tokens
  if (userToken && isTokenExpired(userToken)) {
    console.warn('User token expired, logging out...');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  if (restaurantToken && isTokenExpired(restaurantToken)) {
    console.warn('Restaurant token expired, logging out...');
    localStorage.removeItem('restaurantAuth');
    return <Navigate to="/restaurant-login" replace />;
  }

  // Check user authentication for user routes
  if (requiredType === 'user') {
    if (isAuthenticated && user && userToken) {
      return <Outlet />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check restaurant authentication for restaurant routes
  if (requiredType === 'restaurant') {
    if (isAuthenticated && restaurant && restaurantToken) {
      return <Outlet />;
    }
    return <Navigate to="/restaurant-login" replace />;
  }

  // Default redirect for unauthorized access
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
