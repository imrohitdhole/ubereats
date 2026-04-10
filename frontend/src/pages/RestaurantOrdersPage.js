import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrders, updateOrderStatus } from "../redux/slices/orderSlice";
import { showToast } from "../redux/slices/uiSlice";

const RestaurantOrdersPage = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [activeTab, setActiveTab] = useState("all");
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.order);
  const { restaurant, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !restaurant?.id) {
      dispatch(showToast({ message: "Please log in to view orders.", type: "error" }));
      navigate("/restaurant-login");
      return;
    }

    if (restaurantId && restaurant.id === restaurantId) {
      dispatch(fetchOrders({ restaurantId }));
    } else {
      dispatch(showToast({ message: "Invalid restaurant ID.", type: "error" }));
      navigate("/restaurant-dashboard");
    }
  }, [dispatch, restaurantId, restaurant, isAuthenticated, navigate]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      dispatch(showToast({ message: `Order ${orderId} updated to ${newStatus}`, type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: err.message || "Failed to update order status.", type: "error" }));
    }
  };

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((order) => order.order_status.toLowerCase() === activeTab);

  const getStatusCount = (status) => {
    return orders.filter((order) => order.order_status.toLowerCase() === status.toLowerCase()).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Preparing": return "bg-yellow-100 text-yellow-800";
      case "Pick-up Ready": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getButtonColor = (status) => {
    switch (status) {
      case "Preparing": return "bg-yellow-500 hover:bg-yellow-600";
      case "Pick-up Ready": return "bg-blue-500 hover:bg-blue-600";
      case "Delivered": return "bg-green-500 hover:bg-green-600";
      case "Cancelled": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Orders</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => dispatch(fetchOrders({ restaurantId }))}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              Refresh Orders
            </button>
            <button
              onClick={() => navigate("/restaurant-dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "all" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              All Orders
              <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-gray-100">{orders.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("preparing")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "preparing" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Preparing
              <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">{getStatusCount("Preparing")}</span>
            </button>
            <button
              onClick={() => setActiveTab("pick-up ready")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "pick-up ready" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Ready for Pickup
              <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{getStatusCount("Pick-up Ready")}</span>
            </button>
            <button
              onClick={() => setActiveTab("delivered")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "delivered" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Delivered
              <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-green-100 text-green-800">{getStatusCount("Delivered")}</span>
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "cancelled" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Cancelled
              <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-red-100 text-red-800">{getStatusCount("Cancelled")}</span>
            </button>
          </nav>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => dispatch(fetchOrders({ restaurantId }))}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "all" ? "No orders have been placed yet." : `No orders with status "${activeTab}" found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order, index) => (
              <div
                key={`${order.order_id}-${index}`}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 transition duration-150 hover:shadow-md"
              >
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Order #{order.order_id}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Delivery Address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.delivery_address}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Item</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-medium">{order.dish_name} × {order.quantity}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                        </svg>
                        Total Price
                      </dt>
                      <dd className="mt-1 text-xl font-bold text-gray-900">${parseFloat(order.total_price).toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
                {order.order_status !== "Delivered" && order.order_status !== "Cancelled" && (
                  <div className="px-4 py-4 sm:px-6 bg-gray-50">
                    <div className="flex flex-wrap gap-2 justify-between">
                      <button
                        className={`${
                          order.order_status === "Preparing" ? "bg-gray-300 cursor-not-allowed" : `${getButtonColor("Preparing")} text-white`
                        } px-3 py-1.5 rounded text-sm font-medium flex-1`}
                        onClick={() => handleUpdateOrderStatus(order.order_id, "Preparing")}
                        disabled={order.order_status === "Preparing"}
                      >
                        Preparing
                      </button>
                      <button
                        className={`${
                          order.order_status === "Pick-up Ready" ? "bg-gray-300 cursor-not-allowed" : `${getButtonColor("Pick-up Ready")} text-white`
                        } px-3 py-1.5 rounded text-sm font-medium flex-1`}
                        onClick={() => handleUpdateOrderStatus(order.order_id, "Pick-up Ready")}
                        disabled={order.order_status === "Pick-up Ready"}
                      >
                        Ready
                      </button>
                      <button
                        className={`${getButtonColor("Delivered")} text-white px-3 py-1.5 rounded text-sm font-medium flex-1`}
                        onClick={() => handleUpdateOrderStatus(order.order_id, "Delivered")}
                      >
                        Delivered
                      </button>
                      <button
                        className={`${getButtonColor("Cancelled")} text-white px-3 py-1.5 rounded text-sm font-medium flex-1`}
                        onClick={() => handleUpdateOrderStatus(order.order_id, "Cancelled")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrdersPage;