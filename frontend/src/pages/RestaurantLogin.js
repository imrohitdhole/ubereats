import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/Hamburgermenu";
import loginBg from "../assets/homepage-bg2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUtensils, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginRestaurant } from "../redux/slices/authSlice";
import { showToast } from "../redux/slices/uiSlice";
import DOMPurify from "dompurify";

const RestaurantLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: DOMPurify.sanitize(value) });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(loginRestaurant(credentials)).unwrap();
      dispatch(showToast({ message: "Login successful!", type: "success" }));
      navigate("/restaurant-dashboard");
    } catch (err) {
      const message = err.status === 429
        ? "Too many login attempts. Please try again later."
        : err.message || "Invalid email or password!";
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen relative bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>

      <nav className="flex justify-between items-center px-6 py-4 bg-white fixed top-0 left-0 w-full shadow-md z-50">
        <div className="flex items-center gap-x-4">
          <HamburgerMenu />
          <a href="/" className="flex items-center text-xl text-black">
            <FontAwesomeIcon icon={faUtensils} className="mr-2 text-green-600" />
            <span className="font-bold">Uber Eats</span>
            <span className="font-bold ml-1 text-green-600">for Restaurants</span>
          </a>
        </div>
        <div>
          <a
            href="/restaurant-signup"
            className="text-green-600 font-medium hover:text-green-700 transition-colors mr-4"
          >
            Create an account
          </a>
          <a
            href="/"
            className="text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Help
          </a>
        </div>
      </nav>

      <div className="flex h-screen pt-16">
        <div className="hidden md:flex md:w-1/2 items-center justify-center relative z-10 p-8">
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-6">Grow your restaurant business with Uber Eats</h1>
            <p className="text-xl mb-8 opacity-90">Join thousands of restaurants that deliver with Uber Eats and reach new customers.</p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold">30%</p>
                <p className="text-sm">Average increase in restaurant sales</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold">15M+</p>
                <p className="text-sm">Active customers worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
            <p className="text-gray-600 mb-6">Sign in to manage your restaurant</p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="flex items-center space-x-2 text-gray-600">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="text-green-600 hover:text-green-700 text-sm">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleLogin}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="animate-pulse">Logging in...</span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </>
                )}
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Don't have an account?
                <a href="/restaurant-signup" className="text-green-600 ml-1 font-medium hover:text-green-700">
                  Sign up now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;