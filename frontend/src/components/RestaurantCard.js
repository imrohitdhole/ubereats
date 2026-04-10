import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart, faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateRating } from "../redux/slices/restaurantSlice";
import { toggleFavoriteRestaurant } from "../redux/slices/authSlice";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get user favorites from Redux state
  const favorites = useAppSelector(state => state.auth.user?.favorites || []);
  const isFavorite = favorites.includes(restaurant?.id);
  
  // Get restaurant rating from Redux state
  const userRating = useAppSelector(state => {
    const ratings = state.restaurant.userRatings || {};
    return ratings[restaurant?.id] || restaurant?.rating || 0;
  });

  if (!restaurant) return null;

  const { id, name, cuisine, restaurantImage } = restaurant;

  const handleStarClick = (index) => {
    // Dispatch action to update rating in Redux
    dispatch(updateRating({ restaurantId: id, rating: index + 1 }));
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    // Dispatch action to toggle favorite in Redux
    dispatch(toggleFavoriteRestaurant(id));
  };

  const handleNavigate = () => {
    navigate(`/restaurant/${id}`);
  };
  
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 cursor-pointer relative flex flex-col w-full"
      onClick={handleNavigate} 
    >
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-4 right-4 text-2xl transition-transform transform hover:scale-125"
      >
        <FontAwesomeIcon
          icon={isFavorite ? solidHeart : regularHeart}
          className={`transition-colors ${isFavorite ? "text-red-500" : "text-gray-400"} hover:text-red-600`}
        />
      </button>

      {/* Restaurant Image */}
      <img 
        src={`http://localhost:5001${restaurantImage}`} 
        alt={name} 
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* Restaurant Name */}
      <h2 className="text-black text-lg font-bold mt-2">{name}</h2>

      {/* Cuisine */}
      <p className="text-sm text-gray-500">{cuisine || "Cuisine not specified"}</p>

      {/* Ratings */}
      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-xl cursor-pointer transition ${i < userRating ? "text-yellow-400" : "text-gray-300"}`}
            onClick={(e) => {
              e.stopPropagation();
              handleStarClick(i);
            }}
          >
            <FontAwesomeIcon icon={i < userRating ? solidStar : regularStar} />
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">{userRating > 0 ? userRating.toFixed(1) : ""}</span>
      </div>
    </div>
  );
};

export default RestaurantCard;