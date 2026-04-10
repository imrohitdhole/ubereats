import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Homepage from "./pages/Home";
import LoginPage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import RestaurantSignup from "./pages/RestaurantSignup";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantOrdersPage from "./pages/RestaurantOrdersPage";
import ManageRestaurantProfile from "./pages/ManageRestaurantProfile";
import ManageDishes from "./pages/ManageDishes";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import UserOrdersPage from "./pages/userOrdersPage";
import ProtectedRoute from "./routes/protectedRoutes";

function App() {
  return (
    <Provider store={store}>
      <div className="bg-uberBlack text-white min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/restaurant-signup" element={<RestaurantSignup />} />
          <Route path="/restaurant-login" element={<RestaurantLogin />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute requiredType="user" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/user/orders" element={<OrdersPage />} />
            <Route path="/user-orders" element={<UserOrdersPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Restaurant Protected Routes */}
          <Route element={<ProtectedRoute requiredType="restaurant" />}>
            <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
            <Route path="/orders/restaurant/:restaurantId" element={<RestaurantOrdersPage />} />
            <Route path="/restaurant-profile" element={<ManageRestaurantProfile />} />
            <Route path="/manage-dishes/:restaurantId" element={<ManageDishes />} />
          </Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;