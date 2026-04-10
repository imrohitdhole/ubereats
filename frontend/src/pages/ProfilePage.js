import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchUserProfile, updateUserProfile, logout } from "../redux/slices/authSlice";
import { showToast } from "../redux/slices/uiSlice";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "UK", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
];

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  const [showStates, setShowStates] = useState(false);
  const selectedCountry = watch("country");

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchUserProfile(user.id));
    } else {
      navigate("/login");
    }
  }, [dispatch, isAuthenticated, user?.id, navigate]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      if (user.location) {
        const locationParts = user.location.split(", ");
        setValue("city", locationParts[0] || "");
        setValue("state", locationParts[1] || "");
        const countryName = locationParts[2];
        if (countryName) {
          const country = COUNTRIES.find((c) => c.name === countryName);
          if (country) {
            setValue("country", country.code);
            if (country.code === "US") {
              setShowStates(true);
            }
          }
        }
      }
      if (user.profileImage) {
        setPreview(`http://localhost:5001${user.profileImage}`);
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    if (selectedCountry === "US") {
      setShowStates(true);
    } else {
      setShowStates(false);
      setValue("state", "");
    }
  }, [selectedCountry, setValue]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png"].includes(file.type)) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      dispatch(showToast({ message: "Please upload a JPEG/PNG image under 5MB.", type: "error" }));
    }
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated || !user?.id) {
      dispatch(showToast({ message: "User not found. Please log in again.", type: "error" }));
      navigate("/login");
      return;
    }

    let location = data.city || "";
    if (data.state) {
      location += location ? `, ${data.state}` : data.state;
    }
    if (data.country) {
      const countryName = COUNTRIES.find((c) => c.code === data.country)?.name;
      location += location ? `, ${countryName}` : countryName;
    }

    const formData = {
      userId: user.id,
      name: data.name,
      phone: data.phone,
      location,
      profileImage,
    };

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      dispatch(showToast({ message: "Profile updated successfully!", type: "success" }));
    } catch (err) {
      dispatch(showToast({ message: err.message || "Error updating profile.", type: "error" }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userAuth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span>Back to Dashboard</span>
          </button>
          <button
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            <h1 className="absolute bottom-4 left-6 text-white text-3xl font-bold">Your Profile</h1>
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
              <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Profile" className="h-full w-full object-cover" loading="lazy" />
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
                  {watch("name") || "Your Name"}
                </h2>
                <p className="text-gray-500 text-sm">{watch("email") || "your.email@example.com"}</p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
                <p>{error}</p>
                <button
                  onClick={() => dispatch(fetchUserProfile(user.id))}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      {...register("country")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code} className="text-gray-900">
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      {...register("city")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    {showStates ? (
                      <select
                        {...register("state")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="">Select a state</option>
                        {US_STATES.map((state) => (
                          <option key={state.code} value={state.code} className="text-gray-900">
                            {state.code} - {state.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        {...register("state")}
                        maxLength={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase text-gray-900"
                        placeholder="Enter state/province (2-letter code)"
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                          setValue("state", e.target.value);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                      isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2 rounded-md bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;