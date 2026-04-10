import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/orderSlice";
import { showToast } from "../redux/slices/uiSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total, restaurantId } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { isLoading, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error, type: "error" }));
    }
  }, [error, dispatch]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: "Please log in to place an order.", type: "error" }));
      navigate("/login");
      return;
    }

    if (!items.length) {
      dispatch(showToast({ message: "Your cart is empty.", type: "error" }));
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        restaurantId,
        items,
        total,
      };
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      dispatch(showToast({ message: "Order placed successfully!", type: "success" }));
      navigate("/orders/user");
    } catch (err) {
      dispatch(showToast({ message: err.message || "Failed to place order.", type: "error" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Cart Items</h2>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b py-4 last:border-b-0"
                  >
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={`http://localhost:5001${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span>${(total + 5).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium ${
                    isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  } transition-colors`}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </button>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full mt-4 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;