import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchRestaurantProfile, updateRestaurantProfile } from "../redux/slices/restaurantSlice";
import { showToast } from "../redux/slices/uiSlice";

const ManageRestaurantProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useAppDispatch();
  const { currentRestaurant, isLoading, error } = useAppSelector((state) => state.restaurant);
  const restaurantId = localStorage.getItem("restaurantAuth");

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantProfile(restaurantId));
    } else {
      dispatch(showToast({ message: "No restaurant ID found. Please log in.", type: "error" }));
      navigate("/restaurant-login");
    }
  }, [dispatch, restaurantId, navigate]);

  useEffect(() => {
    if (currentRestaurant) {
      setValue("name", currentRestaurant.name || "");
      setValue("address", currentRestaurant.address || "");
      setValue("phone", currentRestaurant.phone || "");
      setValue("cuisine", currentRestaurant.cuisine || "");
      setValue("description", currentRestaurant.description || "");
      if (currentRestaurant.image) {
        setPreview(`http://localhost:5001${currentRestaurant.image}`);
      }
    }
  }, [currentRestaurant, setValue]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!restaurantId) {
      dispatch(showToast({ message: "No restaurant ID found. Please log in.", type: "error" }));
      navigate("/restaurant-login");
      return;
    }

    const formData = {
      restaurantId,
      name: data.name,
      address: data.address,
      phone: data.phone,
      cuisine: data.cuisine,
      description: data.description,
      image: profileImage,
    };

    try {
      await dispatch(updateRestaurantProfile(formData)).unwrap();
      dispatch(showToast({ message: "Restaurant profile updated successfully!", type: "success" }));
      navigate("/restaurant-dashboard");
    } catch (err) {
      dispatch(showToast({ message: err.message || "Error updating profile.", type: "error" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => navigate("/restaurant-dashboard")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-green-500 to-teal-600">
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            <h1 className="absolute bottom-4 left-6 text-white text-3xl font-bold">Restaurant Profile</h1>
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
              <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Restaurant" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xl">
                      {watch("name") ? watch("name").charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-full">
                  <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {watch("name") || "Your Restaurant"}
                </h2>
                <p className="text-gray-500 text-sm">{watch("address") || "Restaurant Address"}</p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
                <p>{error}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      {...register("address", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="Enter restaurant address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                    <input
                      type="text"
                      {...register("cuisine")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="Enter cuisine type"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register("description")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Enter restaurant description"
                    rows="4"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                      isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/restaurant-dashboard")}
                    className="px-6 py-2 rounded-md bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurantProfile;