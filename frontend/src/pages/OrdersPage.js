import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrders, fetchRestaurantOrders } from "../redux/slices/orderSlice";
import { showToast } from "../redux/slices/uiSlice";

const OrdersPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.order);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (type === "user" && !isAuthenticated) {
      dispatch(showToast({ message: "Please log in to view your orders.", type: "error" }));
      navigate("/login");
      return;
    }

    if (type === "user" && user?.id) {
      dispatch(fetchOrders());
    } else if (type === "restaurant" && id) {
      dispatch(fetchRestaurantOrders());
    } else {
      dispatch(showToast({ message: "Invalid request. Missing ID.", type: "error" }));
      navigate(type === "user" ? "/dashboard" : "/restaurant-dashboard");
    }
  }, [dispatch, type, id, isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => navigate(type === "user" ? "/dashboard" : "/restaurant-dashboard")}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {type === "user" ? "Your Orders" : "Restaurant Orders"}
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">No orders found.</p>
            <button
              onClick={() => navigate(type === "user" ? "/dashboard" : "/restaurant-dashboard")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {type === "user" ? "Browse Restaurants" : "Back to Dashboard"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Items:</span>{" "}
                  {order.items.map((item) => item.name).join(", ")}
                </p>
                {type === "restaurant" && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Customer:</span> {order.customer_name}
                  </p>
                )}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() =>
                    navigate(
                      type === "user"
                        ? `/order-details/${order.id}`
                        : `/restaurant-order-details/${order.id}`
                    )
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;