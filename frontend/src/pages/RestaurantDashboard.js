import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbarclient";
import { Bell, ChefHat, ShoppingBag, Settings, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchRestaurantProfile, fetchRestaurantMetrics } from "../redux/slices/restaurantSlice";
import { fetchOrders } from "../redux/slices/orderSlice";
import { logout } from "../redux/slices/authSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, metrics, isLoading, error } = useAppSelector((state) => state.restaurant);
  const { orders } = useAppSelector((state) => state.order);
  const restaurantId = localStorage.getItem("restaurantAuth");

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantProfile(restaurantId));
      dispatch(fetchRestaurantMetrics(restaurantId));
      dispatch(fetchOrders({ restaurantId }));
    }
  }, [dispatch, restaurantId]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("restaurantAuth");
    navigate("/restaurant-login");
  };

  if (!restaurantId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">No Restaurant ID found. Please log in again to access your dashboard.</p>
          <button 
            onClick={() => navigate("/restaurant-login")} 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
            <p>{error}</p>
            <button
              onClick={() => {
                dispatch(fetchRestaurantProfile(restaurantId));
                dispatch(fetchRestaurantMetrics(restaurantId));
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderCount = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-10 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! {profile.name || "Your Restaurant"}</h1>
            <p className="opacity-80">Manage your restaurant and see how your business is growing</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => dispatch(fetchOrders({ restaurantId }))}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Refresh Orders
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Today's Orders</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{orderCount}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-500 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                <span>{metrics?.orderGrowth || "24%"} from yesterday</span>
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Dishes</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{metrics?.activeDishes || 18}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ChefHat className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <p className="text-gray-500">
                {metrics?.newDishes || 2} dishes added this week
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">${metrics?.totalRevenue || 1240}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="text-purple-600 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-500 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                <span>{metrics?.revenueGrowth || "8%"} from last week</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Your Restaurant</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="bg-green-500 text-white p-3 inline-block rounded-lg mb-4">
                <ChefHat size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Dishes</h3>
              <p className="text-gray-600 mb-4">Add, edit or remove dishes and update their availability status.</p>
              <button 
                onClick={() => navigate(`/manage-dishes/${restaurantId}`)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition duration-200"
              >
                Go to Dishes
              </button>
            </div>
          </div>
          <div className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="bg-orange-500 text-white p-3 inline-block rounded-lg mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">View Orders</h3>
              <p className="text-gray-600 mb-4">Manage active orders, see order history and track deliveries.</p>
              <button 
                onClick={() => navigate(`/orders/restaurant/${restaurantId}`)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition duration-200"
              >
                Check Orders
              </button>
            </div>
          </div>
          <div className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="bg-blue-500 text-white p-3 inline-block rounded-lg mb-4">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Restaurant Profile</h3>
              <p className="text-gray-600 mb-4">Update your restaurant information, hours, and settings.</p>
              <button 
                onClick={() => navigate("/restaurant-profile")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition duration-200"
              >
                Manage Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="font-medium text-gray-800">Latest Updates</span>
              <button className="text-green-500 hover:text-green-600 text-sm font-medium">View All</button>
            </div>
            <div className="divide-y">
              <div className="py-4 flex items-start">
                <div className="bg-green-100 p-2 rounded-md mr-4">
                  <Bell size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">New order received</p>
                  <p className="text-gray-500 text-sm">Order #1242 - Chicken Biryani, Naan</p>
                  <p className="text-gray-400 text-xs mt-1">10 minutes ago</p>
                </div>
              </div>
              <div className="py-4 flex items-start">
                <div className="bg-blue-100 p-2 rounded-md mr-4">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Order completed</p>
                  <p className="text-gray-500 text-sm">Order #1238 was delivered successfully</p>
                  <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="py-4 flex items-start">
                <div className="bg-purple-100 p-2 rounded-md mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Menu updated</p>
                  <p className="text-gray-500 text-sm">You added 2 new items to your menu</p>
                  <p className="text-gray-400 text-xs mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;