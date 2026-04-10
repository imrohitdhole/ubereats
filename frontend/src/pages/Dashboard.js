import React, { useEffect } from "react";
import Navbar from "../components/Navbarclient";
import RestaurantCard from "../components/RestaurantCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchRestaurants, setFilters } from "../redux/slices/restaurantSlice";
import { toggleFavoriteRestaurant } from "../redux/slices/authSlice";

const CATEGORIES = [
  { name: "Burger", icon: "🍔" },
  { name: "Caribbean", icon: "🥘" },
  { name: "Drinks", icon: "🥤" },
  { name: "Fast Food", icon: "🍟" },
  { name: "Grocery", icon: "🛍️" },
  { name: "Dessert", icon: "🍨" },
  { name: "Japanese", icon: "🍜" },
  { name: "Italian", icon: "🍝" },
  { name: "Box Catering", icon: "🥡" },
  { name: "Seafood", icon: "🦐" },
  { name: "Sushi", icon: "🍣" },
  { name: "Alcohol", icon: "🍷" },
  { name: "Wings", icon: "🍗" },
];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { restaurants, isLoading, error, filters } = useAppSelector((state) => state.restaurant);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchRestaurants(filters));
    }
  }, [dispatch, filters, isAuthenticated]);

  const handleToggleFavorite = (restaurantId, setFavourite) => {
    if (isAuthenticated) {
      dispatch(toggleFavoriteRestaurant(restaurantId));
    }
  };

  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.cuisine ? restaurant.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase()) : true)
    )
    .sort((a, b) => {
      if (filters.sortOrder === "low-to-high") return a.rating - b.rating;
      if (filters.sortOrder === "high-to-low") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar
        searchTerm={filters.search}
        setSearchTerm={(term) => dispatch(setFilters({ ...filters, search: term }))}
        deliveryMode={filters.deliveryMode}
        setDeliveryMode={(mode) => dispatch(setFilters({ ...filters, deliveryMode: mode }))}
        selectedLocation={filters.location}
        setSelectedLocation={(loc) => dispatch(setFilters({ ...filters, location: loc }))}
      />
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Categories</h2>
            {filters.cuisine && (
              <button 
                onClick={() => dispatch(setFilters({ ...filters, cuisine: null }))}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-4">
            {CATEGORIES.map((category, index) => (
              <div 
                key={index} 
                onClick={() => dispatch(setFilters({ ...filters, cuisine: category.name }))}
                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  filters.cuisine === category.name 
                    ? "bg-blue-50 border-2 border-blue-500 shadow-md transform scale-105" 
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className={`text-xs font-medium text-center ${
                  filters.cuisine === category.name ? "text-blue-700" : "text-gray-700"
                }`}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
              {filters.cuisine 
                ? `${filters.cuisine} Restaurants` 
                : "All Restaurants"}
              {filters.search && ` matching "${filters.search}"`}
            </h2>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filters.sortOrder === "high-to-low" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => dispatch(setFilters({ ...filters, sortOrder: "high-to-low" }))}
              >
                Highest Rated
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filters.sortOrder === "low-to-high" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => dispatch(setFilters({ ...filters, sortOrder: "low-to-high" }))}
              >
                Lowest Rated
              </button>
              {filters.sortOrder && (
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => dispatch(setFilters({ ...filters, sortOrder: "" }))}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Unable to load restaurants</h3>
            <p>{error}</p>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                toggleFavorite={(setFavourite) => handleToggleFavorite(restaurant.id, setFavourite)}
                isFavorite={restaurant.isFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-600">
              {filters.search || filters.cuisine 
                ? "Try adjusting your filters or search term." 
                : "There are no restaurants available at this time."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;