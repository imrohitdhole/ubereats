import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchRestaurantDetails } from "../redux/slices/restaurantSlice";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { restaurant, menu, isLoading, error } = useAppSelector((state) => state.restaurant);
  const { items: cart} = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchRestaurantDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = (dish) => {
    // If the cart has items from a different restaurant, the cartSlice will clear them automatically
    // We just need to dispatch the addToCart action with the dish
    dispatch(addToCart({ ...dish, quantity: 1, restaurantId: id }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchRestaurantDetails(id))}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${restaurant.restaurantImage ? `http://localhost:5001${restaurant.restaurantImage}` : "https://via.placeholder.com/1200x400?text=Restaurant+Image"})`,
            transform: "translateZ(0)",
            filter: "brightness(0.7)"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
            {restaurant.cuisine}
          </span>
          <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Our Menu</h2>
          {cart.length > 0 && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition shadow-md"
              onClick={() => navigate("/cart")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              </svg>
              <span>{cart.length} {cart.length === 1 ? "item" : "items"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((dish) => {
            const inCart = cart.find((item) => item.id === dish.id);
            return (
              <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={dish.image || "https://via.placeholder.com/150?text=No+Image"}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                    loading="lazy"
                  />
                  {dish.vegetarian && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Veg
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{dish.name}</h3>
                    <span className="text-green-600 font-bold">${Number(dish.price).toFixed(2)}</span>
                  </div>
                  {dish.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
                  )}
                  
                  {inCart ? (
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                        <button
                          className="bg-gray-100 px-3 py-1 hover:bg-gray-200 transition text-gray-700"
                          onClick={() => handleRemoveFromCart(dish.id)}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium text-gray-800">{inCart.quantity}</span>
                        <button
                          className="bg-gray-100 px-3 py-1 hover:bg-gray-200 transition text-gray-700"
                          onClick={() => handleAddToCart(dish)}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        ${(Number(dish.price) * inCart.quantity).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="w-full mt-2 bg-green-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center space-x-2"
                      onClick={() => handleAddToCart(dish)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
            onClick={() => navigate("/cart")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">{cart.length}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;