import React from "react";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleFavoriteRestaurant } from "../redux/slices/authSlice";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleToggleFavorite = (restaurantId) => {
    if (isAuthenticated) {
      dispatch(toggleFavoriteRestaurant(restaurantId));
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Favorite Restaurants</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-300 rounded-full mb-2"></div>
              <p className="text-gray-600">Loading favorites...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 shadow-md rounded-lg p-8 text-center max-w-md mx-auto">
            <p className="text-red-600 text-lg mb-4">{error}</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md mx-auto">
            <div className="mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">Please log in to view your favorite restaurants.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Log In
            </button>
          </div>
        ) : user?.favorites?.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md mx-auto">
            <div className="mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">You haven't added any favorite restaurants yet.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {user.favorites.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  toggleFavorite={() => handleToggleFavorite(restaurant.id)} 
                  isFavorite={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;